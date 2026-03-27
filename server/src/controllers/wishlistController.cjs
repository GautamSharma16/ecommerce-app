const Wishlist = require("../models/Wishlist.cjs");

// 🔧 helper function
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  return wishlist;
};

// 📦 Fetch wishlist
const fetchWishlist = async (req, res) => {
  try {
    const wishlist = await getWishlist(req.user._id);
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updated = await getWishlist(req.user._id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found." });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );

    await wishlist.save();

    const updated = await getWishlist(req.user._id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT
module.exports = {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
};