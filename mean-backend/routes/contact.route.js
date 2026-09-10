const router = require('express').Router();
const {getContacts,markContactRead,submitContact} = require('../controller/contact.controller');
const {protect, isAdmin}= require('../middleware/auth.middleware');


router.get('/contact', protect,isAdmin, getContacts);


router.post('/admin', submitContact);
router.put('/admin/:id', protect,isAdmin,markContactRead);



module.exports = router;
