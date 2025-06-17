const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tất cả mặt hàng
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, GROUP_CONCAT(nl.Ten) AS NguyenLieu 
      FROM MATHANG m
      LEFT JOIN CONGTHUC ct ON m.MaMatHang = ct.MaMatHang
      LEFT JOIN CONGTHUC_CHITIET ctct ON ct.MaCongThuc = ctct.MaCongThuc
      LEFT JOIN NGUYENLIEU nl ON ctct.MaNguyenLieu = nl.MaNguyenLieu
      GROUP BY m.MaMatHang
    `);
    
    // Xử lý chuỗi nguyên liệu thành mảng
    const processedRows = rows.map(row => ({
      ...row,
      NguyenLieu: row.NguyenLieu ? row.NguyenLieu.split(',') : []
    }));
    
    res.json(processedRows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy thông tin mặt hàng theo ID (kèm công thức)
router.get('/:id', async (req, res) => {
  try {
    // Lấy thông tin cơ bản
    const [matHangRows] = await db.query('SELECT * FROM MATHANG WHERE MaMatHang = ?', [req.params.id]);
    
    if (matHangRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy mặt hàng' });
    }
    
    // Lấy công thức nếu có
    const [congThucRows] = await db.query(`
      SELECT ct.*, ctct.SoLuong, ctct.DonVi, nl.Ten AS TenNguyenLieu
      FROM CONGTHUC ct
      LEFT JOIN CONGTHUC_CHITIET ctct ON ct.MaCongThuc = ctct.MaCongThuc
      LEFT JOIN NGUYENLIEU nl ON ctct.MaNguyenLieu = nl.MaNguyenLieu
      WHERE ct.MaMatHang = ?
    `, [req.params.id]);
    
    const response = {
      ...matHangRows[0],
      CongThuc: congThucRows
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mặt hàng mới (kèm công thức nếu có)
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { MaMatHang, TenHang, Gia, CongThuc } = req.body;
    
    // 1. Tạo mặt hàng
    await connection.query(
      'INSERT INTO MATHANG (MaMatHang, TenHang, Gia) VALUES (?, ?, ?)',
      [MaMatHang, TenHang, Gia]
    );
    
    // 2. Tạo công thức nếu có
    if (CongThuc && CongThuc.length > 0) {
      // Tạo công thức chính
      const [congThucResult] = await connection.query(
        'INSERT INTO CONGTHUC (MaMatHang, TenCongThuc) VALUES (?, ?)',
        [MaMatHang, `Công thức ${TenHang}`]
      );
      
      const maCongThuc = congThucResult.insertId;
      
      // Thêm chi tiết công thức
      for (const item of CongThuc) {
        await connection.query(
          'INSERT INTO CONGTHUC_CHITIET (MaCongThuc, MaNguyenLieu, SoLuong, DonVi) VALUES (?, ?, ?, ?)',
          [maCongThuc, item.MaNguyenLieu, item.SoLuong, item.DonVi]
        );
      }
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Mặt hàng đã được tạo thành công', id: MaMatHang });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Cập nhật thông tin mặt hàng
router.put('/:id', async (req, res) => {
  try {
    const { TenHang, Gia } = req.body;
    const [result] = await db.query(
      'UPDATE MATHANG SET TenHang = ?, Gia = ? WHERE MaMatHang = ?',
      [TenHang, Gia, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy mặt hàng' });
    }
    
    res.json({ message: 'Cập nhật thông tin mặt hàng thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa mặt hàng
router.delete('/:id', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Xóa công thức chi tiết
    await connection.query(`
      DELETE ctct FROM CONGTHUC_CHITIET ctct
      JOIN CONGTHUC ct ON ctct.MaCongThuc = ct.MaCongThuc
      WHERE ct.MaMatHang = ?
    `, [req.params.id]);
    
    // 2. Xóa công thức
    await connection.query('DELETE FROM CONGTHUC WHERE MaMatHang = ?', [req.params.id]);
    
    // 3. Xóa mặt hàng
    const [result] = await connection.query('DELETE FROM MATHANG WHERE MaMatHang = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy mặt hàng' });
    }
    
    await connection.commit();
    res.json({ message: 'Xóa mặt hàng thành công' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;