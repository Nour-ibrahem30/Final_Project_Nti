const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const DeliveryZone = require('../models/deliveryZone.model');

const getReports = async (req, res) => {
  try {
    const start = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = req.query.endDate ? new Date(req.query.endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const filter = { orderedAt: { $gte: start, $lte: end } };

    const revenue = await Order.aggregate([
      { $match: { ...filter, status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, amount: { $sum: '$totalPrice' } } }
    ]);
    const top5 = await Order.aggregate([
      { $match: { ...filter, status: { $ne: 'refund' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', name: { $first: '$items.name' }, quantity: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.priceAtOrder', '$items.quantity'] } } } },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);
    const orders = await Order.countDocuments(filter);
    const users = await User.countDocuments({ role: 'user' });
    const products = await Product.countDocuments({ isActive: true, isDeleted: false });
    res.json({ success: true, reports: { from: start, to: end, totalMade: revenue[0]?.amount || 0, totalOrders: orders, totalUsers: users, totalProducts: products, top5Products: top5 } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getDeliveryZones = async (req, res) => res.json({ success: true, data: await DeliveryZone.find().sort({ governorate: 1 }) });

const upsertDeliveryZone = async (req, res) => {
  try {
    const data = await DeliveryZone.findOneAndUpdate(
      { governorate: req.body.governorate },
      { governorate: req.body.governorate, fee: Number(req.body.fee), isActive: req.body.isActive !== false },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ success: true, data: user });
};

module.exports = { getReports, getDeliveryZones, upsertDeliveryZone, toggleUser };
