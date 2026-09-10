const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  season: { type: String, enum: ['summer', 'winter', 'spring', 'autumn', 'all'], default: 'all' },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  soldCount: { type: Number, min: 0, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
