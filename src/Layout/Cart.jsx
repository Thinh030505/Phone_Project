import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { API_CONFIG, getAuthToken, getAuthHeaders } from '../config/api';

const Cart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [updatingItems, setUpdatingItems] = useState(new Set());

    // Helper function để format giá
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN') + ' đ';
        }
        if (typeof price === 'string') {
            if (price.includes('đ') || price.includes('$')) {
                return price;
            }
            const numPrice = parseFloat(price.replace(/[^\d]/g, ''));
            if (!isNaN(numPrice)) {
                return numPrice.toLocaleString('vi-VN') + ' đ';
            }
        }
        return price || '0 đ';
    };

    // Fetch giỏ hàng từ API
    const fetchCartFromAPI = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();
            if (!token) {
                setError('Bạn cần đăng nhập để xem giỏ hàng!');
                setCartItems([]);
                setLoading(false);
                return;
            }

            const response = await fetch(API_CONFIG.CART_API, {
                method: 'GET',
                headers: getAuthHeaders(false)
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setCartItems([]);
                    setCartData(null);
                    setLoading(false);
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📦 Giỏ hàng từ API backend (raw):", JSON.stringify(data, null, 2));
            console.log("📦 Type của data:", typeof data);
            console.log("📦 Is Array?", Array.isArray(data));

            // Xử lý nhiều format response
            let products = [];
            let cartInfo = null;

            if (Array.isArray(data)) {
                // Nếu response là array trực tiếp
                products = data;
                console.log("✅ Nhận được array trực tiếp, số lượng:", products.length);
            } else if (data && typeof data === 'object') {
                // Xử lý format: { success: true, data: { items: [...] } }
                if (data.success && data.data && data.data.items && Array.isArray(data.data.items)) {
                    products = data.data.items;
                    cartInfo = { ...data.data };
                    delete cartInfo.items;
                    console.log("✅ Nhận được data.data.items, số lượng:", products.length);
                }
                // Xử lý format: { data: { items: [...] } }
                else if (data.data && data.data.items && Array.isArray(data.data.items)) {
                    products = data.data.items;
                    cartInfo = { ...data.data };
                    delete cartInfo.items;
                    console.log("✅ Nhận được data.data.items (không có success), số lượng:", products.length);
                }
                // Xử lý format: { products: [...] }
                else if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                    cartInfo = { ...data };
                    delete cartInfo.products;
                    console.log("✅ Nhận được data.products, số lượng:", products.length);
                }
                // Xử lý format: { items: [...] }
                else if (data.items && Array.isArray(data.items)) {
                    products = data.items;
                    cartInfo = { ...data };
                    delete cartInfo.items;
                    console.log("✅ Nhận được data.items, số lượng:", products.length);
                }
                // Xử lý format: { data: [...] }
                else if (data.data && Array.isArray(data.data)) {
                    products = data.data;
                    cartInfo = { ...data };
                    delete cartInfo.data;
                    console.log("✅ Nhận được data.data (array), số lượng:", products.length);
                }
                // Xử lý format: { cart: [...] }
                else if (data.cart && Array.isArray(data.cart)) {
                    products = data.cart;
                    cartInfo = { ...data };
                    delete cartInfo.cart;
                    console.log("✅ Nhận được data.cart, số lượng:", products.length);
                }
                // Xử lý format: { result: [...] }
                else if (data.result && Array.isArray(data.result)) {
                    products = data.result;
                    cartInfo = { ...data };
                    delete cartInfo.result;
                    console.log("✅ Nhận được data.result, số lượng:", products.length);
                } else {
                    // Nếu không tìm thấy array, log để debug
                    console.warn("⚠️ Không tìm thấy danh sách sản phẩm trong response. Keys có sẵn:", Object.keys(data));
                    if (data.data && typeof data.data === 'object') {
                        console.warn("⚠️ data.data keys:", Object.keys(data.data));
                    }
                    // Thử xem data có phải là object chứa thông tin sản phẩm không
                    if (data.id || data.productId || data._id) {
                        // Có thể là single product object
                        products = [data];
                        console.log("✅ Nhận được single product object");
                    }
                }
            } else {
                console.warn("⚠️ Response không phải array hoặc object:", data);
            }

            // Transform products
            // Xử lý format: items có productId là object nested
            const enrichedProducts = products.map(item => {
                // Nếu item có productId là object (nested structure)
                const product = item.productId || item;

                return {
                    id: item.id || product._id || product.id || item.productId?._id || item.productId?.id,
                    productId: item.productId?._id || item.productId?.id || product._id || product.id || item.id,
                    title: item.productName || product.name || product.title || item.title || item.name || 'Sản phẩm',
                    name: item.productName || product.name || product.title || item.title || item.name || 'Sản phẩm',
                    price: typeof item.productPrice === 'number'
                        ? item.productPrice
                        : typeof product.price === 'number'
                            ? product.price
                            : typeof item.price === 'number'
                                ? item.price
                                : parseFloat(item.productPrice || product.price || item.price) || 0,
                    quantity: item.quantity || 1,
                    thumbnail: item.productImage || product.image || item.thumbnail || item.image || item.img || '/V1.jpg',
                    image: item.productImage || product.image || item.image || item.thumbnail || item.img || '/V1.jpg',
                    brand: product.brand || item.brand || "Book Store",
                    category: product.category || item.category || "Books",
                    total: (typeof item.productPrice === 'number' ? item.productPrice : typeof product.price === 'number' ? product.price : parseFloat(item.productPrice || product.price) || 0) * (item.quantity || 1)
                };
            });

            console.log("✅ Số sản phẩm sau khi transform:", enrichedProducts.length);
            console.log("✅ Danh sách sản phẩm:", enrichedProducts);

            setCartItems(enrichedProducts);
            setCartData(cartInfo || { id: 'cart', totalItems: enrichedProducts.length });

        } catch (err) {
            console.error("❌ Lỗi khi gọi API giỏ hàng:", err);
            setError(`Không thể tải giỏ hàng: ${err.message || 'Lỗi không xác định'}`);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        setUpdatingItems(prev => new Set(prev).add(itemId));

        try {
            const response = await fetch(`${API_CONFIG.CART_API}/${itemId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                // Refresh giỏ hàng
                await fetchCartFromAPI();
            } else {
                throw new Error('Không thể cập nhật số lượng');
            }
        } catch (err) {
            console.error('❌ Lỗi khi cập nhật số lượng:', err);
            alert('Không thể cập nhật số lượng. Vui lòng thử lại!');
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = async (itemId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            return;
        }

        setUpdatingItems(prev => new Set(prev).add(itemId));

        try {
            const response = await fetch(`${API_CONFIG.CART_API}/${itemId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(false)
            });

            if (response.ok) {
                await fetchCartFromAPI();
            } else {
                throw new Error('Không thể xóa sản phẩm');
            }
        } catch (err) {
            console.error('❌ Lỗi khi xóa sản phẩm:', err);
            alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    useEffect(() => {
        // Fetch ngay khi component mount
        // Thêm delay nhỏ nếu vừa navigate từ ProductPage2
        const delay = location.state?.fromProductPage ? 500 : 0;

        setTimeout(() => {
            fetchCartFromAPI();
        }, delay);

        const handleCartUpdate = () => {
            console.log('🔄 Event cartUpdated được trigger, đang fetch lại giỏ hàng...');
            // Thêm delay nhỏ để đảm bảo API đã cập nhật
            setTimeout(() => {
                fetchCartFromAPI();
            }, 300);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Thêm listener cho focus event để refresh khi quay lại tab
        const handleFocus = () => {
            console.log('👁️ Tab được focus, kiểm tra lại giỏ hàng...');
            fetchCartFromAPI();
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('focus', handleFocus);
        };
    }, [location]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    {error.includes('đăng nhập') && (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Đăng nhập ngay
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    // Empty state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="text-gray-400 text-7xl mb-6">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn</h2>
                    <p className="text-gray-500 text-lg mb-2">Giỏ hàng của bạn đang trống!</p>
                    <p className="text-gray-400 mb-8">Hãy thêm một số sản phẩm để bắt đầu mua sắm.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
                    <p className="text-gray-600">Bạn có {totalItems} sản phẩm trong giỏ hàng</p>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Danh sách sản phẩm */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => {
                                    const isUpdating = updatingItems.has(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-6 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Hình ảnh */}
                                                <div className="flex-shrink-0">
                                                    <div className="relative w-32 h-40 sm:w-24 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/V1.jpg';
                                                            }}
                                                        />
                                                        {isUpdating && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Thông tin sản phẩm */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {item.brand} • {item.category}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            disabled={isUpdating}
                                                            className="ml-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                            title="Xóa sản phẩm"
                                                        >
                                                            <i className="fa-solid fa-trash text-lg"></i>
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        {/* Giá */}
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        </div>

                                                        {/* Số lượng */}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm text-gray-600">Số lượng:</span>
                                                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={isUpdating || item.quantity <= 1}
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <i className="fa-solid fa-minus text-xs"></i>
                                                                </button>
                                                                <span className="px-4 py-1 min-w-[3rem] text-center font-semibold">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={isUpdating}
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <i className="fa-solid fa-plus text-xs"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Tổng tiền sản phẩm */}
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">Thành tiền</p>
                                                            <p className="text-xl font-bold text-gray-900">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tổng kết */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng kết đơn hàng</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-4"
                            >
                                <i className="fa-solid fa-credit-card mr-2"></i>
                                Thanh toán
                            </button>

                            <button
                                onClick={() => navigate('/home')}
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Tiếp tục mua sắm
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <i className="fa-solid fa-shield-halved text-green-600"></i>
                                    <span>Bảo mật thanh toán</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <i className="fa-solid fa-truck-fast text-green-600"></i>
                                    <span>Giao hàng miễn phí</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="fa-solid fa-rotate-left text-green-600"></i>
                                    <span>Đổi trả trong 7 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
