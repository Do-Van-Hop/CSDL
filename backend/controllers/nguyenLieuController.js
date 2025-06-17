const NguyenLieu = require('../models/NguyenLieu');

exports.getAll = async (req, res) => {
  try {
    const nguyenLieus = await NguyenLieu.getAll();
    res.json(nguyenLieus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const nguyenLieu = await NguyenLieu.getById(req.params.id);
    if (!nguyenLieu) {
      return res.status(404).json({ message: 'Không tìm thấy nguyên liệu' });
    }
    res.json(nguyenLieu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newNguyenLieu = req.body;
    const id = await NguyenLieu.create(newNguyenLieu);
    res.status(201).json({ message: 'Nguyên liệu đã được tạo thành công', id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const affectedRows = await NguyenLieu.update(id, updatedData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nguyên liệu' });
    }
    res.json({ message: 'Cập nhật nguyên liệu thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await NguyenLieu.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nguyên liệu' });
    }
    res.json({ message: 'Xóa nguyên liệu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await NguyenLieu.search(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const results = await NguyenLieu.getLowStock(threshold);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};