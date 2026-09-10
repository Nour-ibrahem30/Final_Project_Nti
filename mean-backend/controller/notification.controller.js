const Notification = require('../models/notification.model');

const getMyNotifications = async (req, res) => {
  const data = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data });
};

const markRead = async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true });
  res.json({ success: true });
};

module.exports = { getMyNotifications, markRead };
