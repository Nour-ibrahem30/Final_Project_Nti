const router = require('express').Router();
const {upload} = require('../middleware/upload.middleware');
const {isAdmin, protect}= require('../middleware/auth.middleware');

const {getUsers,getUser,deleteUser,updateUser} = require('../controller/user.controller');

router.get("/",protect,isAdmin ,getUsers);
router.get("/me",protect ,getUser);
router.put("/me",protect ,upload.single('image'),updateUser);

router.delete("/:id",protect,isAdmin ,deleteUser);

module.exports = router;


