import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) return res.status(503).json({ message: 'Payment is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized.' });
    if (order.isPaid) return res.status(400).json({ message: 'Order already paid.' });

    const amountInPaise = Math.round(order.totalPrice * 100);
    if (amountInPaise < 100) return res.status(400).json({ message: 'Amount must be at least ₹1.' });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId.toString().slice(-40),
      notes: { orderId: order._id.toString() },
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalPrice,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({ message: 'Payment is not configured.' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ message: 'Missing payment details.' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized.' });
    if (order.isPaid) return res.status(400).json({ message: 'Order already paid.' });

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: new Date(),
      'paymentResult.id': razorpay_payment_id,
      'paymentResult.status': 'captured',
    });

    res.json({ success: true, message: 'Payment verified.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
