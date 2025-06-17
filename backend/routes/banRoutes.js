const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tất cả bàn
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM BAN');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy thông tin bàn theo ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM BAN WHERE MaBan = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo bàn mới
router.post('/', async (req, res) => {
  try {
    const { MaBan, KhuVuc } = req.body;
    const [result] = await db.query(
      'INSERT INTO BAN (MaBan, KhuVuc) VALUES (?, ?)',
      [MaBan, KhuVuc]
    );
    res.status(201).json({ message: 'Bàn đã được tạo thành công', id: MaBan });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật thông tin bàn
router.put('/:id', async (req, res) => {
  try {
    const { KhuVuc } = req.body;
    const [result] = await db.query(
      'UPDATE BAN SET KhuVuc = ? WHERE MaBan = ?',
      [KhuVuc, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    res.json({ message: 'Cập nhật thông tin bàn thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa bàn
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM BAN WHERE MaBan = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    res.json({ message: 'Xóa bàn thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tìm kiếm bàn
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q;
    const [rows] = await db.query(
      `SELECT * FROM BAN 
      WHERE MaBan LIKE ? OR KhuVuc LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;