const db = require('../config/db');

class NhanVien {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM NHANVIEN');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM NHANVIEN WHERE MaNhanVien = ?', [id]);
    return rows[0];
  }

  static async create(newNhanVien) {
    const { MaNhanVien, TenNhanVien, GioTinh, DiaChi } = newNhanVien;
    const [result] = await db.query(
      'INSERT INTO NHANVIEN (MaNhanVien, TenNhanVien, GioTinh, DiaChi) VALUES (?, ?, ?, ?)',
      [MaNhanVien, TenNhanVien, GioTinh, DiaChi]
    );
    return result.insertId;
  }

  static async update(id, updatedData) {
    const { TenNhanVien, GioTinh, DiaChi } = updatedData;
    const [result] = await db.query(
      'UPDATE NHANVIEN SET TenNhanVien = ?, GioTinh = ?, DiaChi = ? WHERE MaNhanVien = ?',
      [TenNhanVien, GioTinh, DiaChi, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM NHANVIEN WHERE MaNhanVien = ?', [id]);
    return result.affectedRows;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      `SELECT * FROM NHANVIEN 
      WHERE MaNhanVien LIKE ? OR TenNhanVien LIKE ? OR DiaChi LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }
}

module.exports = NhanVien;