const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHangController');

router.get('/', donHangController.getAllDonHang);
router.get('/search', donHangController.searchDonHang);
router.get('/:id', donHangController.getDonHangById);
router.post('/', donHangController.createDonHang);

module.exports = router;