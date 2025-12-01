import React, { useState } from "react";

const usersData = [
  {
    id: 1,
    name: "Lê Thịnh",
    email: "Thinh@gmail.com",
    phone: "—",
    date: "2025-09-26",
    status: "Đã kích hoạt",
    role: "Admin",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Thịnh ",
    email: "Thinh@gmail.com",
    phone: "—",
    date: "2025-09-26",
    status: "Đã kích hoạt",
    role: "Admin",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Thinh Nè",
    email: "Thịnh@gmail.com",
    phone: "—",
    date: "2025-10-05",
    status: "Đã kích hoạt",
    role: "Admin",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Thịnh Đây",
    email: "Thịnh@gmail.com",
    phone: "—",
    date: "2025-11-10",
    status: "Đã kích hoạt",
    role: "User",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
];

const pillStatusStyle = {
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  color: "#fff",
  backgroundColor: "#ff4d4f",
};

const rolePillStyle = (role) => ({
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  backgroundColor: role === "Admin" ? "#000" : "#f0f0f0",
  color: role === "Admin" ? "#fff" : "#555",
});

const AdminUserDashboard = () => {
  const [users, setUsers] = useState(usersData);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
  });

  const handleOpenAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUserModal(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "User",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextUser = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "—",
      date: new Date().toISOString().slice(0, 10),
      status: "Đã kích hoạt",
      role: newUser.role,
      avatar: `https://i.pravatar.cc/40?img=${users.length + 5}`,
    };
    setUsers((prev) => [...prev, nextUser]);
    handleCloseAddUser();
  };

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
        <h2 style={{ fontSize: "24px", margin: 0 }}>QUẢN LÝ NGƯỜI DÙNG</h2>
        <button
          onClick={handleOpenAddUser}
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
          <i className="fa-solid fa-user-plus"></i>
          Thêm người dùng
        </button>
      </div>

      {/* Bảng người dùng */}
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
            gridTemplateColumns:
              "40px minmax(180px, 1.6fr) minmax(180px, 1.4fr) 120px 140px 140px 120px 120px",
            backgroundColor: "#fafafa",
            padding: "12px 20px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#999",
          }}
        >
          <div></div>
          <div>Khách hàng</div>
          <div>Email</div>
          <div>Số điện thoại</div>
          <div>Ngày đăng ký</div>
          <div>Trạng thái</div>
          <div>Quyền</div>
          <div>Hành động</div>
        </div>

        {/* Rows */}
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "40px minmax(180px, 1.6fr) minmax(180px, 1.4fr) 120px 140px 140px 120px 120px",
              padding: "14px 20px",
              alignItems: "center",
              borderTop: "1px solid #f0f0f0",
              fontSize: "14px",
            }}
          >
            <div>
              <input type="checkbox" />
            </div>

            {/* Khách hàng + avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={u.avatar}
                alt={u.name}
                style={{ width: "36px", height: "36px", borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{u.email}</div>
              </div>
            </div>

            <div>{u.email}</div>
            <div>{u.phone}</div>
            <div>{u.date}</div>

            {/* Trạng thái */}
            <div>
              <span style={pillStatusStyle}>
                <i
                  className="fa-solid fa-circle-exclamation"
                  style={{ marginRight: 4 }}
                ></i>
                {u.status}
              </span>
            </div>

            {/* Quyền */}
            <div>
              <span style={rolePillStyle(u.role)}>{u.role}</span>
            </div>

            {/* Hành động */}
            <div style={{ display: "flex", gap: "12px", fontSize: "16px" }}>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#1677ff",
                }}
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
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm khách hàng mới */}
      {showAddUserModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "520px",
              maxWidth: "90%",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              padding: "24px 32px 28px",
            }}
          >
            {/* Header modal */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#e6f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  color: "#1677ff",
                  fontSize: "20px",
                }}
              >
                <i className="fa-regular fa-user"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Thêm khách hàng mới</h3>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#777",
                }}
              >
                Nhập thông tin khách hàng vào bên dưới.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{ display: "block", fontSize: "13px", marginBottom: 4 }}
                >
                  Tên *
                </label>
                <input
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{ display: "block", fontSize: "13px", marginBottom: 4 }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{ display: "block", fontSize: "13px", marginBottom: 4 }}
                >
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{ display: "block", fontSize: "13px", marginBottom: 4 }}
                >
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", fontSize: "13px", marginBottom: 4 }}
                >
                  Phân quyền
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Footer button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseAddUser}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 22px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#1677ff",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDashboard;