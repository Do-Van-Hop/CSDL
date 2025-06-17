const KhachHang = require('../models/KhachHang');

exports.getAll = async (req, res) => {
  try {
    const khachHangs = await KhachHang.getAll();
    res.json(khachHangs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const khachHang = await KhachHang.getById(req.params.id);
    if (!khachHang) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.json(khachHang);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newKhachHang = req.body;
    const id = await KhachHang.create(newKhachHang);
    res.status(201).json({ message: 'Khách hàng đã được tạo thành công', id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const affectedRows = await KhachHang.update(id, updatedData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await KhachHang.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.json({ message: 'Xóa khách hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await KhachHang.search(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};