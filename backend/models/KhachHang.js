const db = require('../config/db');

class KhachHang {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT k.*, l.TenLoaiKhach, l.GiamGia 
      FROM KHACHHANG k
      LEFT JOIN LOAIKHACHHANG l ON k.MaLoaiKhach = l.MaLoaiKhach
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT k.*, l.TenLoaiKhach, l.GiamGia 
      FROM KHACHHANG k
      LEFT JOIN LOAIKHACHHANG l ON k.MaLoaiKhach = l.MaLoaiKhach
      WHERE k.MaKhachHang = ?
    `, [id]);
    return rows[0];
  }

  static async create(newKhachHang) {
    const { MaKhachHang, TenKhachHang, SDT, DiaChi, MaLoaiKhach } = newKhachHang;
    const [result] = await db.query(
      'INSERT INTO KHACHHANG (MaKhachHang, TenKhachHang, SDT, DiaChi, MaLoaiKhach) VALUES (?, ?, ?, ?, ?)',
      [MaKhachHang, TenKhachHang, SDT, DiaChi, MaLoaiKhach]
    );
    return result.insertId;
  }

  static async update(id, updatedData) {
    const { TenKhachHang, SDT, DiaChi, MaLoaiKhach } = updatedData;
    const [result] = await db.query(
      'UPDATE KHACHHANG SET TenKhachHang = ?, SDT = ?, DiaChi = ?, MaLoaiKhach = ? WHERE MaKhachHang = ?',
      [TenKhachHang, SDT, DiaChi, MaLoaiKhach, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM KHACHHANG WHERE MaKhachHang = ?', [id]);
    return result.affectedRows;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      `SELECT k.*, l.TenLoaiKhach 
      FROM KHACHHANG k
      LEFT JOIN LOAIKHACHHANG l ON k.MaLoaiKhach = l.MaLoaiKhach
      WHERE k.MaKhachHang LIKE ? OR k.TenKhachHang LIKE ? OR k.SDT LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
}

module.exports = KhachHang;