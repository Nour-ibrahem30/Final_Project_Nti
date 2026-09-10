const User = require('../models/user.model');

const getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.json({ success: true, data: user.addresses || [] });
};

const addAddress = async (req, res) => {
  try {
    const { label, governorate, city, street, building, apartment, isDefault } = req.body;
    if (!governorate || !city || !street || !building) return res.status(400).json({ success: false, message: 'Governorate, city, street and building are required' });
    const user = await User.findById(req.user._id);
    if (isDefault) user.addresses.forEach(a => a.isDefault = false);
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push({ label, governorate, city, street, building, apartment, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();
    res.status(201).json({ success: true, data: user.addresses.at(-1) });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    const { label, governorate, city, street, building, apartment, isDefault } = req.body;
    if (isDefault) user.addresses.forEach(a => a.isDefault = false);
    Object.assign(address, { label, governorate, city, street, building, apartment, isDefault: !!isDefault });
    await user.save();
    res.json({ success: true, data: address });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.addresses.id(req.params.id)) return res.status(404).json({ success: false, message: 'Address not found' });
  user.addresses.pull(req.params.id);
  await user.save();
  res.json({ success: true, message: 'Address removed' });
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
