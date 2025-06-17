const db = require('../config/db');

class NguyenLieu {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM NGUYENLIEU');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM NGUYENLIEU WHERE MaNguyenLieu = ?', [id]);
    return rows[0];
  }

  static async create(newNguyenLieu) {
    const { MaNguyenLieu, Ten, SoLuong, DonVi, GiaNhap, NgayNhap, HanSuDung, GhiChu } = newNguyenLieu;
    const [result] = await db.query(
      'INSERT INTO NGUYENLIEU (MaNguyenLieu, Ten, SoLuong, DonVi, GiaNhap, NgayNhap, HanSuDung, GhiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [MaNguyenLieu, Ten, SoLuong, DonVi, GiaNhap, NgayNhap, HanSuDung, GhiChu]
    );
    return result.insertId;
  }

  static async update(id, updatedData) {
    const { Ten, SoLuong, DonVi, GiaNhap, NgayNhap, HanSuDung, GhiChu } = updatedData;
    const [result] = await db.query(
      'UPDATE NGUYENLIEU SET Ten = ?, SoLuong = ?, DonVi = ?, GiaNhap = ?, NgayNhap = ?, HanSuDung = ?, GhiChu = ? WHERE MaNguyenLieu = ?',
      [Ten, SoLuong, DonVi, GiaNhap, NgayNhap, HanSuDung, GhiChu, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM NGUYENLIEU WHERE MaNguyenLieu = ?', [id]);
    return result.affectedRows;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      `SELECT * FROM NGUYENLIEU 
      WHERE MaNguyenLieu LIKE ? OR Ten LIKE ? OR DonVi LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }

  static async getLowStock(threshold = 10) {
    const [rows] = await db.query(
      'SELECT * FROM NGUYENLIEU WHERE SoLuong < ?',
      [threshold]
    );
    return rows;
  }
}

module.exports = NguyenLieu;