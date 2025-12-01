import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { API_CONFIG, getAuthToken, getAuthHeaders } from '../config/api';

const API_BASE = 'http://localhost:5000/api/v1';

const AdminOverview = () => {
    const toast = useToast();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            if (!token) {
                toast.error('Bạn chưa đăng nhập!');
                return;
            }

            const headers = getAuthHeaders(false);

            // Fetch users count
            try {
                const usersRes = await axios.get(`${API_BASE}/users`, { headers });
                const users = Array.isArray(usersRes.data)
                    ? usersRes.data
                    : usersRes.data?.data || usersRes.data?.users || [];
                setStats((prev) => ({ ...prev, totalUsers: users.length }));
            } catch (e) {
                console.error('Error fetching users:', e);
            }

            // Fetch products count
            try {
                const productsRes = await axios.get(API_CONFIG.PRODUCTS_API, { headers });
                const products = Array.isArray(productsRes.data)
                    ? productsRes.data
                    : productsRes.data?.data || productsRes.data?.products || [];
                setStats((prev) => ({ ...prev, totalProducts: products.length }));
            } catch (e) {
                console.error('Error fetching products:', e);
            }

      // Fetch orders/payments count
      try {
        const ordersRes = await axios.get(`${API_BASE}/payments`, { 
          headers,
          validateStatus: (status) => status < 500, // Accept 4xx errors
        });
        
        if (ordersRes.status === 404) {
          console.warn('⚠️ GET /api/v1/payments endpoint không tồn tại. Backend có thể chỉ có POST.');
          // Không set stats, giữ giá trị mặc định (0)
        } else if (ordersRes.status >= 400) {
          console.warn('⚠️ Error fetching orders:', ordersRes.status, ordersRes.data);
        } else {
          const orders = Array.isArray(ordersRes.data)
            ? ordersRes.data
            : ordersRes.data?.data || ordersRes.data?.payments || [];
          const revenue = orders.reduce((sum, order) => {
            const total = order.totalAmount || order.amount || 0;
            return sum + (typeof total === 'number' ? total : parseFloat(total) || 0);
          }, 0);
          setStats((prev) => ({
            ...prev,
            totalOrders: orders.length,
            totalRevenue: revenue,
          }));
        }
      } catch (e) {
        if (e.response?.status === 404) {
          console.warn('⚠️ GET /api/v1/payments endpoint không tồn tại. Backend có thể chỉ có POST.');
        } else {
          console.error('Error fetching orders:', e);
        }
      }
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Không thể tải thống kê!');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: 'fa-users',
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
        },
        {
            title: 'Tổng sản phẩm',
            value: stats.totalProducts,
            icon: 'fa-box',
            color: 'bg-green-500',
            textColor: 'text-green-600',
        },
        {
            title: 'Tổng đơn hàng',
            value: stats.totalOrders,
            icon: 'fa-shopping-cart',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
        },
        {
            title: 'Tổng doanh thu',
            value: `${stats.totalRevenue.toLocaleString('vi-VN')} đ`,
            icon: 'fa-dollar-sign',
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            </div>
                            <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                                <i className={`fa-solid ${stat.icon} text-white text-xl`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => window.location.href = '/admin/users'}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <i className="fa-solid fa-user-plus text-blue-600 text-xl"></i>
                        <div className="text-left">
                            <p className="font-medium text-gray-800">Thêm người dùng</p>
                            <p className="text-sm text-gray-500">Tạo tài khoản mới</p>
                        </div>
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/products'}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                        <i className="fa-solid fa-plus text-green-600 text-xl"></i>
                        <div className="text-left">
                            <p className="font-medium text-gray-800">Thêm sản phẩm</p>
                            <p className="text-sm text-gray-500">Tạo sản phẩm mới</p>
                        </div>
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/orders'}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                    >
                        <i className="fa-solid fa-list text-yellow-600 text-xl"></i>
                        <div className="text-left">
                            <p className="font-medium text-gray-800">Xem đơn hàng</p>
                            <p className="text-sm text-gray-500">Quản lý đơn hàng</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <i className="fa-solid fa-user text-blue-600"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Người dùng mới đăng ký</p>
                            <p className="text-xs text-gray-500">Vừa xong</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fa-solid fa-box text-green-600"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Sản phẩm mới được thêm</p>
                            <p className="text-xs text-gray-500">5 phút trước</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <i className="fa-solid fa-shopping-cart text-yellow-600"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Đơn hàng mới</p>
                            <p className="text-xs text-gray-500">10 phút trước</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;

