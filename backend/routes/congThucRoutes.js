const express = require('express');
const router = express.Router();
const congThucController = require('../controllers/congThucController');

router.get('/', congThucController.getAll);
router.get('/search', congThucController.search);
router.get('/by-mathang/:matHangId', congThucController.getByMatHang);
router.get('/:id', congThucController.getById);
router.post('/', congThucController.create);
router.put('/:id', congThucController.update);
router.delete('/:id', congThucController.delete);

module.exports = router;