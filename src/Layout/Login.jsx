import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { loginApi } from "../api/auth";

// Logo - Sử dụng file Logo.jpg từ thư mục public
const Logo = "/Logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
    const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
        setLoading(true);

    try {
      // Validate form trước khi gửi
      if (!values.email || !values.password) {
        toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
        setLoading(false);
        return;
      }

      // Normalize email và password
      const normalizedEmail = values.email.trim().toLowerCase();
      const trimmedPassword = values.password.trim();

      if (!normalizedEmail || !trimmedPassword) {
        toast.error("Email và mật khẩu không được để trống");
        setLoading(false);
        return;
      }

      console.log("📤 Preparing login request:", {
        email: normalizedEmail,
        hasPassword: !!trimmedPassword,
        passwordLength: trimmedPassword.length,
      });

      const data = await loginApi({
        email: normalizedEmail,
        password: trimmedPassword,
      });

      const { token, user } = data;

      if (!token) {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      // Lưu token với nhiều key để đảm bảo tương thích
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);

      // Lưu thông tin user (KHÔNG lưu avatar base64 vì quá lớn - gây QuotaExceededError)
      let savedUser = null;
      if (user) {
        // Đảm bảo role là ADMIN (uppercase) nếu là admin
        let userRole = user.role;
        if (user.email === 'admin@gmail.com' || user.email?.toLowerCase() === 'admin@gmail.com') {
          userRole = 'ADMIN';
          console.log('✅ Admin account detected, setting role to ADMIN');
        } else if (user.role && typeof user.role === 'string') {
          // Chuẩn hóa role: ADMIN, Admin, admin -> ADMIN
          userRole = user.role.toUpperCase();
        }
        
        // Tạo user object nhỏ gọn, loại bỏ avatar base64 để tránh QuotaExceededError
        const userWithoutAvatar = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: userRole, // Sử dụng role đã chuẩn hóa
          createdAtVN: user.createdAtVN,
          updatedAtVN: user.updatedAtVN,
          avatarInfo: user.avatarInfo, // Giữ metadata nhưng không lưu base64
          // KHÔNG lưu avatar base64 - sẽ lấy từ database khi cần
          // Nếu avatar là URL (không phải base64), giữ lại
          avatar: user.avatar && !user.avatar.startsWith("data:image") ? user.avatar : null,
        };
        savedUser = userWithoutAvatar;

        try {
          localStorage.setItem("current_user", JSON.stringify(userWithoutAvatar));
          localStorage.setItem("user", JSON.stringify(userWithoutAvatar));
          console.log("✅ User data saved to localStorage (without large avatar base64):", {
            id: userWithoutAvatar._id,
            email: userWithoutAvatar.email,
            name: userWithoutAvatar.name,
            role: userWithoutAvatar.role,
            hasAvatarInfo: !!userWithoutAvatar.avatarInfo,
          });
          console.log("🔍 User role after normalization:", userWithoutAvatar.role);
        } catch (storageError) {
          if (storageError.name === "QuotaExceededError") {
            console.error("❌ localStorage quota exceeded. Trying to clear old data...");
            // Thử xóa một số key cũ
            try {
              localStorage.removeItem("user_avatars");
              localStorage.setItem("current_user", JSON.stringify(userWithoutAvatar));
              localStorage.setItem("user", JSON.stringify(userWithoutAvatar));
              console.log("✅ Retry successful after clearing old data");
            } catch (retryError) {
              console.error("❌ Still failed after cleanup. User data too large.");
              toast.warning("Lưu thông tin người dùng thất bại do bộ nhớ đầy. Đăng nhập vẫn thành công.");
            }
          } else {
            throw storageError;
          }
        }
      }

      toast.success("Đăng nhập thành công");

      // Kiểm tra xem có return URL từ React app không
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("return");

      // Nếu có return URL từ React app, redirect về React app
      if (returnUrl) {
        const reactAppUrl = "http://localhost:5173";
        window.location.href = `${reactAppUrl}${returnUrl}`;
      } else {
        // Kiểm tra role để redirect đúng trang
        const userRole = savedUser?.role || user?.role;
        const userEmail = savedUser?.email || user?.email;
        console.log("🔍 User role after login:", userRole);
        console.log("🔍 User email after login:", userEmail);
        console.log("🔍 Full user object:", savedUser || user);
        
        // Kiểm tra role (không phân biệt hoa thường) hoặc email admin
        const isAdmin = 
          (userRole && (userRole.toUpperCase() === 'ADMIN' || userRole === 'Admin')) ||
          (userEmail && userEmail.toLowerCase() === 'admin@gmail.com');
        
        if (isAdmin) {
          // Nếu là admin, redirect đến trang admin
          console.log("✅ Redirecting to admin dashboard");
          navigate("/admin");
        } else {
          // Nếu là user thường, redirect đến trang data-user
          console.log("✅ Redirecting to user data page");
          navigate("/data-user");
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      // Xử lý các loại lỗi khác nhau
      if (error.message && error.message.includes("kết nối đến server")) {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Sai tài khoản hoặc mật khẩu");
      }
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video nền */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-[100%] h-full object-cover"
      >
        <source
          src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          type="video/mp4"
        />
      </video>

      {/* Container với logo và form */}
      <div className="absolute z-10 w-full flex flex-col items-center justify-center px-8">
        {/* Logo phía trên */}
        <div className="mb-8">
          <img src={Logo} alt="Logo" className="w-32 h-32 object-contain opacity-90" />
                    </div>

        {/* Form đăng nhập */}
        <div className="w-[400px] p-6 rounded-lg bg-transparent shadow-lg">
          <h2 className="text-center text-[30px] font-semibold mb-4 text-white">Đăng Nhập</h2>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email" className="mb-[20px] h-[40px]" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Mật khẩu" className="h-[40px]" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-[45px] font-semibold mt-2"
            >
              Đăng Nhập
            </Button>
          </Form>

          <div className="text-center mt-20">
            <Link to="/register" className="text-white underline hover:text-gray-200">
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </div>
            </div>
        </div>
    );
}
