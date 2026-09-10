const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getMyNotifications, markRead } = require('../controller/notification.controller');
router.use(protect);
router.get('/', getMyNotifications);
router.put('/:id/read', markRead);
module.exports = router;
