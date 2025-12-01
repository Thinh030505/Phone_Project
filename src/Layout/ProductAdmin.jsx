import React, { useState } from "react";

const initialBooks = [
  {
    id: 1,
    title: "Làm Giàu Từ Tư Duy",
    description: "Cuốn sách phát triển bản thân nổi tiếng từ Nhật Bản.",
    author: "Koga Ichiro",
    brand: "Alphabooks",
    price: 120000,
    cover:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: 2,
    title: "Nhà Giả Kim",
    description: "Hành trình đi tìm kho báu và khám phá bản thân.",
    author: "Paulo Coelho",
    brand: "NXB Văn Học",
    price: 95000,
    cover:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=201",
  },
  {
    id: 3,
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    description: "Những suy ngẫm về tuổi trẻ, sự nghiệp và đam mê.",
    author: "Rosie Nguyễn",
    brand: "NXB Trẻ",
    price: 88000,
    cover:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=202",
  },
  {
    id: 4,
    title: "Đắc Nhân Tâm",
    description: "Nghệ thuật giao tiếp và thuyết phục bất hủ.",
    author: "Dale Carnegie",
    brand: "First News",
    price: 135000,
    cover:
      "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=203",
  },
];

const AdminBookDashboard = () => {
  const [books] = useState(initialBooks);

  const formatPrice = (value) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

  return (
    <div style={{ padding: "32px 80px", backgroundColor: "#fff" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "24px", margin: 0 }}>TẤT CẢ SẢN PHẨM</h2>
        <button
          style={{
            backgroundColor: "#1677ff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          <i className="fa-solid fa-plus"></i>
          Thêm sản phẩm
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header cột */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 3fr 1.2fr 1.2fr 1fr",
            backgroundColor: "#fafafa",
            padding: "12px 20px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#999",
          }}
        >
          <div></div>
          <div>Sản phẩm</div>
          <div>Brand</div>
          <div>Giá</div>
          <div>Hành động</div>
        </div>

        {/* Dòng dữ liệu */}
        {books.map((b) => (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 3fr 1.2fr 1.2fr 1fr",
              padding: "14px 20px",
              alignItems: "center",
              borderTop: "1px solid #f0f0f0",
              fontSize: "14px",
            }}
          >
            {/* Checkbox */}
            <div>
              <input type="checkbox" />
            </div>

            {/* Sản phẩm (ảnh + info) */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={b.cover}
                alt={b.title}
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{b.title}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    marginTop: "2px",
                  }}
                >
                  {b.description}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#aaa",
                    marginTop: "2px",
                  }}
                >
                  Tác giả: {b.author}
                </div>
              </div>
            </div>

            {/* Brand */}
            <div style={{ fontWeight: 500 }}>{b.brand}</div>

            {/* Giá */}
            <div style={{ fontWeight: 600 }}>{formatPrice(b.price)}</div>

            {/* Hành động */}
            <div style={{ display: "flex", gap: "12px", fontSize: "16px" }}>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#1677ff",
                }}
                title="Chỉnh sửa"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#ff4d4f",
                }}
                title="Xóa"
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookDashboard;