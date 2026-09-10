const router = require('express').Router();
const {getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory} = require('../controller/Category.controller');
const {isAdmin, protect}= require('../middleware/auth.middleware');


router.get('/', getSubCategories);
router.post('/', protect, isAdmin, createSubCategory);
router.put('/:id', protect, isAdmin, updateSubCategory);
router.delete('/:id', protect, isAdmin, deleteSubCategory);

module.exports = router;
