document.addEventListener('DOMContentLoaded', function() {
  // Lấy danh sách đơn hàng khi trang được tải
  loadDonHangList();
  
  // Xử lý tìm kiếm
  document.getElementById('searchBtn').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value;
    searchDonHang(keyword);
  });
  
  // Xử lý form tạo đơn hàng
  document.getElementById('donHangForm').addEventListener('submit', function(e) {
    e.preventDefault();
    createDonHang();
  });
});

// Hàm tải danh sách đơn hàng
async function loadDonHangList() {
  try {
    const response = await fetch('http://localhost:3000/api/donhang');
    const donHangs = await response.json();
    displayDonHangList(donHangs);
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
  }
}

// Hàm hiển thị danh sách đơn hàng
function displayDonHangList(donHangs) {
  const donHangListElement = document.getElementById('donHangList');
  donHangListElement.innerHTML = '';
  
  if (donHangs.length === 0) {
    donHangListElement.innerHTML = '<p>Không có đơn hàng nào</p>';
    return;
  }
  
  const table = document.createElement('table');
  table.className = 'table table-striped';
  
  // Tạo header bảng
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Mã đơn hàng</th>
      <th>Ngày lập</th>
      <th>Khách hàng</th>
      <th>Tổng tiền</th>
      <th>Trạng thái</th>
      <th>Hành động</th>
    </tr>
  `;
  table.appendChild(thead);
  
  // Tạo body bảng
  const tbody = document.createElement('tbody');
  donHangs.forEach(donHang => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${donHang.MaDonHang}</td>
      <td>${new Date(donHang.NgayLap).toLocaleDateString()}</td>
      <td>${donHang.MaKhachHang || 'Khách vãng lai'}</td>
      <td>${donHang.TongTien.toLocaleString()} VNĐ</td>
      <td>${donHang.TrangThai}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="viewDonHangDetail('${donHang.MaDonHang}')">Xem chi tiết</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  donHangListElement.appendChild(table);
}

// Hàm tìm kiếm đơn hàng
async function searchDonHang(keyword) {
  try {
    const response = await fetch(`http://localhost:3000/api/donhang/search?q=${encodeURIComponent(keyword)}`);
    const results = await response.json();
    displayDonHangList(results);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm đơn hàng:', error);
  }
}

// Hàm tạo đơn hàng mới
async function createDonHang() {
  const newDonHang = {
    NgayLap: document.getElementById('ngayLap').value,
    MaKhachHang: document.getElementById('maKhachHang').value || null,
    MaNhanVien: document.getElementById('maNhanVien').value,
    MaBan: document.getElementById('maBan').value,
    TongTien: parseFloat(document.getElementById('tongTien').value),
    TrangThai: document.getElementById('trangThai').value,
    GhiChu: document.getElementById('ghiChu').value
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/donhang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDonHang)
    });
    
    const result = await response.json();
    alert('Tạo đơn hàng thành công!');
    document.getElementById('donHangForm').reset();
    loadDonHangList();
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    alert('Đã xảy ra lỗi khi tạo đơn hàng');
  }
}

// Hàm xem chi tiết đơn hàng (cần triển khai thêm)
function viewDonHangDetail(maDonHang) {
  alert(`Xem chi tiết đơn hàng ${maDonHang}`);
  // Có thể mở modal hoặc chuyển trang để hiển thị chi tiết
}