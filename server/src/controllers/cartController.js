import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price images stock');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const fetchCart = async (req, res) => {
  try {
    const cart = await getCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1, size = '', color = '' } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.stock < qty) return res.status(400).json({ message: 'Insufficient stock.' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    );
    if (existing) {
      existing.qty += qty;
      if (existing.qty > product.stock) return res.status(400).json({ message: 'Insufficient stock.' });
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        qty,
        size,
        color,
      });
    }
    await cart.save();
    const updated = await getCart(req.user._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    const product = await Product.findById(item.product);
    if (product && qty > product.stock) return res.status(400).json({ message: 'Insufficient stock.' });
    item.qty = qty;
    if (item.qty <= 0) item.remove();
    await cart.save();
    const updated = await getCart(req.user._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    const updated = await getCart(req.user._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    const cart = await getCart(req.user._id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
