const DonHang = require('../models/DonHang');

exports.getAllDonHang = async (req, res) => {
  try {
    const donHangs = await DonHang.getAll();
    res.json(donHangs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonHangById = async (req, res) => {
  try {
    const donHang = await DonHang.getById(req.params.id);
    if (!donHang) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json(donHang);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDonHang = async (req, res) => {
  try {
    const newDonHang = req.body;
    const id = await DonHang.create(newDonHang);
    res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.searchDonHang = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await DonHang.search(keyword);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};