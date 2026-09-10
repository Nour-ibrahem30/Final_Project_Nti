const router = require('express').Router();

const {getProducts,getAdminProducts,createProduct, getProductById, updateProduct, deleteProduct,getProductBySlug} = require('../controller/product.controller');
const {isAdmin, protect}= require('../middleware/auth.middleware');
const {upload} = require('../middleware/upload.middleware');


router.get("/", getProducts);
router.get("/admin",protect,isAdmin ,getAdminProducts);

router.get("/get/:slug" ,getProductBySlug);

router.get("/:id", getProductById);

router.post("/",protect,isAdmin, upload.single('image'), createProduct);
router.put("/:id",protect,isAdmin, upload.single('image'), updateProduct);
router.delete("/:id",protect,isAdmin, deleteProduct);



module.exports = router;