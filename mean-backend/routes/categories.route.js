const router = require('express').Router();
const {createCategory,getCategories,getAdminCategories,getCategoryById,deleteCategory, updateCategory} = require('../controller/Category.controller');
const {isAdmin, protect}= require('../middleware/auth.middleware');


router.get('/', getCategories);
router.get('/admin', protect, isAdmin,getAdminCategories);

router.get('/:id', getCategoryById);
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
