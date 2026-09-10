const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  priceAtOrder: { type: Number, required: true, min: 0 },
  isPriceChanged: { type: Boolean, default: false },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.filter(i => !i.isPriceChanged).reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
