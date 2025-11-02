import React, { useEffect, useState } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);     // Danh sách sản phẩm trong giỏ hàng
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null);     // Trạng thái lỗi
    const [cartData, setCartData] = useState(null); // Dữ liệu giỏ hàng từ API

    // Dữ liệu sách local để map thông tin
    const booksData = [
        { id: 1, name: "Sapiens - Lược Sử Loài Người", price: "95.400đ", img: "/V1.jpg", author: "Yuval Noah Harari" },
        { id: 2, name: "Homo Deus - Lược Sử Tương Lai", price: "89.000đ", img: "/V2.webp", author: "Yuval Noah Harari" },
        { id: 3, name: "21 Bài Học Cho Thế Kỷ 21", price: "75.000đ", img: "/V3.webp", author: "Yuval Noah Harari" },
        { id: 4, name: "Atomic Habits - Thói Quen Nguyên Tử", price: "82.000đ", img: "/V4.jpg", author: "James Clear" }
    ];

    useEffect(() => {
        const loadCart = () => {
            try {
                // Ưu tiên đọc từ localStorage vì API dummyjson.com không persist
                const localCartData = localStorage.getItem('localCart');
                
                if (localCartData) {
                    const cart = JSON.parse(localCartData);
                    console.log("📦 Giỏ hàng từ localStorage:", cart);
                    
                    setCartData(cart);
                    
                    // Sản phẩm đã có đầy đủ thông tin từ khi add vào giỏ hàng
                    // Chỉ cần đảm bảo các field cần thiết có sẵn
                    const enrichedProducts = cart.products.map(product => {
                        // Nếu đã có đầy đủ thông tin, giữ nguyên
                        if (product.title && product.price && product.thumbnail) {
                            return product;
                        }
                        
                        // Fallback: Nếu thiếu thông tin, map từ booksData
                        const bookInfo = booksData.find(book => book.id === product.id);
                        if (bookInfo) {
                            return {
                                ...product,
                                title: product.title || bookInfo.name,
                                price: product.price || parseFloat(bookInfo.price.replace(/[^\d]/g, '')) / 100,
                                thumbnail: product.thumbnail || bookInfo.img,
                                brand: product.brand || "Book Store",
                                category: product.category || "Books",
                                total: product.total || (product.price * product.quantity)
                            };
                        }
                        return product;
                    });
                    
                    setCartItems(enrichedProducts);
                } else {
                    // Nếu không có local cart, thử lấy từ API
                    fetchCartFromAPI();
                }
            } catch (err) {
                console.error("❌ Lỗi khi đọc giỏ hàng:", err);
                setError("Không thể tải giỏ hàng!");
            } finally {
                setLoading(false);
            }
        };

        const fetchCartFromAPI = async () => {
            try {
                const response = await fetch('https://dummyjson.com/carts/user/1');
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("📦 Giỏ hàng user từ API:", data);
                    
                    if (data.carts && data.carts.length > 0) {
                        const cart = data.carts[0];
                        setCartData(cart);
                        
                        const enrichedProducts = cart.products.map(product => {
                            if (product.title && product.price && product.thumbnail) {
                                return product;
                            }
                            
                            const bookInfo = booksData.find(book => book.id === product.id);
                            if (bookInfo) {
                                return {
                                    ...product,
                                    title: bookInfo.name,
                                    price: parseFloat(bookInfo.price.replace(/[^\d]/g, '')) / 100,
                                    thumbnail: bookInfo.img,
                                    brand: "Book Store",
                                    category: "Books"
                                };
                            }
                            
                            return product;
                        });
                        
                        setCartItems(enrichedProducts);
                    } else {
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
            } catch (err) {
                console.error("❌ Lỗi khi gọi API giỏ hàng:", err);
                setError("Không thể tải giỏ hàng!");
            } finally {
                setLoading(false);
            }
        };

        loadCart();

        // Lắng nghe custom event để refresh
        const handleCartUpdate = () => {
            loadCart();
        };

        // Thêm event listener
        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    // Trạng thái loading
    if (loading) {
        return <p className="text-center text-gray-500 mt-8">Đang tải dữ liệu...</p>;
    }

    // Trạng thái lỗi
    if (error) {
        return <p className="text-center text-red-500 mt-8">{error}</p>;
    }

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    // Hiển thị danh sách sản phẩm trong giỏ hàng
    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                🛒 Giỏ hàng của bạn
            </h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống!</p>
                    <p className="text-gray-400">Hãy thêm một số sản phẩm để bắt đầu mua sắm.</p>
                </div>
            ) : (
                <>
                    {/* Thông tin giỏ hàng */}
                    {cartData && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">ID Giỏ hàng: {cartData.id}</p>
                                    <p className="text-sm text-gray-600">Tổng số sản phẩm: {cartItems.length}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-800">
                                        Tổng tiền: ${totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danh sách sản phẩm */}
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-xl p-6 shadow hover:shadow-md transition duration-200 bg-white"
                            >
                                <div className="flex items-center space-x-6">
                                    {/* Hình ảnh sản phẩm */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.thumbnail || "https://via.placeholder.com/150"}
                                            alt={item.title}
                                            className="w-24 h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                    
                                    {/* Thông tin sản phẩm */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                            {item.title}
                                        </h3>
                            <p className="text-gray-600 text-sm mb-2">
                                            Thương hiệu: {item.brand || "Không rõ"}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-2">
                                            Danh mục: {item.category || "Không rõ"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-800 font-semibold">
                                                    Giá: ${item.price}
                                                </span>
                                                <span className="text-gray-600">
                                                    Số lượng: {item.quantity}
                                                </span>
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>

                    {/* Tổng kết */}
                    <div className="mt-8 bg-blue-50 rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">Tổng cộng:</h3>
                            <span className="text-2xl font-bold text-blue-600">
                                ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
