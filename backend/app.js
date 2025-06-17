const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const donHangRoutes = require('./routes/donHangRoutes');
const khachHangRoutes = require('./routes/khachHangRoutes');
const nhanVienRoutes = require('./routes/nhanVienRoutes');
const matHangRoutes = require('./routes/matHangRoutes');
const nguyenLieuRoutes = require('./routes/nguyenLieuRoutes');
const congThucRoutes = require('./routes/congThucRoutes');
const banRoutes = require('./routes/banRoutes');
const loaiKhachHangRoutes = require('./routes/loaiKhachHangRoutes');

// Sử dụng các route
app.use('/api/donhang', donHangRoutes);
app.use('/api/khachhang', khachHangRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/mathang', matHangRoutes);
app.use('/api/nguyenlieu', nguyenLieuRoutes);
app.use('/api/congthuc', congThucRoutes);
app.use('/api/ban', banRoutes);
app.use('/api/loaikhachhang', loaiKhachHangRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});