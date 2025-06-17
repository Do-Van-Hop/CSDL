const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVienController');

router.get('/', nhanVienController.getAll);
router.get('/search', nhanVienController.search);
router.get('/:id', nhanVienController.getById);
router.post('/', nhanVienController.create);
router.put('/:id', nhanVienController.update);
router.delete('/:id', nhanVienController.delete);

module.exports = router;