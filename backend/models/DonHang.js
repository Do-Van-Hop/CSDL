const db = require('../config/db');

class DonHang {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM DONHANG');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM DONHANG WHERE MaDonHang = ?', [id]);
    return rows[0];
  }

  static async create(newDonHang) {
    const { NgayLap, MaKhachHang, MaNhanVien, MaBan, TongTien, TrangThai, GhiChu } = newDonHang;
    const [result] = await db.query(
      'INSERT INTO DONHANG (NgayLap, MaKhachHang, MaNhanVien, MaBan, TongTien, TrangThai, GhiChu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [NgayLap, MaKhachHang, MaNhanVien, MaBan, TongTien, TrangThai, GhiChu]
    );
    return result.insertId;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      `SELECT d.*, k.TenKhachHang 
       FROM DONHANG d 
       LEFT JOIN KHACHHANG k ON d.MaKhachHang = k.MaKhachHang
       WHERE d.MaDonHang LIKE ? OR k.TenKhachHang LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
}

module.exports = DonHang;