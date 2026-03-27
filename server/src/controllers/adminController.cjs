const User = require("../models/User.cjs");
const Product = require("../models/Product.cjs");
const Order = require("../models/Order.cjs");
const { validationResult } = require("express-validator");

// 📦 Products
const adminGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }
    if (category) query.category = new RegExp(category, "i");

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort("-createdAt").skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const adminCreateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found." });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found." });

    res.json({ message: "Product deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 📦 Orders
const adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "delivered" && {
          isDelivered: true,
          deliveredAt: new Date(),
        }),
      },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found." });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 👤 Users
const adminGetUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
          ],
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }) },
      { new: true }
    ).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found." });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 📊 EXPORT
module.exports = {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetUsers,
  adminUpdateUser,
  adminGetStats: async () => {}, // (same logic rehne de ya baad me add kar)
  adminGetReviews: async () => {},
  adminDeleteReview: async () => {},
};