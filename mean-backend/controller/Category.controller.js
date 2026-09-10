const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

const slugify = value => String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getCategories = async (req, res) => res.json({ success: true, data: await Category.find({ isActive: true }).sort({ name: 1 }) });
const getAdminCategories = async (req, res) => res.json({ success: true, data: await Category.find().sort({ name: 1 }) });


const getCategoryById = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, isActive: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  const subcategories = await SubCategory.find({ categoryId: category._id, isActive: true });
  res.json({ success: true, category, subcategories });
};

const createCategory = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const category = await Category.create({ name, slug: req.body.slug || slugify(name), isActive: req.body.isActive !== false });
    res.status(201).json({ success: true, data: category });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateCategory = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const data = { name, slug: req.body.slug || slugify(name), isActive: req.body.isActive !== false };
    const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category deactivated' });
};

const getSubCategories = async (req, res) => {
  const filter = req.query.categoryId ? { categoryId: req.query.categoryId, isActive: true } : { isActive: true };
  res.json({ success: true, data: await SubCategory.find(filter).populate('categoryId', 'name slug').sort({ name: 1 }) });
};

const createSubCategory = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const data = { name, slug: req.body.slug || slugify(name), categoryId: req.body.categoryId };
    res.status(201).json({ success: true, data: await SubCategory.create(data) });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateSubCategory = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const data = { name, slug: req.body.slug || slugify(name), categoryId: req.body.categoryId, isActive: req.body.isActive !== false };
    const item = await SubCategory.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, data: item });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteSubCategory = async (req, res) => {
  const item = await SubCategory.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
  res.json({ success: true, message: 'Subcategory deactivated' });
};

module.exports = { getCategoryById, getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory, getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory };
