const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = { FAQ };
