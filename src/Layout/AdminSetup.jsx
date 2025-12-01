import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const AdminSetup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      let users = [];
      if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        users = response.data.users;
      }

      const hasAdmin = users.some(
        (user) => user.email === 'admin@gmail.com' && (user.role === 'ADMIN' || user.role === 'Admin')
      );
      setAdminExists(hasAdmin);
    } catch (error) {
      console.error('Error checking admin:', error);
      // Nếu không kiểm tra được, vẫn cho phép tạo
      setAdminExists(false);
    } finally {
      setChecking(false);
    }
  };

  const createAdmin = async () => {
    try {
      setLoading(true);

      const adminData = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin',
        phone: '0000000000',
        role: 'ADMIN',
      };

      const response = await axios.post(`${API_BASE_URL}/auth/register`, adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      });

      if (response.status >= 400) {
        const errorMessage = response.data?.message || response.data?.error || 'Không thể tạo tài khoản admin!';
        throw new Error(errorMessage);
      }

      toast.success('Tài khoản admin đã được tạo thành công!');
      toast.info('Email: admin@gmail.com | Password: admin');

      // Chờ 2 giây rồi redirect đến trang login
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating admin:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Không thể tạo tài khoản admin!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-green-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tài khoản Admin đã tồn tại</h2>
            <p className="text-gray-600 mb-6">
              Tài khoản admin với email <strong>admin@gmail.com</strong> đã được tạo trước đó.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đi đến trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-shield text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tạo Tài Khoản Admin</h2>
          <p className="text-gray-600">
            Tạo tài khoản quản trị viên mặc định cho hệ thống
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Thông tin tài khoản:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">admin@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Password:</span>
              <span className="font-medium text-gray-800">admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-800">ADMIN</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            <strong>Lưu ý:</strong> Chỉ tạo một lần duy nhất. Sau khi tạo, bạn có thể đăng nhập và đổi mật khẩu.
          </p>
        </div>

        <button
          onClick={createAdmin}
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang tạo...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-plus"></i>
              <span>Tạo Tài Khoản Admin</span>
            </>
          )}
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AdminSetup;

