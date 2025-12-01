import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Modal, Form, Input, Select } from 'antd';
import { getAuthToken, getAuthHeaders } from '../config/api';

const API_BASE = 'http://localhost:5000/api/v1/users';

const AdminUserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Bạn chưa đăng nhập!');
        return;
      }

      const headers = getAuthHeaders(false);
      const response = await axios.get(API_BASE, { headers });
      
      let usersList = [];
      if (Array.isArray(response.data)) {
        usersList = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersList = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        usersList = response.data.users;
      }

      setUsers(usersList);
      console.log('✅ Users loaded:', usersList.length);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name || user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || 'USER',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const headers = getAuthHeaders(false);
      await axios.delete(`${API_BASE}/${userId}`, { headers });
      toast.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      toast.error(error?.response?.data?.message || 'Không thể xóa người dùng!');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = getAuthToken();
      const headers = getAuthHeaders();

      if (isEditMode && editingUser) {
        // Update user
        const updateData = {
          name: values.name.trim(),
          phone: values.phone.trim(),
          role: values.role,
        };
        await axios.put(`${API_BASE}/${editingUser._id || editingUser.id}`, updateData, { headers });
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // Create user - cần gọi API register
        const registerData = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password.trim(),
          phone: values.phone.trim(),
        };
        await axios.post('http://localhost:5000/api/v1/auth/register', registerData, { headers });
        toast.success('Thêm người dùng thành công!');
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('❌ Error saving user:', error);
      toast.error(error?.response?.data?.message || 'Không thể lưu người dùng!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i>
          Thêm người dùng
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng ký</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quyền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <i className="fa-solid fa-user text-gray-400"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.name || user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt || user.createdAtVN)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (user.role === 'ADMIN' || user.role === 'Admin')
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id || user.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có người dùng nào</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: !isEditMode, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input disabled={isEditMode} placeholder="Nhập email" />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Quyền"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
          >
            <Select>
              <Select.Option value="USER">User</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditMode ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;

