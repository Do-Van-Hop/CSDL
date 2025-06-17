const NhanVien = require('../models/NhanVien');

exports.getAll = async (req, res) => {
  try {
    const nhanViens = await NhanVien.getAll();
    res.json(nhanViens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const nhanVien = await NhanVien.getById(req.params.id);
    if (!nhanVien) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(nhanVien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newNhanVien = req.body;
    const id = await NhanVien.create(newNhanVien);
    res.status(201).json({ message: 'Nhân viên đã được tạo thành công', id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const affectedRows = await NhanVien.update(id, updatedData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Cập nhật nhân viên thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await NhanVien.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await NhanVien.search(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};