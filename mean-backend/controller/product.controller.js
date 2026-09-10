const Product = require('../models/product.model');
const Category = require('../models/category.model');

const getProducts = async (req, res) => {
  try {
    const { search, category, sub, season, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true, isDeleted: false };
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (category) filter.categoryId = category;
    if (sub) filter.subCategoryId = sub;
    if (season) filter.season = season;
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate('categoryId', 'name slug').populate('subCategoryId', 'name slug')
      .sort(sort === 'top' ? { soldCount: -1, createdAt: -1 } : { createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, products, pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getAdminProducts = async (req, res) => {
  const products = await Product.find().populate('categoryId', 'name slug').populate('subCategoryId', 'name slug').sort({ createdAt: -1 });
  res.json({ success: true, products, pagination: { total: products.length, page: 1, pages: 1, limit: products.length } });
};

const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true, isDeleted: false })
    .populate('categoryId', 'name slug').populate('subCategoryId', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const related = await Product.find({ _id: { $ne: product._id }, categoryId: product.categoryId, isActive: true, isDeleted: false }).limit(4);
  res.json({ success: true, data: product, related });
};

const getProductById = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true, isDeleted: false }).populate('categoryId', 'name slug').populate('subCategoryId', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

const createProduct = async (req, res) => {
  try {
    const data = { ...req.body, image: req.file ? `/uploads/${req.file.filename}` : req.body.image };
    if (!data.image) return res.status(400).json({ success: false, message: 'Product image is required' });
    const product = await Product.create(data);
    res.status(201).json({ success: true, data: product });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true, isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

module.exports = { getProducts, getAdminProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct };
