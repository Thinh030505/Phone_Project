import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/api';

import { Tabs } from 'antd';
const Home = () => {
    const navigate = useNavigate();
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1'); // State để track tab đang active

    const handleProductClick = (productId) => {
        console.log('🖱️ Click vào sản phẩm với ID:', productId);
        const url = `/ProductPage2?id=${productId}`;
        console.log('🔗 Navigate đến:', url);
        navigate(url);
    };

    // Fetch products from API
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch(API_CONFIG.PRODUCTS_API, { signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // Xử lý nhiều format response
                let list = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data.data && Array.isArray(data.data)) {
                    list = data.data;
                } else if (data.products && Array.isArray(data.products)) {
                    list = data.products;
                } else if (data.result && Array.isArray(data.result)) {
                    list = data.result;
                }

                setApiProducts(list);
                console.log('✅ Sản phẩm từ API đã load:', list.length, 'sản phẩm');
                console.log('📦 Dữ liệu sản phẩm:', list);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.warn('⚠️ Không thể load sản phẩm từ API, sử dụng dữ liệu mặc định:', err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
        return () => controller.abort();
    }, []);

    // Helper function để format giá
    const formatPrice = (price) => {
        if (!price) return "0đ";
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN') + 'đ';
        }
        if (typeof price === 'string') {
            if (price.includes('đ') || price.includes('$')) {
                return price;
            }
            const numPrice = parseFloat(price.replace(/[^\d]/g, ''));
            if (!isNaN(numPrice)) {
                return numPrice.toLocaleString('vi-VN') + 'đ';
            }
        }
        return price;
    };

    // Transform API data to match existing format
    const transformApiToProduct = (apiProduct, index) => {
        const productId = apiProduct.id || apiProduct._id || index + 1;
        const productName = apiProduct.title || apiProduct.name || 'Sản phẩm không có tên';
        const productImage = apiProduct.image || apiProduct.img || apiProduct.cover || '/V1.jpg';
        const productPrice = apiProduct.price || apiProduct.priceUsd || 0;
        const productAuthor = apiProduct.author || apiProduct.brand || '';

        return {
            id: productId,
            name: productName,
            title: productName,
            price: formatPrice(productPrice),
            img: productImage,
            image: productImage,
            like: false,
            liked: "false",
            author: productAuthor,
            desc: apiProduct.description || apiProduct.desc || 'Sách hay, đáng đọc'
        };
    };

    // Hero slides data - Lấy từ API
    const defaultHeroSlides = [
        {
            id: 1,
            subtitle: "Tri Thức. Vô Hạn.",
            title: "Sách Hay",
            description: "Khám phá thế giới tri thức qua những cuốn sách tuyệt vời",
            image: "/V1.jpg",
            bookTitle: "Sapiens - Lược Sử Loài Người",
            author: "Yuval Noah Harari"
        },
        {
            id: 2,
            subtitle: "Kiến Thức. Sáng Tạo.",
            title: "Homo Deus",
            description: "Dự đoán về tương lai của nhân loại trong kỷ nguyên công nghệ",
            image: "/V2.webp",
            bookTitle: "Homo Deus - Lược Sử Tương Lai",
            author: "Yuval Noah Harari"
        },
        {
            id: 3,
            subtitle: "Học Hỏi. Phát Triển.",
            title: "21 Bài Học",
            description: "Những bài học quan trọng để đối mặt với thách thức hiện đại",
            image: "/V3.webp",
            bookTitle: "21 Bài Học Cho Thế Kỷ 21",
            author: "Yuval Noah Harari"
        },
        {
            id: 4,
            subtitle: "Thành Công. Thói Quen.",
            title: "Atomic Habits",
            description: "Xây dựng thói quen tốt để tạo ra những thay đổi lớn",
            image: "/V4.jpg",
            bookTitle: "Atomic Habits - Thói Quen Nguyên Tử",
            author: "James Clear"
        }
    ];

    // Tạo hero slides từ API
    const heroSlides = apiProducts.length >= 4
        ? apiProducts.slice(0, 4).map((p, idx) => {
            const productId = p.id || p._id || idx + 1;
            const productName = p.title || p.name || 'Sách Hay';
            const productImage = p.image || p.img || p.cover || '/V1.jpg';
            const productAuthor = p.author || p.brand || 'Tác giả';
            const productDesc = p.description || p.desc || 'Khám phá thế giới tri thức qua những cuốn sách tuyệt vời';

            // Tách tên sách thành title và titleBold
            const nameParts = productName.split(' - ');
            const title = nameParts[0] || productName.substring(0, 15);
            const subtitles = ["Tri Thức. Vô Hạn.", "Kiến Thức. Sáng Tạo.", "Học Hỏi. Phát Triển.", "Thành Công. Thói Quen."];

            return {
                id: productId,
                subtitle: subtitles[idx] || "Sách Hay",
                title: title,
                description: productDesc,
                image: productImage,
                bookTitle: productName,
                author: productAuthor
            };
        })
        : defaultHeroSlides;

    // Categories - Tạo từ API nếu có category field, nếu không dùng default
    const defaultCategories = [
        { id: 1, name: "Sách Kinh Tế", img: "/V1.jpg" },
        { id: 2, name: "Sách Lịch Sử", img: "/V2.webp" },
        { id: 3, name: "Sách Tâm Lý", img: "/V3.webp" },
        { id: 4, name: "Sách Kỹ Năng", img: "/V4.jpg" },
        { id: 5, name: "Sách Triết Học", img: "/V5.png" },
        { id: 6, name: "Sách Bestseller", img: "/V1.jpg" },
    ];

    // Tạo categories từ API (lấy unique categories từ products)
    const categories = apiProducts.length > 0
        ? (() => {
            const categoryMap = new Map();
            apiProducts.forEach((p, idx) => {
                const categoryName = p.category || p.type || `Danh mục ${idx + 1}`;
                const categoryImg = p.image || p.img || p.cover || '/V1.jpg';
                if (!categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, {
                        id: categoryMap.size + 1,
                        name: categoryName,
                        img: categoryImg
                    });
                }
            });
            const apiCategories = Array.from(categoryMap.values()).slice(0, 6);
            // Nếu API có ít hơn 6 categories, bổ sung từ default
            while (apiCategories.length < 6) {
                const defaultIdx = apiCategories.length;
                apiCategories.push(defaultCategories[defaultIdx] || defaultCategories[0]);
            }
            return apiCategories;
        })()
        : defaultCategories;

    const onChange = (key) => {
        console.log('Tab changed to:', key);
        setActiveTab(key);
    };
    const items = [
        {
            key: '1',
            label: 'New Arrival'
        },
        {
            key: '2',
            label: 'Bestseller'

        },
        {
            key: '3',
            label: 'Featured Product'
        },
    ];
    // layout col-6 - Sách (sử dụng API data nếu có, fallback về hardcode)
    const defaultProduct = [
        {
            id: 1,
            name: "Sapiens - Lược Sử Loài Người",
            price: "95.400đ",
            img: "/V1.jpg",
            like: true,
        },
        {
            id: 2,
            name: "Homo Deus - Lược Sử Tương Lai",
            price: "89.000đ",
            img: "/V2.webp",
            like: true,
        },
        {
            id: 3,
            name: "21 Bài Học Cho Thế Kỷ 21",
            price: "75.000đ",
            img: "/V3.webp",
            like: false,
        },
        {
            id: 4,
            name: "Atomic Habits - Thói Quen Nguyên Tử",
            price: "82.000đ",
            img: "/V4.jpg",
            like: false,
        },
        {
            id: 5,
            name: "Deep Work - Làm Việc Sâu",
            price: "78.000đ",
            img: "/V5.png",
            like: false,
        },
        {
            id: 6,
            name: "The Lean Startup - Khởi Nghiệp Tinh Gọn",
            price: "88.000đ",
            img: "/V1.jpg",
            like: false,
        },
        {
            id: 7,
            name: "Thinking, Fast and Slow - Tư Duy Nhanh và Chậm",
            price: "95.000đ",
            img: "/V2.webp",
            like: false,
        },
        {
            id: 8,
            name: "The Power of Now - Sức Mạnh Của Hiện Tại",
            price: "72.000đ",
            img: "/V3.webp",
            like: false,
        }
    ];

    // Filter sản phẩm theo tab đang active
    const getFilteredProducts = () => {
        if (apiProducts.length === 0) {
            return defaultProduct;
        }

        let filtered = [];

        switch (activeTab) {
            case '1': // New Arrival - Lấy 8 sản phẩm đầu tiên (mới nhất)
                filtered = apiProducts.slice(0, 8);
                break;
            case '2': // Bestseller - Lấy sản phẩm có rating cao hoặc sản phẩm hot
                // Nếu có field rating, sort theo rating, nếu không lấy 8 sản phẩm tiếp theo
                filtered = apiProducts
                    .filter(p => p.rating || p.isBestseller || p.hot || p.bestseller)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 8);
                // Nếu không có sản phẩm bestseller, lấy 8 sản phẩm từ vị trí 4-12
                if (filtered.length === 0) {
                    filtered = apiProducts.slice(4, 12);
                }
                break;
            case '3': // Featured Product - Lấy sản phẩm featured hoặc nổi bật
                filtered = apiProducts
                    .filter(p => p.featured || p.isFeatured || p.highlight)
                    .slice(0, 8);
                // Nếu không có sản phẩm featured, lấy 8 sản phẩm từ vị trí 8-16
                if (filtered.length === 0) {
                    filtered = apiProducts.slice(8, 16);
                }
                break;
            default:
                filtered = apiProducts.slice(0, 8);
        }

        // Transform và bổ sung nếu cần
        const transformed = filtered.map((p, idx) => {
            const transformedItem = transformApiToProduct(p, idx);
            return {
                ...transformedItem,
                like: idx < 2 // 2 sản phẩm đầu tiên có like = true
            };
        });

        // Nếu ít hơn 8, bổ sung từ default
        while (transformed.length < 8 && transformed.length < defaultProduct.length) {
            const defaultIdx = transformed.length;
            transformed.push(defaultProduct[defaultIdx]);
        }

        return transformed;
    };

    // Sử dụng filtered products
    const product = getFilteredProducts();
    const defaultProduct2 = [
        {
            id: 1,
            title: "Sách Bestseller",
            desc: "Những cuốn sách được yêu thích nhất với nội dung sâu sắc và ý nghĩa.",
            img: "/V1.jpg",
            style: "light"
        },
        {
            id: 2,
            title: "Sách Kinh Tế",
            desc: "Khám phá thế giới kinh tế qua những tác phẩm kinh điển và hiện đại.",
            img: "/V2.webp",
            style: "light"
        },
        {
            id: 3,
            title: "Sách Lịch Sử",
            desc: "Tìm hiểu về quá khứ để hiểu rõ hơn về hiện tại và tương lai.",
            img: "/V4.jpg",
            style: "muted"
        },
        {
            id: 4,
            title: "Sách Tâm Lý",
            desc: "Hiểu rõ bản thân và người khác qua những cuốn sách tâm lý học.",
            img: "/V5.png",
            style: "dark"
        }
    ];

    // Sử dụng API data cho product2 (featured products)
    const product2 = apiProducts.length > 0
        ? (() => {
            const apiItems = apiProducts.slice(0, 4).map((p, idx) => {
                const transformed = transformApiToProduct(p, idx);
                const styles = ["light", "light", "muted", "dark"];
                return {
                    ...transformed,
                    style: styles[idx] || "light"
                };
            });
            // Nếu API trả về ít hơn 4, bổ sung từ default
            while (apiItems.length < 4) {
                const defaultIdx = apiItems.length;
                apiItems.push(defaultProduct2[defaultIdx] || defaultProduct2[0]);
            }
            return apiItems;
        })()
        : defaultProduct2;
    const defaultProduct3 = [
        {
            id: 1,
            title: "Sapiens - Lược Sử Loài Người",
            price: "95.400đ",
            img: "/V1.jpg",
            liked: "false"
        },
        {
            id: 2,
            title: "Homo Deus - Lược Sử Tương Lai",
            price: "89.000đ",
            img: "/V2.webp",
            liked: "false"
        },
        {
            id: 3,
            title: "21 Bài Học Cho Thế Kỷ 21",
            price: "75.000đ",
            img: "/V3.webp",
            liked: "false"
        },
        {
            id: 4,
            title: "Atomic Habits - Thói Quen Nguyên Tử",
            price: "82.000đ",
            img: "/V4.jpg",
            liked: "false"
        }
    ];

    // Sử dụng API data cho product3 (discount products)
    const product3 = apiProducts.length > 0
        ? (() => {
            const apiItems = apiProducts.slice(0, 4).map((p, idx) => {
                const transformed = transformApiToProduct(p, idx);
                return {
                    ...transformed,
                    liked: "false"
                };
            });
            // Nếu API trả về ít hơn 4, bổ sung từ default
            while (apiItems.length < 4) {
                const defaultIdx = apiItems.length;
                apiItems.push(defaultProduct3[defaultIdx] || defaultProduct3[0]);
            }
            return apiItems;
        })()
        : defaultProduct3;

    // Featured Books Section - Lấy 4 sản phẩm từ API
    const defaultFeaturedBooks = [
        {
            id: 1,
            title: "Sách Kinh Tế",
            titleBold: "Kinh Tế",
            description: "Khám phá những nguyên lý kinh tế học, tài chính và đầu tư qua những cuốn sách được đánh giá cao nhất. Từ lý thuyết đến thực hành, nâng cao kiến thức tài chính của bạn.",
            image: "/V1.jpg",
            bgGradient: "from-amber-50 to-orange-50",
            textColor: "text-gray-800",
            titleColor: "text-orange-600",
            buttonStyle: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:!from-orange-600 hover:!to-orange-700",
            buttonText: "Buy Now",
            layout: "normal", // normal hoặc reverse
            category: "kinh-te"
        },
        {
            id: 2,
            title: "Sách",
            titleBold: "Lịch Sử",
            description: "Tìm hiểu về quá khứ để hiểu rõ hơn về hiện tại và tương lai. Những câu chuyện lịch sử hấp dẫn, các sự kiện quan trọng và bài học từ quá khứ.",
            image: "/V2.webp",
            bgGradient: "from-slate-50 to-blue-50",
            textColor: "text-gray-800",
            titleColor: "text-blue-600",
            buttonStyle: "border-2 border-blue-600 text-blue-600 hover:!bg-blue-600 hover:!text-white",
            buttonText: "Buy Now",
            layout: "reverse",
            category: "lich-su"
        },
        {
            id: 3,
            title: "Sách",
            titleBold: "Tâm Lý",
            description: "Hiểu rõ bản thân và người khác qua những cuốn sách tâm lý học xuất sắc. Phát triển kỹ năng giao tiếp và quản lý cảm xúc.",
            image: "/V3.webp",
            bgGradient: "from-pink-50 to-purple-50",
            textColor: "text-gray-800",
            titleColor: "text-purple-600",
            buttonStyle: "border-2 border-purple-600 text-purple-600 hover:!bg-purple-600 hover:!text-white",
            buttonText: "Buy Now",
            layout: "normal",
            category: "tam-ly"
        },
        {
            id: 4,
            title: "Sách",
            titleBold: "Bestseller",
            description: "Những cuốn sách được yêu thích nhất với nội dung sâu sắc và ý nghĩa. Được hàng triệu độc giả trên toàn thế giới đánh giá cao.",
            image: "/V4.jpg",
            bgGradient: "from-gray-900 to-black",
            textColor: "text-white",
            titleColor: "text-yellow-400",
            buttonStyle: "border-2 border-yellow-400 text-yellow-400 hover:!bg-yellow-400 hover:!text-gray-900",
            buttonText: "Buy Now",
            layout: "normal",
            category: "bestseller",
            hasBadge: true
        }
    ];

    // Tạo featured books từ API (luôn lấy 4 sản phẩm)
    const featuredBooks = apiProducts.length >= 4
        ? apiProducts.slice(0, 4).map((p, idx) => {
            const productId = p.id || p._id || idx + 1;
            const productName = p.title || p.name || 'Sách Hay';
            const productImage = p.image || p.img || p.cover || '/V1.jpg';
            const productDesc = p.description || p.desc || 'Khám phá thế giới tri thức qua những cuốn sách tuyệt vời';
            const productCategory = p.category || p.type || `danh-muc-${idx + 1}`;

            // Tách tên sách
            const nameParts = productName.split(' - ');
            const title = nameParts[0] || productName.substring(0, 10);
            const titleBold = nameParts[1] || productName.substring(10) || 'Sách';

            // Style config cho từng vị trí
            const styles = [
                {
                    bgGradient: "from-amber-50 to-orange-50",
                    textColor: "text-gray-800",
                    titleColor: "text-orange-600",
                    buttonStyle: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:!from-orange-600 hover:!to-orange-700",
                    layout: "normal"
                },
                {
                    bgGradient: "from-slate-50 to-blue-50",
                    textColor: "text-gray-800",
                    titleColor: "text-blue-600",
                    buttonStyle: "border-2 border-blue-600 text-blue-600 hover:!bg-blue-600 hover:!text-white",
                    layout: "reverse"
                },
                {
                    bgGradient: "from-pink-50 to-purple-50",
                    textColor: "text-gray-800",
                    titleColor: "text-purple-600",
                    buttonStyle: "border-2 border-purple-600 text-purple-600 hover:!bg-purple-600 hover:!text-white",
                    layout: "normal"
                },
                {
                    bgGradient: "from-gray-900 to-black",
                    textColor: "text-white",
                    titleColor: "text-yellow-400",
                    buttonStyle: "border-2 border-yellow-400 text-yellow-400 hover:!bg-yellow-400 hover:!text-gray-900",
                    layout: "normal",
                    hasBadge: true
                }
            ];

            const style = styles[idx] || styles[0];

            return {
                id: productId,
                title: title,
                description: productDesc,
                image: productImage,
                bgGradient: style.bgGradient,
                textColor: style.textColor,
                titleColor: style.titleColor,
                buttonStyle: style.buttonStyle,
                buttonText: "Buy Now",
                layout: style.layout,
                category: productCategory,
                hasBadge: style.hasBadge || false
            };
        })
        : defaultFeaturedBooks;
    return (
        <>
            {/* Hero Section - Simple & Clean */}
            <div className="relative w-full bg-white py-12 md:py-20">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    speed={600}
                    className="hero-swiper-simple"
                >
                    {heroSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="container mx-auto px-5 md:px-12 lg:px-20">
                                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
                                    {/* Left Content */}
                                    <div className="flex flex-col justify-center space-y-5 text-center lg:text-left order-2 lg:order-1">
                                        <p className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-wider">
                                            {slide.subtitle}
                                        </p>

                                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                            {slide.title}
                                        </h1>

                                        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                                            {slide.description}
                                        </p>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-md mx-auto lg:mx-0">
                                            <p className="text-gray-900 font-semibold text-lg mb-1">
                                                {slide.bookTitle}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📖 {slide.author}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                            <button
                                                onClick={() => handleProductClick(slide.id)}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                onClick={() => handleProductClick(slide.id)}
                                                className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-base hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Image */}
                                    <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                                        <div className="relative w-full max-w-sm lg:max-w-md cursor-pointer" onClick={() => handleProductClick(slide.id)}>
                                            <img
                                                src={slide.image}
                                                alt={slide.bookTitle}
                                                className="w-full h-auto object-contain rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Featured Books Section - Modern Grid Layout - Lấy từ API */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {featuredBooks.map((book, idx) => {
                    const isReverse = book.layout === "reverse";
                    const isLarge = idx < 2; // 2 phần đầu lớn hơn

                    return (
                        <div
                            key={book.id}
                            className={`bg-gradient-to-br ${book.bgGradient} ${book.textColor} group hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                            onClick={() => handleProductClick(book.id)}
                        >
                            <div className={`flex ${isReverse ? 'flex-col-reverse md:flex-row' : 'flex-col md:flex-row'} items-center h-full ${!isLarge ? 'min-h-[350px]' : ''}`}>
                                {/* Image Section */}
                                <div className={`w-full md:w-1/2 flex ${isReverse ? 'justify-center md:justify-end' : 'justify-center'} p-8 md:p-12`}>
                                    <div className="relative cursor-pointer" onClick={() => handleProductClick(book.id)}>
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className={`w-full ${isLarge ? 'max-w-[280px] md:max-w-[350px]' : 'max-w-[250px] md:max-w-[320px]'} h-auto object-contain group-hover:scale-110 transition-transform duration-500 ${book.bgGradient.includes('gray-900') ? 'drop-shadow-2xl' : 'drop-shadow-lg'}`}
                                            onError={(e) => {
                                                e.target.src = '/V1.jpg';
                                            }}
                                        />
                                        {book.hasBadge && (
                                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                ⭐ HOT
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className={`w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 ${isLarge ? 'py-12 md:py-20' : 'py-8 md:py-16'} text-center md:text-left`}>
                                    <h2 className={`${isLarge ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-2xl sm:text-3xl md:text-4xl'} ${isLarge && idx === 1 ? 'font-light' : 'font-medium'} ${isLarge ? 'mb-4' : 'mb-3'} ${book.textColor}`}>
                                        {book.title} <span className={`${isLarge ? 'font-bold' : 'font-semibold'} ${book.titleColor}`}>{book.titleBold}</span>
                                    </h2>
                                    <p className={`${book.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'} text-sm md:text-base leading-relaxed ${isLarge ? 'max-w-md' : 'max-w-sm'} mx-auto md:mx-0 ${isLarge ? 'mb-6' : 'mb-4'}`}>
                                        {book.description}
                                    </p>
                                    <button
                                        onClick={() => handleProductClick(book.id)}
                                        className={`w-fit mx-auto md:mx-0 ${isLarge ? 'px-8 py-3' : 'mt-2 px-6 py-2.5'} ${book.buttonStyle} rounded-lg transition-all duration-300 ${isLarge ? 'font-medium hover:scale-105 active:scale-100 shadow-lg' : 'text-sm font-medium hover:scale-105 active:scale-100'}`}
                                    >
                                        {book.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Browse By Category Section */}
            <div className="relative px-5 md:px-12 lg:px-20 xl:px-32 py-16 md:py-24 mt-16 md:mt-24 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 md:mb-16">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                            Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Category</span>
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Khám phá các thể loại sách phong phú và đa dạng
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer group">
                        <span className="text-sm md:text-base font-medium">Xem tất cả</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative cursor-pointer category-card"
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {/* Category Card */}
                            <div className="relative flex flex-col items-center justify-center bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-2 overflow-hidden">
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-300"></div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>

                                {/* Icon Container */}
                                <div className="relative z-10 mb-4 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-blue-200">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/50 to-purple-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="relative z-10 w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Category Name */}
                                <p className="relative z-10 text-center font-semibold text-sm md:text-base text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.name}
                                </p>

                                {/* Hover Arrow Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-[20px] py-[20px] md:px-[160px] p-[40px]">
                <Tabs
                    activeKey={activeTab}
                    onChange={onChange}
                    items={items}
                    tabBarGutter={16} // khoảng cách giữa tabs
                />
            </div>
            <div className="px-[20px] md:px-[160px] py-[40px]">
                <Swiper
                    key={activeTab} // Force re-render khi tab thay đổi
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                        },
                    }}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={product.length > 4} // Chỉ loop nếu có nhiều hơn 4 sản phẩm
                    className="product-swiper"
                >
                    {product.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => handleProductClick(item.id)}>
                                <div className="px-[25px] relative lg:px-[40px] xl:px-[54px] ">
                                    <div className="relative overflow-hidden rounded-lg">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-[160px] h-[160px] mx-auto cursor-pointer group-hover:scale-110 transition-transform duration-300 object-contain"
                                            onClick={() => handleProductClick(item.id)}
                                        />
                                    </div>
                                    <button className="absolute top-[-35px] right-9 bg-white rounded-full p-2 shadow-md transition-all duration-300 hover:!bg-red-50 hover:scale-110 active:scale-100">
                                        {item.like ? (
                                            <i className="fa-solid fa-heart text-red-500"></i>
                                        ) : (
                                            <i className="fa-regular fa-heart text-gray-400 group-hover:text-red-500"></i>
                                        )}
                                    </button>
                                </div>
                                <div className="mb-[24px]">
                                    <p className="pt-[16px] font-[500] text-center px-[16px] line-clamp-2 min-h-[48px]">{item.name}</p>
                                    <p className="font-[600] text-[24px] text-center text-blue-600 mt-2">{item.price}</p>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => handleProductClick(item.id)}
                                            className="bg-black px-[62px] py-[16px] rounded-md transition-all duration-300 transform hover:!bg-gray-800 hover:scale-105 active:scale-100"
                                        >
                                            <span className="text-[#FFFFFF] font-semibold">Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="py-[40px]">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 0,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 0,
                        },
                    }}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="featured-swiper"
                >
                    {product2.map((p) => {
                        const isDark = p.style === "dark";
                        const cardBg = isDark ? "bg-[#111218] text-white" : p.style === "muted" ? "bg-[#E4E4E4] text-black" : "bg-white text-black";

                        return (
                            <SwiperSlide key={p.id}>
                                <div className={`${cardBg} overflow-visible shadow-sm flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer`} onClick={() => handleProductClick(p.id)}>
                                    {/* IMAGE AREA */}
                                    <div className="relative h-[280px] flex items-center justify-center overflow-hidden pt-[30px] cursor-pointer" onClick={() => handleProductClick(p.id)}>
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="object-contain h-[240px] w-auto group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* TEXT AREA */}
                                    <div className="pl-[32px] py-6 flex flex-col justify-between">
                                        <div className="text-center md:space-y-4">
                                            <p className="md:font-[300] text-[32px] whitespace-nowrap">{p.title}</p>
                                            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                                {p.desc}
                                            </p>
                                        </div>

                                        {/* BUTTON */}
                                        <div className="flex justify-center mt-[20px] md:mt-6">
                                            <button
                                                onClick={() => handleProductClick(p.id)}
                                                className={`rounded-md px-6 py-3 border transition-all duration-300 transform hover:scale-105 active:scale-100 ${isDark
                                                    ? "border-white text-white hover:!bg-white hover:!text-black"
                                                    : "border-gray-300 text-black hover:!bg-black hover:!text-white"
                                                    }`}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            <div className="md:px-[60px] lg:px-[160px] py-[40px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[24px] font-[500] font-SF Pro Display">
                        Discounts up to -50%
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Xem tất cả</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                        },
                    }}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="discount-swiper"
                >
                    {product3.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="lg:bg-[#F6F6F6] bg-white border border-gray-200 rounded-[10px] items-center pt-[72px] hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden" onClick={() => handleProductClick(item.id)}>
                                {/* Badge giảm giá */}
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                                    -50%
                                </div>

                                <div className="flex justify-center md:px-[15px] lg:px-[20px] xl:px-[54px] relative">
                                    <div className="relative overflow-hidden rounded-lg">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-[160px] h-[160px] mx-auto cursor-pointer group-hover:scale-110 transition-transform duration-300 object-contain"
                                            onClick={() => handleProductClick(item.id)}
                                        />
                                    </div>
                                    <button className="absolute top-[-35px] right-9 bg-white rounded-full p-2 shadow-md transition-all duration-300 hover:!bg-red-50 hover:scale-110 active:scale-100 z-10">
                                        {item.liked === "false" ? (
                                            <i className="fa-regular fa-heart text-gray-400 group-hover:text-red-500"></i>
                                        ) : (
                                            <i className="fa-solid fa-heart text-red-500"></i>
                                        )}
                                    </button>
                                </div>
                                <div className="mb-[24px]">
                                    <p className="pt-[16px] font-[500] text-center px-[16px] line-clamp-2 min-h-[48px]">{item.title}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <p className="font-[600] text-[24px] text-center text-red-600">{item.price}</p>
                                        <p className="text-gray-400 line-through text-sm">{(parseFloat(item.price.replace(/[^\d]/g, '')) * 2).toLocaleString()}đ</p>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => handleProductClick(item.id)}
                                            className="bg-gradient-to-r from-red-500 to-red-600 px-[62px] py-[16px] rounded-md transition-all duration-300 transform hover:!from-red-600 hover:!to-red-700 hover:scale-105 active:scale-100 shadow-lg"
                                        >
                                            <span className="text-[#FFFFFF] font-semibold">Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="relative sm:relative  lg:relative bg-gradient-to-r from-[#2E2E2E] to-[#000000] w-[100%] overflow-hidden">
                <div className="flex-col text-center pt-[159px] pb-[90px] ">
                    <div className=" text-[72px] font-light text-[#FFFF]">
                        Big Summer <span className="font-bold">Sale</span>
                    </div>
                    <p className="text-[#787878] pt-[10px] pb-[40px]">
                        Commodo fames vitae vitae leo mauris in. Eu consequat.
                    </p>
                    <button className="mt-6 px-[54px] py-[16px] items-center border border-white rounded-[10px] !text-white transition-all duration-300 hover:!bg-white hover:!text-black hover:scale-105 active:scale-100">
                        Buy Now
                    </button>
                </div>
                <div>
                    <img
                        src="/F20.png"
                        alt="Tablet"
                        className=" hidden md:absolute right-25 lg:left-60 top-[-50px]  w-[337px] h-[181px]"
                    />
                    <img
                        src="/F23.png"
                        alt="Tablet"
                        className="hidden md:absolute left-5 top-[10px] z-1 w-[237px] h-[192px]"
                    />
                    <img
                        src="/F24.png"
                        alt=""
                        className="hidden md:absolute  left-0 top-[40%]  w-[418px] h-[262px] bg-cover"
                    />
                    <img
                        src="/F22.png"
                        alt=""
                        className="hidden md:absolute right-0  lg:right-0 top-0  w-[120px] h-[365px] bg-cover"
                    />
                    <img
                        src="/F21.png"
                        alt=""
                        className="hidden md:absolute top-80 right-[-9px] lg:right-0 bottom-[-15%]  w-[404px] h-[321px] bg-cover"
                    />
                </div>
            </div>
        </>
    )
}
export default Home;