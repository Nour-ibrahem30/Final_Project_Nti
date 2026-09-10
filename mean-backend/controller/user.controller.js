const User = require('../models/user.model');

const getUsers = async (req, res) => res.json({ success: true, data: await User.find().select('-password').sort({ createdAt: -1 }) });

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, email, phone, gender, dob, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (password) user.password = password;
    await user.save();
    res.json({ success: true, data: await User.findById(user._id).select('-password') });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
