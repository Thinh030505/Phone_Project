import { Breadcrumb, Button } from 'antd';
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_CONFIG, getAuthToken, getAuthHeaders } from '../config/api';

const ProductPage2 = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('id');

    const [currentProduct, setCurrentProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Format price helper
    const formatPrice = (price) => {
        if (!price) return '0 đ';
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
        return price;
    };

    // Load sản phẩm theo ID từ API
    useEffect(() => {
        const loadProduct = async () => {
            if (!productId) {
                setError('Không có ID sản phẩm');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const id = String(productId).trim(); // Convert và trim để đảm bảo so sánh chính xác

                console.log('🔍 Đang tìm sản phẩm với ID từ URL:', id);
                console.log('🔍 Type của ID:', typeof id);

                // Fetch tất cả sản phẩm từ API
                const response = await fetch(API_CONFIG.PRODUCTS_API);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                let products = [];

                // Xử lý nhiều format response
                if (Array.isArray(data)) {
                    products = data;
                } else if (data.data && Array.isArray(data.data)) {
                    products = data.data;
                } else if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else if (data.result && Array.isArray(data.result)) {
                    products = data.result;
                }

                console.log('📦 Tổng số sản phẩm từ API:', products.length);
                console.log('🔍 Danh sách ID từ API:', products.map(p => ({ id: p.id, _id: p._id, title: p.title || p.name })));

                // Tìm sản phẩm theo ID (hỗ trợ cả id và _id, string và number)
                // So sánh chính xác hơn: convert cả hai về string và number để đảm bảo match
                const apiProduct = products.find(p => {
                    const pId = p.id || p._id;
                    if (!pId) return false;

                    // So sánh string
                    const pIdStr = String(pId).trim();
                    const searchIdStr = String(id).trim();

                    // So sánh number (nếu cả hai đều là số hợp lệ)
                    const pIdNum = Number(pId);
                    const searchIdNum = Number(id);

                    const matchString = pIdStr === searchIdStr;
                    const matchNumber = !isNaN(pIdNum) && !isNaN(searchIdNum) && pIdNum === searchIdNum;

                    return matchString || matchNumber;
                });

                if (!apiProduct) {
                    console.error('❌ Không tìm thấy sản phẩm với ID:', id);
                    console.error('📋 Danh sách ID có sẵn:', products.map(p => p.id || p._id));
                    throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
                }

                console.log('✅ Tìm thấy sản phẩm từ API:', {
                    id: apiProduct.id || apiProduct._id,
                    title: apiProduct.title || apiProduct.name,
                    image: apiProduct.image || apiProduct.img || apiProduct.cover
                });

                // Transform API product thành format của ProductPage2
                const transformedProduct = {
                    id: apiProduct.id || apiProduct._id || id,
                    name: apiProduct.title || apiProduct.name || 'Sản phẩm không có tên',
                    price: formatPrice(apiProduct.price),
                    originalPrice: apiProduct.originalPrice
                        ? formatPrice(apiProduct.originalPrice)
                        : apiProduct.price
                            ? formatPrice(typeof apiProduct.price === 'number' ? apiProduct.price * 1.25 : parseFloat(apiProduct.price) * 1.25)
                            : '0 đ',
                    img: apiProduct.image || apiProduct.img || apiProduct.cover || '/V1.jpg',
                    images: apiProduct.images && Array.isArray(apiProduct.images) && apiProduct.images.length > 0
                        ? apiProduct.images
                        : [apiProduct.image || apiProduct.img || apiProduct.cover || '/V1.jpg'],
                    description: apiProduct.description || apiProduct.desc || 'Mô tả sản phẩm',
                    author: apiProduct.author || apiProduct.brand || 'Tác giả',
                    publisher: apiProduct.publisher || apiProduct.publisherName || 'NXB',
                    pages: apiProduct.pages || apiProduct.pageCount || 0,
                    language: apiProduct.language || 'Tiếng Việt',
                    format: apiProduct.format || 'Bìa mềm',
                    dimensions: apiProduct.dimensions || apiProduct.size || '13 x 20.5 cm',
                    weight: apiProduct.weight || '0g',
                    publicationYear: apiProduct.publicationYear || apiProduct.year || new Date().getFullYear(),
                    rating: apiProduct.rating || 4.5,
                    reviews: apiProduct.reviews || apiProduct.reviewCount || 0
                };

                setCurrentProduct(transformedProduct);

                // Lấy 4 sản phẩm liên quan (khác với sản phẩm hiện tại)
                const related = products
                    .filter(p => {
                        const pId = p.id || p._id;
                        if (!pId) return false;

                        // So sánh chính xác như khi tìm sản phẩm chính
                        const pIdStr = String(pId).trim();
                        const currentIdStr = String(id).trim();
                        const pIdNum = Number(pId);
                        const currentIdNum = Number(id);

                        // Loại bỏ sản phẩm hiện tại
                        const isCurrentProduct = (pIdStr === currentIdStr) ||
                            (!isNaN(pIdNum) && !isNaN(currentIdNum) && pIdNum === currentIdNum);

                        return !isCurrentProduct;
                    })
                    .slice(0, 4)
                    .map(p => ({
                        id: p.id || p._id,
                        title: p.title || p.name || 'Sản phẩm',
                        price: formatPrice(p.price),
                        img: p.image || p.img || p.cover || '/V1.jpg',
                        liked: false
                    }));

                setRelatedProducts(related);
                console.log('📚 Sản phẩm liên quan:', related.length);

            } catch (err) {
                console.error('❌ Lỗi khi load sản phẩm:', err);
                setError(err.message || 'Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    // Helper: đọc giỏ hàng từ localStorage
    const getLocalCartSafely = () => {
        try {
            const raw = localStorage.getItem('cart');
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object' && Array.isArray(parsed.products)) {
                return parsed.products;
            }
            return [];
        } catch {
            return [];
        }
    };

    // Function để thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!currentProduct) {
            setCartMessage("Không tìm thấy sản phẩm!");
            return;
        }

        setIsAddingToCart(true);
        setCartMessage("");

        try {
            // Lấy giá trị số từ price (có thể là string hoặc number)
            const priceValue = typeof currentProduct.price === 'string'
                ? parseFloat(currentProduct.price.replace(/[^\d]/g, ''))
                : currentProduct.price;

            // Chuẩn bị sản phẩm để thêm vào giỏ hàng
            const productToAdd = {
                productId: currentProduct.id,
                name: currentProduct.name,
                title: currentProduct.name,
                price: priceValue,
                quantity: 1,
                image: currentProduct.img.startsWith('http')
                    ? currentProduct.img
                    : currentProduct.img.startsWith('/')
                        ? `${window.location.origin}${currentProduct.img}`
                        : currentProduct.img,
                thumbnail: currentProduct.img.startsWith('http')
                    ? currentProduct.img
                    : currentProduct.img.startsWith('/')
                        ? `${window.location.origin}${currentProduct.img}`
                        : currentProduct.img
            };

            console.log('📤 Thêm sản phẩm vào giỏ hàng:', productToAdd);

            // Kiểm tra token trước khi gọi API
            const token = getAuthToken();
            if (!token) {
                // Redirect đến trang login với return URL
                navigate(`/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                setCartMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
                setIsAddingToCart(false);
                return;
            }

            // Gọi API backend để thêm vào giỏ hàng
            const response = await fetch(API_CONFIG.CART_API, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(productToAdd)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Response từ API giỏ hàng:', result);

            setCartMessage("Đã thêm sản phẩm vào giỏ hàng thành công! Đang chuyển đến giỏ hàng...");

            // Dispatch event để Cart component refresh
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            // Chờ một chút để đảm bảo API đã cập nhật, rồi chuyển đến trang cart
            setTimeout(() => {
                navigate('/cart', { state: { fromProductPage: true } });
                // Dispatch event một lần nữa sau khi navigate để đảm bảo Cart fetch lại
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('cartUpdated'));
                }, 500);
            }, 1000);
        } catch (error) {
            console.error('❌ Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            setCartMessage(`Có lỗi xảy ra: ${error.message || 'Không thể thêm sản phẩm vào giỏ hàng!'}`);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleRelatedProductClick = (relatedId) => {
        navigate(`/ProductPage2?id=${relatedId}`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    // Error state
    if (error || !currentProduct) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-20">
                <p className="text-red-500 text-lg mb-4">
                    {error || `Không tìm thấy sản phẩm với ID: ${productId}`}
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    // Prepare images for display
    const thumbnails = currentProduct.images.map((img, index) => ({
        id: index + 1,
        img: img
    }));
    const mainImage = [{ id: 1, img: currentProduct.img }];

    return (
        <>
            <div className="py-[44px] px-[160px]">
                <Breadcrumb
                    className="hidden md:block md:font-[300] md:text-[16px]"
                    separator=">"
                    items={[
                        { title: "Trang chủ" },
                        { title: "Sách" },
                        { title: "Chi tiết sách" },
                        { title: currentProduct.name },
                    ]}
                />
            </div>
            <div className="px-[50px] md:px-[100px] lg:px-[160px] w-full flex flex-col xl:flex-row mt-[5px] items-center gap-6">
                <div className="flex flex-col w-full xl:flex-row xl:w-[50%] justify-between">
                    {/* Thumbnail */}
                    <div className="flex w-full xl:w-[20%] mt-[30px] gap-3 order-2 xl:order-1 justify-between xl:flex-col xl:justify-start xl:pt-[100px]">
                        {thumbnails.map((item) => (
                            <div
                                key={item.id}
                                className="w-16 h-20 rounded-[10px] overflow-hidden flex-shrink-0"
                            >
                                <img
                                    src={item.img}
                                    alt={`Thumbnail ${item.id}`}
                                    className="w-[46px] h-[93px] object-contain"
                                    onError={(e) => {
                                        e.target.src = '/V1.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="mt-[45px] order-1 xl:order-2 flex justify-center xl:block">
                        {mainImage.map((item) => (
                            <div key={item.id}>
                                <img
                                    src={item.img}
                                    alt={currentProduct.name}
                                    className="w-[415px] h-[516px] object-contain"
                                    onError={(e) => {
                                        e.target.src = '/V1.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex-1 ml-[42px] px-[20px]'>
                    <h1 className="text-center text-[42px] font-[700] md:text-left md:text-[42px] lg:text-2xl">
                        {currentProduct.name}
                    </h1>
                    <div className="flex items-center gap-4 mt-[24px] mb-[16px]">
                        <span className="text-[32px] md:text-2xl font-semibold text-black">
                            {currentProduct.price}
                        </span>
                        <span className="text-gray-400 line-through">
                            {currentProduct.originalPrice}
                        </span>
                    </div>
                    <div className='flex items-center gap-[24px]'>
                        <span>Tác giả:</span>
                        <div className='flex gap-[20px] md:gap-[8px] items-center'>
                            <span className="text-[16px] font-medium">
                                {currentProduct.author}
                            </span>
                        </div>
                    </div>
                    <div className='mt-[24px]'>
                        <div className="flex items-center gap-[8px]">
                            <span className="text-[14px] text-gray-600">Nhà xuất bản:</span>
                            <span className="text-[14px] font-medium">
                                {currentProduct.publisher}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-[24px]">
                            <div className="flex items-center px-[16px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-book text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Số trang</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.pages}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-language text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Ngôn ngữ</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.language}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-file-lines text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Định dạng</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.format}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-ruler text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Kích thước</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.dimensions}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-weight text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Trọng lượng</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.weight}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-calendar text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Năm xuất bản</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct.publicationYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='leading-[1.5] text-[14px] font-[400] text-[#2C2C2C] pt-[24px]'>
                        <p className='leading-[2] tracking-[1.5px] md:tracking-[0.3px]'>
                            {currentProduct.description}
                        </p>
                    </div>
                    <div className='py-[32px] flex gap-[16px]'>
                        <button className='border px-[78px] rounded-[6px] font-[700] py-[16px]'>Thêm vào yêu thích</button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className='border px-[78px] rounded-[6px] !text-[white] bg-black font-[700] py-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>

                    {cartMessage && (
                        <div className={`mb-4 p-3 rounded-md text-center ${cartMessage.includes('thành công')
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {cartMessage}
                        </div>
                    )}
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 px-[16px] py-[12px]">
                            <button className="border-none rounded-[8px] bg-[#F6F6F6] font-[300] px-[16px] py-[16px]">
                                <i className="fa-solid fa-truck-fast"></i>
                            </button>
                            <div className="whitespace-nowrap">
                                <p className="text-[14px] text-gray-500" style={{ margin: 0, lineHeight: "16px" }}>
                                    Giao hàng miễn phí
                                </p>
                                <p className="text-[14px] font-semibold" style={{ margin: 0, lineHeight: "16px" }}>
                                    1-2 ngày
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-[16px] py-[12px]">
                            <button className="border-none rounded-[8px] bg-[#F6F6F6] px-[16px] py-[16px]">
                                <i className="fa-solid fa-store"></i>
                            </button>
                            <div className="whitespace-nowrap">
                                <p className="text-[14px] text-gray-500" style={{ margin: 0, lineHeight: "16px" }}>
                                    Còn hàng
                                </p>
                                <p className="text-[14px] font-semibold" style={{ margin: 0, lineHeight: "16px" }}>
                                    Hôm nay
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-[16px] py-[12px]">
                            <button className="border-none rounded-[8px] bg-[#F6F6F6] px-[16px] py-[16px]">
                                <i className="fa-solid fa-circle-check"></i>
                            </button>
                            <div className="whitespace-nowrap">
                                <p className="text-[14px] text-gray-500" style={{ margin: 0, lineHeight: "16px" }}>
                                    Bảo hành
                                </p>
                                <p className="text-[14px] font-semibold" style={{ margin: 0, lineHeight: "16px" }}>
                                    1 năm
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='px-[160px] py-[80px] bg-[#FAFAFA]'>
                    <div className='px-[40px] rounded-[8px] bg-[#FFFFFF] py-[48px]'>
                        <div className='font-500 text-[24px]'>
                            <p className='font-500 text-[24px] mb-[32px]'>Chi tiết sách</p>
                            <p className='font-500 text-[14px] leading-6 text-[#9D9D9D] mb-[32px]'>{currentProduct.description}</p>
                            <p className='font-500 text-[24px] mt-[32px] mb-[16px]'>Thông tin xuất bản</p>
                        </div>
                        <div>
                            <div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Tác giả</span>
                                    <span>{currentProduct.author}</span>
                                </div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Nhà xuất bản</span>
                                    <span>{currentProduct.publisher}</span>
                                </div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Số trang</span>
                                    <span>{currentProduct.pages}</span>
                                </div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Ngôn ngữ</span>
                                    <span>{currentProduct.language}</span>
                                </div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Định dạng</span>
                                    <span>{currentProduct.format}</span>
                                </div>
                                <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                    <span>Năm xuất bản</span>
                                    <span>{currentProduct.publicationYear}</span>
                                </div>
                            </div>
                            <div>
                                <p className='font-500 text-[24px] mb-[32px] pt-[40px] pb-[16px]'>Thông tin kỹ thuật</p>
                                <div>
                                    <div className='flex justify-between pb-[12px] text-[16px] border-b font-[400] border-[#CDCDCD]'>
                                        <span>Kích thước</span>
                                        <span>{currentProduct.dimensions}</span>
                                    </div>
                                    <div className='flex justify-between pb-[8px] pt-[12px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Trọng lượng</span>
                                        <span>{currentProduct.weight}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center text-[14px] font-[500]'>
                                <button className='border rounded-[8px] px-[56px] py-[12px]'>Xem thêm <i className="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-[160px] pt-[80px] pb-[32px]'>
                <div className="p-4 rounded-md">
                    <h2 className="text-[24px] font-[500] mb-[48px]">Đánh giá từ độc giả</h2>
                    <div className="flex gap-[60px]">
                        <div className="flex flex-col leading-0 items-center px-[32px] py-[42px] bg-[#FAFAFA] rounded-[25px]">
                            <p className="text-[56px] font-[500]">{currentProduct.rating}</p>
                            <p className="text-[14px]">trên {currentProduct.reviews} đánh giá</p>
                            <div className="flex gap-1 mt-2 text-[#FFB547]">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-regular fa-star-half-stroke"></i>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Xuất sắc</span>
                                <div className="flex-1 bg-gray-200 h-[24px] rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "90%" }}></div>
                                </div>
                                <span className="text-sm">100</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Tốt</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "70%" }}></div>
                                </div>
                                <span className="text-sm">11</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Trung bình</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "50%" }}></div>
                                </div>
                                <span className="text-sm">3</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Kém</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "40%" }}></div>
                                </div>
                                <span className="text-sm">8</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Rất kém</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "30%" }}></div>
                                </div>
                                <span className="text-sm">1</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-[#FAFAFA] border-[2px] rounded-[7px] px-[16px] mt-[16px] py-[16px]">
                        <input
                            type="text"
                            placeholder="Viết đánh giá của bạn..."
                            className="w-full border-none outline-none text-[14px] text-gray-500"
                        />
                    </div>
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className='px-[160px] py-[56px]'>
                    <h2 className='text-[24px] font-[500]'>Sách liên quan</h2>
                    <div className="grid grid-cols-4 items-center gap-[16px] mt-[32px]">
                        {relatedProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                                onClick={() => handleRelatedProductClick(item.id)}
                            >
                                <div className="relative px-[54px]">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-[160px] h-[160px] object-contain"
                                        onError={(e) => {
                                            e.target.src = '/V1.jpg';
                                        }}
                                    />
                                    <span className="absolute top-[-35px] right-9">
                                        {item.liked ? (
                                            <i className="fa-solid fa-heart text-red-500"></i>
                                        ) : (
                                            <i className="fa-regular fa-heart text-gray-400"></i>
                                        )}
                                    </span>
                                </div>
                                <div className="mb-[24px]">
                                    <p className="pt-[16px] font-[500] text-center px-[16px]">{item.title}</p>
                                    <p className="font-[500] text-[24px] text-center">{item.price}</p>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            className="bg-black px-[62px] py-[16px] rounded-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRelatedProductClick(item.id);
                                            }}
                                        >
                                            <span className="text-[#FFFFFF]">Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductPage2;

