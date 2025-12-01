import React from "react";

const Contact = () => {
  return (
    <div style={{ padding: "40px 80px", backgroundColor: "#fff" }}>
      {/* Tiêu đề */}
      <h2 style={{ fontSize: "32px", marginBottom: "30px" }}>Contact Us</h2>

      {/* 3 cột thông tin */}
      <div
        style={{
          display: "flex",
          gap: "60px",
          marginBottom: "40px",
          fontSize: "14px",
        }}
      >
        <div>
          <h4 style={{ marginBottom: "10px", fontWeight: 600 }}>THỜI GIAN MỞ CỬA</h4>
          <p style={{ margin: 0 }}>Từ: 8 a.m – 5 p.m.</p>
          <p style={{ margin: 0 }}>Sunday & Holidays: Closed</p>
        </div>

        <div>
          <h4 style={{ marginBottom: "10px", fontWeight: 600 }}>EXHIBITIONS GALLERY</h4>
          <p style={{ margin: 0 }}>Dutch Artists</p>
          <p style={{ margin: 0 }}>Modern Exhibitions</p>
        </div>

        <div>
          <h4 style={{ marginBottom: "10px", fontWeight: 600 }}>GALLERY OFFICES</h4>
          <p style={{ margin: 0 }}>Magic Pictures</p>
          <p style={{ margin: 0 }}>Installation "Future Divi Life"</p>
        </div>
      </div>

      {/* Form + Map */}
      <div style={{ display: "flex", gap: "40px" }}>
        {/* Form bên trái */}
        <form
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="TÊN CỦA BẠN"
            style={{
              padding: "12px 14px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
          <input
            type="email"
            placeholder="ĐỊA CHỈ EMAIL"
            style={{
              padding: "12px 14px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
          <textarea
            rows={5}
            placeholder="NỘI DUNG LIÊN HỆ"
            style={{
              padding: "12px 14px",
              border: "1px solid #ddd",
              outline: "none",
              resize: "vertical",
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              letterSpacing: "1px",
            }}
          >
            GỬI
          </button>
        </form>

        {/* Map + info bên phải */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ width: "100%", height: "230px", border: "1px solid #eee" }}>
            <iframe
              title="Contact map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.148138767018!2d108.2145602748204!3d16.058238739326996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219cff671aaab%3A0x40f62f5a85b4525!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaeG6v24gdHLhu4thIMSQw6A!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div>
            <h4 style={{ marginBottom: "8px", fontWeight: 600 }}>
              TRƯỜNG ĐẠI HỌC KIẾN TRÚC ĐÀ NẴNG
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;