require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/product');

const products = [
  {
    name: 'Đèn bàn Arc', sku: 'NES-LGT-001', price: 2390000, quantity: 14,
    category: 'Chiếu sáng', summary: 'Ánh sáng dịu trong một dáng đèn điêu khắc.',
    description: 'Đèn Arc tạo nên một vùng sáng ấm, cân bằng cho bàn đầu giường hoặc góc đọc sách. Phần chụp xếp nếp khuếch tán ánh sáng đều, kết hợp chân gốm mờ mang cảm giác thủ công nhẹ nhàng.',
    material: 'Gốm mờ, giấy xếp nếp', color: 'Trắng ngà', dimensions: 'Ø 38 × C 42 cm',
    image: '/uploads/nesta-arc-lamp.png', featured: true
  },
  {
    name: 'Bộ pha Pour', sku: 'NES-KIT-002', price: 1490000, quantity: 22,
    category: 'Phòng bếp', summary: 'Nghi thức cà phê chậm, gọn trong thép và thủy tinh.',
    description: 'Bộ Pour gồm phễu lọc thép không gỉ và bình thủy tinh chịu nhiệt. Thiết kế chính xác giúp dòng nước ổn định, dễ vệ sinh và đủ tinh giản để luôn hiện diện trên mặt bếp.',
    material: 'Thép không gỉ, thủy tinh borosilicate', color: 'Bạc', dimensions: 'Ø 14 × C 26 cm',
    image: '/uploads/nesta-pour-coffee.png', featured: true
  },
  {
    name: 'Bình Dune', sku: 'NES-DEC-003', price: 1190000, quantity: 9,
    category: 'Trang trí', summary: 'Cặp hình khối hữu cơ với bề mặt như cát mịn.',
    description: 'Hai bình Dune được tạo hình để đứng đẹp cả khi không cắm hoa. Tông cát trung tính, bề mặt mờ và những sai khác nhỏ chủ ý mang lại điểm nhấn yên tĩnh cho kệ hoặc bàn console.',
    material: 'Gốm stoneware thủ công', color: 'Cát tự nhiên', dimensions: 'C 34 cm & C 20 cm',
    image: '/uploads/nesta-dune-vases.png', featured: true
  },
  {
    name: 'Ghế thư giãn Nook', sku: 'NES-FUR-004', price: 8990000, quantity: 5,
    category: 'Nội thất', summary: 'Một chỗ ngồi thấp, êm và vừa vặn cho mọi góc nhỏ.',
    description: 'Khung sồi chắc chắn ôm lấy đệm bọc bouclé dày vừa phải. Tỷ lệ thấp và lưng nghiêng nhẹ hỗ trợ tư thế thư giãn mà không làm không gian trở nên nặng nề.',
    material: 'Gỗ sồi, vải bouclé', color: 'Kem tự nhiên', dimensions: 'R 72 × S 76 × C 70 cm',
    image: '/uploads/nesta-nook-chair.png', featured: true
  },
  {
    name: 'Đồng hồ Mono', sku: 'NES-DEC-005', price: 890000, quantity: 18,
    category: 'Trang trí', summary: 'Thời gian được giản lược thành đường nét thuần khiết.',
    description: 'Mono loại bỏ mọi chi tiết thừa, chỉ giữ lại mặt số sâu và bộ kim thanh mảnh. Bộ máy trôi êm không phát tiếng tích tắc, phù hợp cho phòng ngủ và không gian làm việc.',
    material: 'Nhôm sơn tĩnh điện', color: 'Đen than', dimensions: 'Ø 32 × D 4 cm',
    image: '/uploads/nesta-mono-clock.png', featured: false
  },
  {
    name: 'Đèn không dây Ember', sku: 'NES-LGT-006', price: 2890000, quantity: 11,
    category: 'Chiếu sáng', summary: 'Quầng sáng ấm có thể mang theo từ bàn ăn đến ban công.',
    description: 'Ember là đèn bàn không dây với ba mức sáng và thời lượng pin lên đến 12 giờ. Lớp thủy tinh khói làm mềm nguồn sáng bên trong, tạo bầu không khí ấm mà vẫn hiện đại.',
    material: 'Thủy tinh khói, nhôm anodized', color: 'Khói hổ phách', dimensions: 'Ø 22 × C 26 cm',
    image: '/uploads/nesta-ember-lamp.png', featured: false
  }
];

async function seed() {
  if (!process.env.MONGO_URI) throw new Error('Thiếu MONGO_URI trong file .env');
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`Đã tạo ${inserted.length} sản phẩm mẫu trong MongoDB.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed thất bại:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
