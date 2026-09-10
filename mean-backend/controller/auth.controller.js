const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = user => jwt.sign(
  { _id: user._id, name: user.name, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE || '7d' }
);

const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob } = req.body;
    if (!name || !email || !password || !phone || !gender) return res.status(400).json({ success: false, message: 'Name, email, password, phone and gender are required' });
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: 'Email is already registered' });
    const user = await User.create({ name, email, password, phone, gender, dob });
    res.status(201).json({ success: true, message: 'Registration successful', token: generateToken(user) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'This account has been blocked by the administrator' });
    res.json({ success: true, message: 'Login successful', token: generateToken(user), user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, gender: user.gender, role: user.role, dob: user.dob } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
