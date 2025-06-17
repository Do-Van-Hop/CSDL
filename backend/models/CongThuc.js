const db = require('../config/db');

class CongThuc {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT c.*, m.TenHang 
      FROM CONGTHUC c
      JOIN MATHANG m ON c.MaMatHang = m.MaMatHang
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT c.*, m.TenHang 
      FROM CONGTHUC c
      JOIN MATHANG m ON c.MaMatHang = m.MaMatHang
      WHERE c.MaCongThuc = ?
    `, [id]);
    return rows[0];
  }

  static async getByMatHang(matHangId) {
    const [rows] = await db.query(`
      SELECT * FROM CONGTHUC 
      WHERE MaMatHang = ?
    `, [matHangId]);
    return rows;
  }

  static async create(newCongThuc) {
    const { MaCongThuc, MaMatHang, TenCongThuc, MoTa } = newCongThuc;
    const [result] = await db.query(
      'INSERT INTO CONGTHUC (MaCongThuc, MaMatHang, TenCongThuc, MoTa) VALUES (?, ?, ?, ?)',
      [MaCongThuc, MaMatHang, TenCongThuc, MoTa]
    );
    return result.insertId;
  }

  static async update(id, updatedData) {
    const { MaMatHang, TenCongThuc, MoTa } = updatedData;
    const [result] = await db.query(
      'UPDATE CONGTHUC SET MaMatHang = ?, TenCongThuc = ?, MoTa = ? WHERE MaCongThuc = ?',
      [MaMatHang, TenCongThuc, MoTa, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    // Xóa chi tiết công thức trước
    await db.query('DELETE FROM CONGTHUC_CHITIET WHERE MaCongThuc = ?', [id]);
    const [result] = await db.query('DELETE FROM CONGTHUC WHERE MaCongThuc = ?', [id]);
    return result.affectedRows;
  }

  static async search(keyword) {
    const [rows] = await db.query(
      `SELECT c.*, m.TenHang 
      FROM CONGTHUC c
      JOIN MATHANG m ON c.MaMatHang = m.MaMatHang
      WHERE c.MaCongThuc LIKE ? OR c.TenCongThuc LIKE ? OR m.TenHang LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }

  // Chi tiết công thức
  static async getChiTietByCongThucId(id) {
    const [rows] = await db.query(`
      SELECT ctct.*, nl.Ten AS TenNguyenLieu
      FROM CONGTHUC_CHITIET ctct
      JOIN NGUYENLIEU nl ON ctct.MaNguyenLieu = nl.MaNguyenLieu
      WHERE ctct.MaCongThuc = ?
    `, [id]);
    return rows;
  }

  static async createChiTiet(chiTiet) {
    const { MaCongThuc, MaNguyenLieu, SoLuong, DonVi } = chiTiet;
    const [result] = await db.query(
      'INSERT INTO CONGTHUC_CHITIET (MaCongThuc, MaNguyenLieu, SoLuong, DonVi) VALUES (?, ?, ?, ?)',
      [MaCongThuc, MaNguyenLieu, SoLuong, DonVi]
    );
    return result.insertId;
  }

  static async deleteChiTietByCongThucId(id) {
    const [result] = await db.query('DELETE FROM CONGTHUC_CHITIET WHERE MaCongThuc = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = CongThuc;