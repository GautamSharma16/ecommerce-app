import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

// Products
export const adminGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    if (category) query.category = new RegExp(category, 'i');
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    res.json({ products, totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminCreateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Orders
export const adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    res.json({ orders, totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'delivered' && { isDelivered: true, deliveredAt: new Date() }),
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Users
export const adminGetUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(query),
    ]);
    res.json({ users, totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { ...(role && { role }) }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminGetStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [userCount, productCount, orderCount, totalSales, lowStockCount, monthlySales] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Product.countDocuments({ countInStock: { $lt: 10 } }),
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const formattedSales = monthlySales.map((m) => {
      const parts = m._id.split('-');
      const date = new Date(parts[0], parts[1] - 1);
      return { month: date.toLocaleString('default', { month: 'short' }), sales: m.sales };
    });

    res.json({
      userCount,
      productCount,
      orderCount,
      totalSales: totalSales[0]?.total ?? 0,
      lowStockCount,
      monthlySales: formattedSales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminGetReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } }).select('name reviews');
    let allReviews = [];
    products.forEach((p) => {
      p.reviews.forEach((r) => {
        allReviews.push({ ...r.toObject(), productId: p._id, productName: p.name });
      });
    });

    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = allReviews.slice(skip, skip + Number(limit));
    res.json({ reviews: paginated, totalPages: Math.ceil(allReviews.length / Number(limit)), total: allReviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const adminDeleteReview = async (req, res) => {
  try {
    const product = await Product.findOne({ 'reviews._id': req.params.reviewId });
    if (!product) return res.status(404).json({ message: 'Review not found.' });

    product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.reviewId);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length > 0 ? product.reviews.reduce((a, c) => a + c.rating, 0) / product.reviews.length : 0;

    await product.save();
    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
