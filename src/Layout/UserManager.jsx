import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_BASE = "http://localhost:5000/api/v1/users";

export default function UserManager() {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Tính toán thời gian hoạt động (giờ, phút, giây)
  const calculateUptime = (createdAtRaw) => {
    if (!createdAtRaw) return "Không xác định";

    try {
      const createdTime = new Date(createdAtRaw);
      if (isNaN(createdTime.getTime())) {
        return "Không xác định";
      }

      const now = new Date();
      const diffMs = now - createdTime;

      if (diffMs < 0) return "Không hợp lệ";

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${hours}h ${minutes}m ${seconds}s`;
    } catch (e) {
      console.error("Lỗi tính uptime:", e);
      return "Không xác định";
    }
  };

  // ✅ Hàm loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    if (!str) return str;
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
    return str;
  };

  // ✅ Hiển thị thông tin người vừa đăng nhập - Lấy từ API để có avatar từ database
  async function fetchUsers() {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        return;
      }

      // Lấy user ID từ localStorage
      const currentUserLocal = JSON.parse(localStorage.getItem("current_user") || "null");
      if (!currentUserLocal || !currentUserLocal._id) {
        toast.warning("Không tìm thấy thông tin người dùng đã đăng nhập");
        setUserData([]);
        return;
      }

      const userId = currentUserLocal._id;

      // Fetch user data từ API để lấy avatar từ database
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_BASE}/${userId}`, { headers });
        const userFromDB = response.data?.data || response.data;

        console.log("📥 User data from API:", {
          id: userFromDB._id,
          email: userFromDB.email,
          hasAvatar: !!userFromDB.avatar,
          avatarLength: userFromDB.avatar ? userFromDB.avatar.length : 0,
          avatarIsBase64: userFromDB.avatar ? userFromDB.avatar.startsWith("data:image") : false,
        });

        const localTimeMap = JSON.parse(localStorage.getItem("user_local_times") || "{}");
        const toVietnamTime = (dateStr) => {
          if (!dateStr) return "Không xác định";
          return moment(dateStr).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
        };

        // Lấy nguồn thời gian (ưu tiên VN trong DB), sau đó format gọn để hiển thị
        const createdSrc = userFromDB.createdAtVN || userFromDB.createdAtLocalStr || userFromDB.createdAt;
        const updatedSrc = userFromDB.updatedAtVN || userFromDB.updatedAtLocalStr || userFromDB.updatedAt;
        const createdAtLocalStr = createdSrc ? toVietnamTime(createdSrc) : "Không xác định";
        const updatedAtLocalStr = updatedSrc ? toVietnamTime(updatedSrc) : "Không xác định";

        setUserData([
          {
            key: userFromDB._id || 1,
            id: userFromDB._id,
            fullName: userFromDB.fullName || userFromDB.name || "Không có tên",
            email: userFromDB.email || "Không có email",
            phone: userFromDB.phone || "Không có số",
            role: userFromDB.role || "USER",
            // Lấy avatar từ database (có thể là base64 hoặc URL)
            avatar: userFromDB.avatar || "",
            isActive: userFromDB.isActive ? "Hoạt động" : "Không hoạt động",
            createdAtLocalStr,
            updatedAtLocalStr,
            uptime: calculateUptime(userFromDB.createdAtVN || createdSrc),
          },
        ]);

        console.log("✅ User data displayed:", {
          id: userData[0]?.id,
          hasAvatar: !!userData[0]?.avatar,
          avatarLength: userData[0]?.avatar ? userData[0].avatar.length : 0,
        });
      } catch (apiError) {
        console.error("❌ Error fetching user from API:", apiError);
        // Fallback: sử dụng data từ localStorage nếu API fail
        toast.warning("Không thể lấy dữ liệu từ server, hiển thị dữ liệu cục bộ");

        const toVietnamTime = (dateStr) => {
          if (!dateStr) return "Không xác định";
          return moment(dateStr).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
        };

        const createdSrc = currentUserLocal.createdAtVN || currentUserLocal.createdAtLocalStr || currentUserLocal.createdAt;
        const updatedSrc = currentUserLocal.updatedAtVN || currentUserLocal.updatedAtLocalStr || currentUserLocal.updatedAt;
        const createdAtLocalStr = createdSrc ? toVietnamTime(createdSrc) : "Không xác định";
        const updatedAtLocalStr = updatedSrc ? toVietnamTime(updatedSrc) : "Không xác định";

        setUserData([
          {
            key: currentUserLocal._id || 1,
            id: currentUserLocal._id,
            fullName: currentUserLocal.fullName || currentUserLocal.name || "Không có tên",
            email: currentUserLocal.email || "Không có email",
            phone: currentUserLocal.phone || "Không có số",
            role: currentUserLocal.role || "USER",
            avatar: currentUserLocal.avatar || "",
            isActive: currentUserLocal.isActive ? "Hoạt động" : "Không hoạt động",
            createdAtLocalStr,
            updatedAtLocalStr,
            uptime: calculateUptime(currentUserLocal.createdAtVN || createdSrc),
          },
        ]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi hiển thị người dùng đăng nhập:", error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Khi bấm nút chỉnh sửa
  function handleEdit(record) {
    setEditUser({ ...record });
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
    });
    setIsEditOpen(true);
  }

  // ✅ Upload avatar tạm thời (base64) - chỉ preview, không lưu vào localStorage
  function beforeUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarBase64 = e.target.result;
      // Chỉ cập nhật preview, KHÔNG lưu vào localStorage vì quá lớn
      setEditUser((prev) => {
        const updated = { ...prev, avatar: avatarBase64 };
        // Cập nhật userData nếu có id
        if (prev.id) {
          setUserData((userDataPrev) => {
            return userDataPrev.map((u) => {
              if (u.id === prev.id) {
                return { ...u, avatar: avatarBase64 };
              }
              return u;
            });
          });
        }
        return updated;
      });
      toast.success("Ảnh đã được tải (preview). Lưu vào database khi cập nhật user.");
    };
    reader.onerror = () => {
      toast.error("Lỗi khi đọc file ảnh!");
    };
    reader.readAsDataURL(file);
    return false;
  }

  // ✅ Cập nhật người dùng
  async function handleUpdate() {
    try {
      const values = await form.validateFields();

      // Kiểm tra quyền: chỉ cho phép cập nhật chính mình
      const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
      const currentUserId = currentUser?._id || currentUser?.id;
      const editUserId = editUser.id || editUser._id;

      if (!currentUserId || currentUserId !== editUserId) {
        toast.error("Bạn chỉ có thể cập nhật thông tin của chính mình!");
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        return;
      }

      // Chuẩn bị dữ liệu để gửi API
      const updateData = {
        name: values.fullName.trim(),
        phone: values.phone.trim(),
        role: values.role,
      };

      // Nếu có avatar mới, thêm vào updateData
      if (editUser.avatar && editUser.avatar.startsWith("data:image")) {
        updateData.avatar = editUser.avatar;
      }

      console.log("📤 Updating user:", { userId: editUserId, updateData });

      // Gọi API để cập nhật user trong database
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.put(`${API_BASE}/${editUserId}`, updateData, { headers });

      console.log("✅ Update API response:", response.data);

      // Cập nhật localStorage sau khi API thành công
      const newUpdatedAtLocal = moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

      if (currentUser && (currentUser._id || currentUser.id) === editUserId) {
        currentUser.fullName = values.fullName;
        currentUser.name = values.fullName;
        currentUser.phone = values.phone;
        currentUser.role = values.role;
        if (editUser.createdAtLocalStr) currentUser.createdAtLocalStr = editUser.createdAtLocalStr;
        currentUser.updatedAtLocalStr = newUpdatedAtLocal;

        // Cập nhật avatar nếu có (nhưng không lưu base64 vào localStorage nếu quá lớn)
        if (editUser.avatar && editUser.avatar.startsWith("data:image")) {
          // Chỉ lưu URL hoặc metadata, không lưu base64 đầy đủ
          currentUser.avatar = editUser.avatar;
        }

        try {
          localStorage.setItem("current_user", JSON.stringify(currentUser));
        } catch (storageError) {
          if (storageError.name === "QuotaExceededError") {
            // Nếu localStorage đầy, xóa avatar base64 trước khi lưu
            const userWithoutLargeAvatar = { ...currentUser };
            if (userWithoutLargeAvatar.avatar?.startsWith("data:image")) {
              userWithoutLargeAvatar.avatar = null;
            }
            localStorage.setItem("current_user", JSON.stringify(userWithoutLargeAvatar));
          }
        }
      }

      // Cập nhật bản đồ thời gian local
      const localTimeMap = JSON.parse(localStorage.getItem("user_local_times") || "{}");
      const exist = localTimeMap[editUserId] || {};
      localTimeMap[editUserId] = {
        createdAtLocalStr: exist.createdAtLocalStr || editUser.createdAtLocalStr,
        updatedAtLocalStr: newUpdatedAtLocal,
      };
      localStorage.setItem("user_local_times", JSON.stringify(localTimeMap));

      toast.success("Cập nhật người dùng thành công!");
      setIsEditOpen(false);
      setEditUser({});
      form.resetFields();
      await fetchUsers(); // Refresh data từ API
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể cập nhật người dùng!";
      toast.error(errorMessage);
    }
  }

  // ✅ Xóa người dùng
  function handleDelete(record) {
    console.log("🗑️ Delete button clicked:", { record });
    setDeletingUser(record);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setDeleting(true);

      // Kiểm tra quyền: chỉ cho phép xóa chính mình
      const currentUser = JSON.parse(localStorage.getItem("current_user") || "null");
      const currentUserId = currentUser?._id || currentUser?.id;
      const recordId = deletingUser.id || deletingUser._id;

      console.log("🔍 Checking permissions:", {
        currentUserId,
        recordId,
        match: currentUserId === recordId,
        currentUser,
        deletingUser,
      });

      if (!currentUserId) {
        toast.error("Không tìm thấy thông tin người dùng!");
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        setDeleting(false);
        return;
      }

      if (currentUserId !== recordId) {
        toast.error("Bạn chỉ có thể xóa tài khoản của chính mình!");
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        setDeleting(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        setDeleting(false);
        return;
      }

      console.log("📤 Calling delete API:", {
        url: `${API_BASE}/${recordId}`,
        userId: recordId,
        hasToken: !!token,
      });

      // Gọi API để xóa user trong database
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.delete(`${API_BASE}/${recordId}`, {
        headers,
        validateStatus: (status) => status < 500, // Accept all status codes < 500
      });

      console.log("📥 Delete API response:", {
        status: response.status,
        data: response.data,
      });

      // Kiểm tra response
      if (response.status >= 400) {
        const errorMessage = response.data?.message || response.data?.error || "Không thể xóa người dùng!";
        toast.error(errorMessage);
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
        setDeleting(false);
        return;
      }

      // Xóa thành công - clear session và chuyển về trang đăng nhập
      console.log("✅ Delete successful, clearing localStorage...");

      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("current_user");
      localStorage.removeItem("user");

      // Xóa avatar và local times nếu có
      try {
        const avatarMap = JSON.parse(localStorage.getItem("user_avatars") || "{}");
        if (avatarMap[recordId]) {
          delete avatarMap[recordId];
          localStorage.setItem("user_avatars", JSON.stringify(avatarMap));
        }

        const localTimeMap = JSON.parse(localStorage.getItem("user_local_times") || "{}");
        if (localTimeMap[recordId]) {
          delete localTimeMap[recordId];
          localStorage.setItem("user_local_times", JSON.stringify(localTimeMap));
        }
      } catch (e) {
        console.warn("⚠️ Error cleaning up localStorage:", e);
      }

      toast.success("Tài khoản đã bị xóa thành công!");

      // Chờ 1.5 giây để hiển thị thông báo rồi chuyển trang
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("❌ Lỗi xóa:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Không thể xóa người dùng!";
      toast.error(errorMessage);
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Chuyển đến trang chủ
  function goToHome() {
    navigate("/home");
  }

  // ✅ Xuất file PDF toàn bộ danh sách (có ảnh, hỗ trợ tiếng Việt)
  function exportPDF() {
    if (!userData.length) {
      toast.warning("Không có dữ liệu để xuất PDF!");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Hàm vẽ header
    const drawHeader = () => {
      doc.setFillColor(63, 81, 181);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("THÔNG TIN NGUOI DUNG", pageWidth / 2, 25, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const exportDate = new Date().toLocaleString("vi-VN");
      doc.text(`Ngay xuat: ${exportDate}`, pageWidth - 20, 35, { align: "right" });

      doc.setTextColor(0, 0, 0);
      yPosition = 50;
    };

    // Hàm vẽ footer
    const drawFooter = (pageNum, totalPages) => {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Trang ${pageNum} / ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.setTextColor(0, 0, 0);
    };

    const itemsPerPage = Math.floor((pageHeight - 80) / 35);
    const totalPages = Math.ceil(userData.length / itemsPerPage);
    drawHeader();

    // Chuẩn bị dữ liệu - loại bỏ dấu tiếng Việt
    const tableData = userData.map((u, index) => {
      return [
        index + 1,
        removeVietnameseTones(u.fullName) || "N/A",
        u.email || "N/A",
        u.phone || "N/A",
        u.role || "USER",
        removeVietnameseTones(u.isActive) || "N/A",
      ];
    });

    doc.autoTable({
      startY: yPosition,
      head: [["STT", "Ho ten", "Email", "So dien thoai", "Vai tro", "Trang thai"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25, halign: "center" },
        5: { cellWidth: 30, halign: "center" },
      },
      margin: { top: yPosition, left: 14, right: 14 },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
        font: "helvetica",
      },
      willDrawPage: function (data) {
        if (data.pageNumber > 1) {
          drawHeader();
        }
      },
      didDrawPage: function (data) {
        const pageNum = data.pageNumber;
        drawFooter(pageNum, totalPages);
      },
    });

    doc.save("ThongTinNguoiDung.pdf");
    toast.success("Xuất file PDF thành công!");
  }

  // ✅ Xuất file PDF cho từng user
  function exportUserPDF(record) {
    if (!record) {
      toast.warning("Không có người dùng được chọn!");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(63, 81, 181);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const exportDate = new Date().toLocaleString("vi-VN");
    doc.text(`Ngay xuat: ${exportDate}`, pageWidth - 15, 45, { align: "right" });
    doc.setTextColor(0, 0, 0);

    const boxY = 70;
    const boxWidth = pageWidth - 40;
    const boxHeight = 120;

    doc.setFillColor(250, 250, 250);
    doc.rect(20, boxY, boxWidth, boxHeight, "F");
    doc.setDrawColor(63, 81, 181);
    doc.setLineWidth(1.5);
    doc.rect(20, boxY, boxWidth, boxHeight);

    let avatarY = boxY + 10;
    if (record.avatar) {
      try {
        const avatarX = pageWidth - 60;
        doc.setFillColor(255, 255, 255);
        doc.rect(avatarX - 2, avatarY - 2, 44, 44, "F");
        doc.setDrawColor(63, 81, 181);
        doc.setLineWidth(2);
        doc.rect(avatarX - 2, avatarY - 2, 44, 44);
        doc.addImage(record.avatar, "JPEG", avatarX, avatarY, 40, 40, undefined, "FAST");
      } catch {
        // Nếu ảnh lỗi thì bỏ qua
      }
    }

    let infoY = boxY + 25;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(63, 81, 181);
    doc.text("Chi tiet thong tin", 30, infoY);
    infoY += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const fields = [
      { label: "Ho va ten", value: removeVietnameseTones(record.fullName) || "N/A" },
      { label: "Email", value: record.email || "N/A" },
      { label: "So dien thoai", value: record.phone || "N/A" },
      { label: "Vai tro", value: record.role || "USER" },
      { label: "Trang thai", value: removeVietnameseTones(record.isActive) || "N/A" },
    ];

    fields.forEach((field, index) => {
      const currentY = infoY + index * 15;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(`${field.label}:`, 30, currentY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      const labelWidth = doc.getTextWidth(`${field.label}:`);
      doc.text(field.value, 30 + labelWidth + 5, currentY);
    });

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Tai lieu nay duoc tao tu dong tu he thong quan ly", pageWidth / 2, pageHeight - 15, { align: "center" });

    const fileName = removeVietnameseTones(record.fullName).replace(/\s+/g, "_").toLowerCase() || "user_info";
    doc.save(`${fileName}.pdf`);
    toast.success(`Xuat PDF cho ${record.fullName} thanh cong!`);
  }

  // ✅ Cấu hình bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    // ✅ Cột thời gian hoạt động (thay thế 2 cột giờ cũ)
    { title: "Tài khoản hoạt động", dataIndex: "uptime", key: "uptime" },
    {
      title: "Ảnh đại diện",
      key: "avatar",
      dataIndex: "avatar",
      render: (text, record) => {
        if (record.avatar && (record.avatar.startsWith("data:image") || record.avatar.startsWith("http"))) {
          return (
            <img
              src={record.avatar}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => {
                console.error("❌ Error loading avatar image:", e);
                e.target.style.display = "none";
              }}
            />
          );
        }
        return <span style={{ color: "#999" }}>Không có</span>;
      },
    },
    {
      title: "Vai trò",
      key: "role",
      dataIndex: "role",
      render: (role) => <Tag color={role === "ADMIN" ? "red" : "blue"}>{role.toUpperCase()}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div className="flex space-x-3">
          <EditOutlined
            style={{ color: "blue", cursor: "pointer", fontSize: "18px" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
            onClick={() => handleDelete(record)}
          />
          <Button
            type="primary"
            size="small"
            icon={<FilePdfOutlined />}
            onClick={() => exportUserPDF(record)}
          >
            Xuất PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen grid place-items-center bg-gray-900 p-6">
      <div className="w-full max-w-6xl px-8 py-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">THÔNG TIN NGƯỜI DÙNG</h2>

        {/* Bảng người dùng */}
        <Table
          columns={columns}
          dataSource={userData}
          loading={loading}
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: true }}
        />

        {/* Nút thao tác */}
        <div className="flex justify-end mt-6 space-x-2">
          <Button type="default" onClick={goToHome}>
            Khám phá ngay
          </Button>
          <Button type="primary" onClick={exportPDF} icon={<FilePdfOutlined />}>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditOpen}
        onOk={handleUpdate}
        onCancel={() => {
          setIsEditOpen(false);
          setEditUser({});
          form.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Họ tên" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="role">
            <Select>
              <Select.Option value="USER">USER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/*"
            >
              {editUser.avatar ? (
                <img
                  src={editUser.avatar}
                  alt="avatar"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xóa người dùng"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: deleting }}
        confirmLoading={deleting}
      >
        <p>
          Bạn có chắc chắn muốn xóa tài khoản <strong>{deletingUser?.fullName || deletingUser?.name}</strong>?
        </p>
        <p style={{ color: "red", marginTop: 10 }}>
          ⚠️ Hành động này không thể hoàn tác!
        </p>
      </Modal>
    </div>
  );
}
