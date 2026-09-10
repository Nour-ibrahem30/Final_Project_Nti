const Testimonial = require('../models/testimonial.model');
const Notification = require('../models/notification.model');

const getApprovedTestimonials = async (req, res) => {
  const data = await Testimonial.find({ status: 'approved' }).populate('userId', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data });
};

const submitTestimonial = async (req, res) => {
  try {
    const { message, rating } = req.body;
    let testimonial = await Testimonial.findOne({ userId: req.user._id });
    if (testimonial) {
      testimonial.message = message;
      testimonial.rating = rating;
      testimonial.status = 'pending';
    } else {
      testimonial = await Testimonial.create({ userId: req.user._id, message, rating, status: 'pending' });
    }
    res.status(201).json({ success: true, message: 'Your testimonial is pending admin approval', data: testimonial });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const getAllTestimonials = async (req, res) => {
  const data = await Testimonial.find().populate('userId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data });
};

const updateTestimonialStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'declined'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid testimonial status' });
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  if (status !== 'pending') await Notification.create({
    userId: testimonial.userId,
    type: 'new_testimonial',
    title: `Testimonial ${status}`,
    message: `Your testimonial has been ${status}.`,
    relatedId: testimonial._id
  });
  res.json({ success: true, data: testimonial });
};

const deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted' });
};

module.exports = { getApprovedTestimonials, submitTestimonial, getAllTestimonials, updateTestimonialStatus, deleteTestimonial };
