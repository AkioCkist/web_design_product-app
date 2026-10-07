# NESTA — Minimal home store

Website bán sản phẩm nội thất tối giản xây bằng Node.js, Express, MongoDB, EJS và Multer.

## Chức năng

- Homepage giới thiệu bộ sưu tập và sản phẩm nổi bật
- Catalog tìm kiếm, lọc danh mục và sắp xếp
- Trang chi tiết sản phẩm và gợi ý cùng danh mục
- Trang quản trị tạo, xem, sửa, xóa sản phẩm
- Upload ảnh vào `public/uploads`
- Script seed dữ liệu mẫu vào MongoDB

## Chạy ứng dụng

1. Đảm bảo MongoDB đang chạy.
2. Sao chép `.env.example` thành `.env` và điều chỉnh nếu cần.
3. Chạy `npm install`.
4. Chạy `npm run seed` để tạo dữ liệu mẫu.
5. Chạy `npm start` và mở `http://localhost:3000`.

## Cấu hình

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productdb
```
