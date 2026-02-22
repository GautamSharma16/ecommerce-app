import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      featured,
    } = req.query;
    const query = { isActive: true };
    if (category) query.category = new RegExp(category, 'i');
    if (minPrice != null) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice != null) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    if (featured === 'true') query.featured = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    res.json({ products, totalPages: Math.ceil(total / Number(limit)), page: Number(page), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
