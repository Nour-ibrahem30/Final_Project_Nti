const router = require('express').Router();

const {getApprovedTestimonials, submitTestimonial,getAllTestimonials, updateTestimonialStatus, deleteTestimonial} = require('../controller/testimonial.controller');
const {isAdmin, protect}= require('../middleware/auth.middleware');



router.get('/testimonials', getApprovedTestimonials)
router.post('/testimonials', protect, submitTestimonial);

router.get('/admin',protect ,isAdmin,getAllTestimonials);
router.put('/admin/:id',protect ,isAdmin,updateTestimonialStatus);
router.delete('/admin/:id',protect ,isAdmin,deleteTestimonial);



module.exports = router;
