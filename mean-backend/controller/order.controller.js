const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const DeliveryZone = require('../models/deliveryZone.model');
const Notification = require('../models/notification.model');

const placeOrder = async (req, res) => {
  try {
    const { addressId, nationalId } = req.body;
    const user = await User.findById(req.user._id);
    const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Your cart is empty' });
    if (cart.items.some(i => i.isPriceChanged)) return res.status(409).json({ success: false, message: 'Resolve all changed prices before placing the order' });

    let address = addressId ? user.addresses.id(addressId) : user.addresses.find(a => a.isDefault);
    if (!address && req.body.newAddress) {
      const a = req.body.newAddress;
      if (!a.governorate || !a.city || !a.street || !a.building) return res.status(400).json({ success: false, message: 'Complete the delivery address' });
      user.addresses.forEach(x => x.isDefault = false);
      user.addresses.push({ ...a, isDefault: user.addresses.length === 0 });
      await user.save();
      address = user.addresses.at(-1);
    }
    if (!address) return res.status(400).json({ success: false, message: 'Select or create a delivery address' });
    if (!user.phone || !nationalId) return res.status(400).json({ success: false, message: 'Mobile phone and national ID are required' });

    const zone = await DeliveryZone.findOne({ governorate: address.governorate, isActive: true });
    const deliveryFee = zone?.fee ?? 0;
    const items = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product || !product.isActive || product.isDeleted) return res.status(400).json({ success: false, message: 'A product in your cart is no longer available' });
      if (product.stock < item.quantity) return res.status(409).json({ success: false, message: `${product.name} has only ${product.stock} pieces left` });
      items.push({ productId: product._id, priceAtOrder: product.price, quantity: item.quantity, name: product.name, image: product.image });
      subtotal += product.price * item.quantity;
    }

    const reserved = [];
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity }, isActive: true, isDeleted: false },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
        { new: true }
      );
      if (!updated) {
        for (const done of reserved) await Product.findByIdAndUpdate(done.productId, { $inc: { stock: done.quantity, soldCount: -done.quantity } });
        return res.status(409).json({ success: false, message: 'Stock changed while placing the order. Please review your cart' });
      }
      reserved.push(item);
    }

    const addressText = [address.label, address.governorate, address.city, address.street, `Building ${address.building}`, address.apartment ? `Apartment ${address.apartment}` : ''].filter(Boolean).join(', ');
    const order = await Order.create({
      userId: user._id, items, orderedAt: new Date(), address: addressText,
      governorate: address.governorate, deliveryFee, totalPrice: subtotal + deliveryFee,
      customer: { name: user.name, phone: user.phone, nationalId },
      paymentMethod: 'cash_on_delivery', status: 'pending',
      statusHistory: [{ status: 'pending', changedBy: user._id }]
    });

    user.orderHistory.push(order._id);
    await user.save();
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins.length) await Notification.insertMany(admins.map(a => ({ userId: a._id, type: 'new_order', title: 'New order', message: `${order.orderNumber} was placed by ${user.name}`, relatedId: order._id })));
    res.status(201).json({ success: true, message: 'Order placed. Payment is cash on delivery.', data: order });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ orderedAt: -1 });
  res.json({ success: true, data: orders });
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied' });
  res.json({ success: true, data: order });
};

const getAllOrders = async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(filter).populate('userId', 'name email phone').sort({ orderedAt: -1 });
  res.json({ success: true, data: orders });
};

const updateOrderStatus = async (req, res) => {
  const allowed = ['pending', 'in progress', 'confirmed', 'shipped', 'delivered', 'refund'];
  const { status } = req.body;
  if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid order status' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const transitions = { pending: ['in progress'], 'in progress': ['confirmed'], confirmed: ['shipped'], shipped: ['delivered'], delivered: ['refund'], refund: [] };
  if (status !== 'refund' && !transitions[order.status]?.includes(status)) return res.status(400).json({ success: false, message: `Invalid status transition from ${order.status} to ${status}` });
  if (status === 'refund' && order.status !== 'delivered' && order.status !== 'refund') return res.status(400).json({ success: false, message: 'Refund is only available after delivery' });
  order.status = status;
  order.statusHistory.push({ status, changedBy: req.user._id });
  await order.save();
  res.json({ success: true, data: order });
};

const requestRefund = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.status !== 'delivered') return res.status(400).json({ success: false, message: 'Refund can only be requested after the order is received' });
  order.refundRequestedAt = new Date();
  await order.save();
  res.json({ success: true, message: 'Refund request sent to the admin' });
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, requestRefund };
