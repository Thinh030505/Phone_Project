import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import AdminOverview from './AdminOverview';
import AdminUserManagement from './AdminUserManagement';
import AdminProductManagement from './AdminProductManagement';
import AdminOrderManagement from './AdminOrderManagement';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Kiểm tra quyền admin
        const user = JSON.parse(localStorage.getItem('current_user') || 'null');
        if (!user) {
            toast.error('Bạn cần đăng nhập để truy cập trang admin!');
            navigate('/');
            return;
        }
        // Kiểm tra role (không phân biệt hoa thường) hoặc email admin
        const userRole = user.role?.toUpperCase();
        const userEmail = user.email?.toLowerCase();
        const isAdmin =
            (userRole === 'ADMIN') ||
            (userEmail === 'admin@gmail.com');

        if (!isAdmin) {
            toast.error('Bạn không có quyền truy cập trang admin!');
            navigate('/home');
            return;
        }
        setCurrentUser(user);

        // Lấy active tab từ URL hoặc mặc định
        const path = location.pathname;
        if (path.includes('/admin/users')) {
            setActiveTab('users');
        } else if (path.includes('/admin/products')) {
            setActiveTab('products');
        } else if (path.includes('/admin/orders')) {
            setActiveTab('orders');
        } else {
            setActiveTab('overview');
        }
    }, [location, navigate, toast]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Navigate đến route tương ứng
        if (tab === 'users') {
            navigate('/admin/users');
        } else if (tab === 'products') {
            navigate('/admin/products');
        } else if (tab === 'orders') {
            navigate('/admin/orders');
        } else {
            navigate('/admin');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('current_user');
        toast.success('Đăng xuất thành công!');
        navigate('/');
    };

    const menuItems = [
        { id: 'overview', label: 'Tổng quan', icon: 'fa-chart-line' },
        { id: 'users', label: 'Quản lý người dùng', icon: 'fa-users' },
        { id: 'products', label: 'Quản lý sản phẩm', icon: 'fa-box' },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: 'fa-shopping-cart' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                {/* Logo/Header */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="text-sm text-gray-400 mt-1">Quản lý hệ thống</p>
                </div>

                {/* User Info */}
                {currentUser && (
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <i className="fa-solid fa-user text-white"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{currentUser.name || currentUser.fullName}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <i className={`fa-solid ${item.icon} w-5`}></i>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <i className="fa-solid fa-sign-out-alt w-5"></i>
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {menuItems.find((item) => item.id === activeTab)?.label || 'Dashboard'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/home')}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                            >
                                <i className="fa-solid fa-home mr-2"></i>
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && <AdminOverview />}
                    {activeTab === 'users' && <AdminUserManagement />}
                    {activeTab === 'products' && <AdminProductManagement />}
                    {activeTab === 'orders' && <AdminOrderManagement />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

