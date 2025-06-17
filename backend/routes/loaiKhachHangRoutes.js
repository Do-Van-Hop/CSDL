const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tất cả loại khách hàng
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM LOAIKHACHHANG');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy thông tin loại khách hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM LOAIKHACHHANG WHERE MaLoaiKhach = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy loại khách hàng' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo loại khách hàng mới
router.post('/', async (req, res) => {
  try {
    const { MaLoaiKhach, TenLoaiKhach, MoTa, GiamGia } = req.body;
    const [result] = await db.query(
      'INSERT INTO LOAIKHACHHANG (MaLoaiKhach, TenLoaiKhach, MoTa, GiamGia) VALUES (?, ?, ?, ?)',
      [MaLoaiKhach, TenLoaiKhach, MoTa, GiamGia]
    );
    res.status(201).json({ message: 'Loại khách hàng đã được tạo thành công', id: MaLoaiKhach });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật thông tin loại khách hàng
router.put('/:id', async (req, res) => {
  try {
    const { TenLoaiKhach, MoTa, GiamGia } = req.body;
    const [result] = await db.query(
      'UPDATE LOAIKHACHHANG SET TenLoaiKhach = ?, MoTa = ?, GiamGia = ? WHERE MaLoaiKhach = ?',
      [TenLoaiKhach, MoTa, GiamGia, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy loại khách hàng' });
    }
    res.json({ message: 'Cập nhật loại khách hàng thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa loại khách hàng
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM LOAIKHACHHANG WHERE MaLoaiKhach = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy loại khách hàng' });
    }
    res.json({ message: 'Xóa loại khách hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tìm kiếm loại khách hàng
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q;
    const [rows] = await db.query(
      `SELECT * FROM LOAIKHACHHANG 
      WHERE MaLoaiKhach LIKE ? OR TenLoaiKhach LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;