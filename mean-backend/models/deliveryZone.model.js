const mongoose = require('mongoose');
const deliveryZoneSchema = new mongoose.Schema({
  governorate: { type: String, required: true, unique: true, trim: true },
  fee: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
