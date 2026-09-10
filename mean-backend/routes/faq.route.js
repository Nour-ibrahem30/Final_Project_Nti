const router = require('express').Router();
const {getFAQs,createFAQ,getAllFAQs,deleteFAQ,updateFAQ} = require('../controller/faq.controller');
const {protect, isAdmin}= require('../middleware/auth.middleware');


router.get('/faqs', getFAQs);

router.get('/admin', protect,isAdmin,getAllFAQs);
router.post('/admin', protect,isAdmin,createFAQ);
router.put('/admin/:id', updateFAQ);
router.delete('/admin/:id', deleteFAQ);


module.exports = router;
