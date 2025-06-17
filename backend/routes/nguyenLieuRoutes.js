const express = require('express');
const router = express.Router();
const nguyenLieuController = require('../controllers/nguyenLieuController');

router.get('/', nguyenLieuController.getAll);
router.get('/search', nguyenLieuController.search);
router.get('/low-stock', nguyenLieuController.getLowStock);
router.get('/:id', nguyenLieuController.getById);
router.post('/', nguyenLieuController.create);
router.put('/:id', nguyenLieuController.update);
router.delete('/:id', nguyenLieuController.delete);

module.exports = router;