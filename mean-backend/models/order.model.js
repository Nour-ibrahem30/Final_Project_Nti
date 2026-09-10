const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  priceAtOrder: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  name: { type: String, required: true },
  image: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: { type: [orderItemSchema], required: true },
  orderedAt: { type: Date, default: Date.now },
  address: { type: String, required: true },
  governorate: { type: String, required: true },
  deliveryFee: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    nationalId: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['cash_on_delivery'], default: 'cash_on_delivery' },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'confirmed', 'shipped', 'delivered', 'refund'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  refundRequestedAt: Date
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) this.orderNumber = `EA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
