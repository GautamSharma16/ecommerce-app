import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const TAX_RATE = 0.1;
const SHIPPING_FLAT = 9.99;

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty.' });

    const orderItems = [];
    let itemsPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}.` });
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
      });
      itemsPrice += product.price * item.qty;
    }
    const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100;
    const shippingPrice = itemsPrice >= 100 ? 0 : SHIPPING_FLAT;
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'razorpay',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
