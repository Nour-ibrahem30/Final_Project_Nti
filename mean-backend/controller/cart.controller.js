const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const loadCart = userId => Cart.findOne({ userId }).populate('items.productId', 'name image price stock isActive isDeleted slug');

const syncPrices = async cart => {
  let changed = false;
  for (const item of cart.items) {
    const product = item.productId;
    if (!product) continue;
    if (Number(product.price) !== Number(item.priceAtOrder)) {
      item.isPriceChanged = true;
      changed = true;
    }
  }
  if (changed) await cart.save();
  return cart;
};

const getCart = async (req, res) => {
  let cart = await loadCart(req.user._id);
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  cart = await loadCart(req.user._id);
  await syncPrices(cart);
  cart = await loadCart(req.user._id);
  res.json({ success: true, data: cart });
};

const addToCart = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.body.productId, isActive: true, isDeleted: false });
    const quantity = Math.max(1, Number(req.body.quantity || 1));
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const cart = await Cart.findOneAndUpdate({ userId: req.user._id }, { $setOnInsert: { userId: req.user._id } }, { upsert: true, new: true });
    const item = cart.items.find(i => i.productId.toString() === product._id.toString());
    if (item) {
      if (item.isPriceChanged) return res.status(409).json({ success: false, message: 'Resolve the changed price before adding this product again' });
      if (item.quantity + quantity > product.stock) return res.status(400).json({ success: false, message: `Only ${product.stock} pieces are available` });
      item.quantity += quantity;
    } else {
      if (quantity > product.stock) return res.status(400).json({ success: false, message: `Only ${product.stock} pieces are available` });
      cart.items.push({ productId: product._id, priceAtOrder: product.price, quantity, isPriceChanged: false });
    }
    await cart.save();
    res.json({ success: true, data: await loadCart(req.user._id) });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    const item = cart?.items.id(req.params.itemId);
    const quantity = Number(req.body.quantity);
    if (!item || !Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ success: false, message: 'Invalid cart item' });
    const product = await Product.findById(item.productId);
    if (!product || quantity > product.stock) return res.status(400).json({ success: false, message: 'Requested quantity is not available' });
    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, data: await loadCart(req.user._id) });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json({ success: true, data: await loadCart(req.user._id) });
};

const resolvePriceChange = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  const item = cart?.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
  const product = await Product.findById(item.productId);
  if (!product || product.isDeleted || !product.isActive) {
    cart.items.pull(req.params.itemId);
  } else if (req.body.action === 'accept') {
    item.priceAtOrder = product.price;
    item.isPriceChanged = false;
  } else {
    cart.items.pull(req.params.itemId);
  }
  await cart.save();
  res.json({ success: true, data: await loadCart(req.user._id) });
};

const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], totalPrice: 0 });
  res.json({ success: true, message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, resolvePriceChange, clearCart };
