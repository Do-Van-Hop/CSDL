const CongThuc = require('../models/CongThuc');
const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const congThucs = await CongThuc.getAll();
    
    // Lấy chi tiết cho từng công thức
    const results = await Promise.all(congThucs.map(async (ct) => {
      const chiTiet = await CongThuc.getChiTietByCongThucId(ct.MaCongThuc);
      return {
        ...ct,
        chiTiet
      };
    }));
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const congThuc = await CongThuc.getById(req.params.id);
    if (!congThuc) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }
    
    // Lấy chi tiết công thức
    const chiTiet = await CongThuc.getChiTietByCongThucId(req.params.id);
    res.json({ ...congThuc, chiTiet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const newCongThuc = req.body;
    const { chiTiet, ...congThucData } = newCongThuc;

    // Tạo công thức chính
    const id = await CongThuc.create(congThucData);

    // Tạo chi tiết công thức
    for (const item of chiTiet) {
      await CongThuc.createChiTiet({ ...item, MaCongThuc: id });
    }

    await connection.commit();
    res.status(201).json({ message: 'Công thức đã được tạo thành công', id });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
};

exports.update = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const id = req.params.id;
    const updatedData = req.body;
    const { chiTiet, ...congThucData } = updatedData;

    // Cập nhật công thức chính
    const affectedRows = await CongThuc.update(id, congThucData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }

    // Xóa chi tiết cũ và thêm mới
    await CongThuc.deleteChiTietByCongThucId(id);
    for (const item of chiTiet) {
      await CongThuc.createChiTiet({ ...item, MaCongThuc: id });
    }

    await connection.commit();
    res.json({ message: 'Cập nhật công thức thành công' });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await CongThuc.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }
    res.json({ message: 'Xóa công thức thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await CongThuc.search(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByMatHang = async (req, res) => {
  try {
    const matHangId = req.params.matHangId;
    const congThucs = await CongThuc.getByMatHang(matHangId);
    
    // Lấy chi tiết cho từng công thức
    const results = await Promise.all(congThucs.map(async (ct) => {
      const chiTiet = await CongThuc.getChiTietByCongThucId(ct.MaCongThuc);
      return {
        ...ct,
        chiTiet
      };
    }));
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};