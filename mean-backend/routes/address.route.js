const router = require('express').Router();
const {addAddress,deleteAddress,getAddresses,updateAddress}= require('../controller/address.controller');

const {protect} = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);





module.exports = router;
