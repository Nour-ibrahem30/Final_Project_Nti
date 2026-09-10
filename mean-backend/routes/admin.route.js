const router = require('express').Router();
const { protect, isAdmin } = require('../middleware/auth.middleware');
const { getReports, getDeliveryZones, upsertDeliveryZone, toggleUser } = require('../controller/admin.controller');
router.use(protect, isAdmin);
router.get('/reports', getReports);
router.get('/delivery-zones', getDeliveryZones);
router.put('/delivery-zones', upsertDeliveryZone);
router.put('/users/:id/block', toggleUser);
module.exports = router;
