import { DiJava } from "react-icons/di";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from 'react-router-dom';

import { Tabs } from 'antd';
const Home = () => {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/ProductPage2?id=${productId}`);
    };

    // Hero slides data
    const heroSlides = [
        {
            id: 1,
            subtitle: "Tri Thức. Vô Hạn.",
            title: "Sách Hay",
            titleBold: "Mỗi Ngày",
            description: "Khám phá thế giới tri thức qua những cuốn sách tuyệt vời",
            image: "/V1.jpg",
            bookTitle: "Sapiens - Lược Sử Loài Người",
            author: "Yuval Noah Harari"
        },
        {
            id: 2,
            subtitle: "Kiến Thức. Sáng Tạo.",
            title: "Homo Deus",
            titleBold: "Tương Lai",
            description: "Dự đoán về tương lai của nhân loại trong kỷ nguyên công nghệ",
            image: "/V2.webp",
            bookTitle: "Homo Deus - Lược Sử Tương Lai",
            author: "Yuval Noah Harari"
        },
        {
            id: 3,
            subtitle: "Học Hỏi. Phát Triển.",
            title: "21 Bài Học",
            titleBold: "Thế Kỷ 21",
            description: "Những bài học quan trọng để đối mặt với thách thức hiện đại",
            image: "/V3.webp",
            bookTitle: "21 Bài Học Cho Thế Kỷ 21",
            author: "Yuval Noah Harari"
        },
        {
            id: 4,
            subtitle: "Thành Công. Thói Quen.",
            title: "Atomic Habits",
            titleBold: "Thay Đổi",
            description: "Xây dựng thói quen tốt để tạo ra những thay đổi lớn",
            image: "/V4.jpg",
            bookTitle: "Atomic Habits - Thói Quen Nguyên Tử",
            author: "James Clear"
        }
    ];

    const categories = [
        { id: 1, name: "Sách Kinh Tế", img: "/V1.jpg" },
        { id: 2, name: "Sách Lịch Sử", img: "/V2.webp" },
        { id: 3, name: "Sách Tâm Lý", img: "/V3.webp" },
        { id: 4, name: "Sách Kỹ Năng", img: "/V4.jpg" },
        { id: 5, name: "Sách Triết Học", img: "/V5.png" },
        { id: 6, name: "Sách Bestseller", img: "/V1.jpg" },
    ]

    const onChange = (key) => {
        console.log(key)
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
    // layout col-6 - Sách
    const product = [
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



    ]
    const product2 = [
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
    ]
    const product3 = [
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

    ]
    return (
        <>
            {/* Hero Section - Modern & Clean */}
            <div className="relative bg-gradient-to-br from-[#0F0F10] via-[#1a1a1f] to-[#0F0F10] text-white overflow-hidden">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    speed={1200}
                    className="hero-swiper"
                >
                    {heroSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative min-h-[550px] md:min-h-[650px] lg:min-h-[750px] flex items-center">
                                <div className="container mx-auto px-[20px] md:px-[100px] xl:px-[160px] py-16 w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
                                        {/* Left Content */}
                                        <div className="flex flex-col justify-center text-center lg:text-left">
                                            <p className="text-gray-400 text-[18px] md:text-[22px] mb-3 font-light tracking-wide">
                                                {slide.subtitle}
                                            </p>
                                            <h1 className="text-[60px] sm:text-[70px] md:text-[80px] lg:text-[100px] font-light leading-[1.1] mb-6">
                                                <span className="block">{slide.title}</span>
                                                <span className="block font-bold text-white mt-2">{slide.titleBold}</span>
                            </h1>
                                            <p className="text-gray-300 text-[15px] md:text-[17px] mb-8 max-w-[500px] mx-auto lg:mx-0 leading-relaxed">
                                                {slide.description}
                                            </p>
                                            
                                            {/* Book Info Card */}
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-8 max-w-[450px] mx-auto lg:mx-0">
                                                <p className="text-white font-semibold text-lg mb-2">{slide.bookTitle}</p>
                                                <p className="text-gray-400 text-sm">📖 {slide.author}</p>
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                                <button 
                                                    onClick={() => handleProductClick(slide.id)}
                                                    className="px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-base shadow-2xl hover:shadow-white/20 hover:scale-105"
                                                >
                                                    Mua Ngay
                                                </button>
                                                <button className="px-8 py-4 border-2 border-white/30 rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-medium text-base hover:scale-105">
                                                    Khám Phá Thêm
                                </button>
                            </div>
                        </div>
                                        
                                        {/* Right Image */}
                                        <div className="flex justify-center lg:justify-end order-first lg:order-last">
                                            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[450px]">
                                                {/* Decorative elements */}
                                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                                                
                                                {/* Book Image */}
                                                <div className="relative z-10">
                                                    <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
                                                        <img
                                                            src={slide.image}
                                                            alt={slide.bookTitle}
                                                            className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-lg"
                                                        />
                                                        {/* Shine effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-lg"></div>
                                                    </div>
                                                </div>
                                                
                                                {/* Floating badge */}
                                                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-2xl animate-pulse">
                                                    ⭐ Bestseller
                                                </div>
                                            </div>
                                        </div>
                        </div>
                    </div>
                </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Featured Products Section - Modern Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Top Left: PlayStation 5 */}
                <div className="bg-white group hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row items-center h-full">
                        <div className="w-full md:w-1/2 flex justify-center p-8 md:p-12">
                            <div className="relative">
                            <img
                                src="/F8.png"
                                alt="Playstation 5"
                                    className="w-full max-w-[400px] md:max-w-[513px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 text-center md:text-left">
                            <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-medium mb-4">
                                PlayStation <span className="font-bold">5</span>
                            </h2>
                            <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-[450px] mx-auto md:mx-0">
                                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will
                                redefine your PlayStation experience.
                            </p>
                            <button className="w-fit mx-auto md:mx-0 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Right: MacBook Air */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 group hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col-reverse md:flex-row items-center h-full">
                        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 text-center md:text-left">
                            <h2 className="text-[32px] sm:text-[40px] md:text-[64px] font-light mb-4">
                                Macbook <span className="font-semibold">Air</span>
                            </h2>
                            <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-[400px] mx-auto md:mx-0">
                                The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
                            </p>
                            <button className="w-fit mx-auto md:mx-0 px-8 py-3 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all font-medium">
                                Shop Now
                            </button>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end p-8 md:p-12">
                            <div className="relative">
                                <img
                                    src="/F12.png"
                                    alt="MacBook Air"
                                    className="w-full max-w-[500px] md:max-w-[600px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Left: AirPods Max */}
                <div className="bg-white group hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row items-center h-full min-h-[300px]">
                        <div className="w-full md:w-1/2 flex justify-center p-8 md:p-12">
                            <div className="relative">
                                <img
                                    src="/F9.png"
                                    alt="Apple AirPods Max"
                                    className="w-full max-w-[280px] md:max-w-[300px] h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                                </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-8 md:py-16 text-center md:text-left">
                            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-normal mb-3">
                                Apple AirPods <span className="font-semibold">Max</span>
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-[300px] mx-auto md:mx-0">
                                Computational audio. Listen, it's powerful
                            </p>
                            <button className="w-fit mx-auto md:mx-0 mt-6 px-6 py-2 border border-gray-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all text-sm font-medium">
                                Shop Now
                            </button>
                        </div>
                    </div>
                        </div>

                {/* Bottom Right: Vision Pro */}
                <div className="bg-[#1F1F1F] text-white group hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row items-center h-full min-h-[300px]">
                        <div className="w-full md:w-1/2 flex justify-center p-8 md:p-12">
                            <div className="relative">
                                <img
                                    src="/F10.png"
                                    alt="Apple Vision Pro"
                                    className="w-full max-w-[320px] md:max-w-[380px] h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-8 md:py-16 text-center md:text-left">
                            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-medium mb-3">
                                Apple Vision <span className="font-bold">Pro</span>
                        </h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-[300px] mx-auto md:mx-0">
                                An immersive way to experience entertainment
                        </p>
                            <button className="w-fit mx-auto md:mx-0 mt-6 px-6 py-2 border-2 border-white/30 rounded-lg hover:bg-white hover:text-black transition-all text-sm font-medium">
                            Shop Now
                        </button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="px-[20px] md:px-[160px] mt-[80px]">
                <div className="flex justify-between items-center">
                    <h2 className=" text-[20px] font-[500] sm:font-[500] sm:text-[24px]">Browse By Category</h2>
                    <img className="w-[32px] h-[32px] bg-[cover]" src="/F13.png" alt="" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-[32px]">
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center bg-[#EBEBEB] p-6 rounded-xl"
                        >
                            <img src={item.img} alt={item.name} className="w-[40px] h-[40px]" />
                            <p className="mt-[8px] font-[500] text-[14px]">{item.name}</p>
                        </div>
                    ))}
                </div>

            </div>
            <div className="px-[20px] py-[20px] md:px-[160px] p-[40px]">
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    tabBarGutter={16} // khoảng cách giữa tabs
                />
            </div>
            <div className="px-[20px] md:px-[160px] py-[40px]">
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
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="product-swiper"
                >
                    {product.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="px-[25px] relative lg:px-[40px] xl:px-[54px] ">
                                    <div className="relative overflow-hidden rounded-lg">
                                <img 
                                    src={item.img} 
                                            alt={item.name} 
                                            className="w-[160px] h-[160px] mx-auto cursor-pointer group-hover:scale-110 transition-transform duration-300 object-contain" 
                                    onClick={() => handleProductClick(item.id)}
                                />
                                    </div>
                                    <button className="absolute top-[-35px] right-9 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors">
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
                                            className="bg-black px-[62px] py-[16px]  rounded-md hover:bg-gray-800 transition-colors transform hover:scale-105"
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
                                <div className={`${cardBg} overflow-visible shadow-sm flex flex-col hover:shadow-xl transition-all duration-300 group`}>
                                {/* IMAGE AREA */}
                                <div className="relative h-[280px] flex items-center justify-center overflow-hidden pt-[30px]">
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
                                                className={`rounded-md px-6 py-3 border transition-all duration-150 transform hover:scale-105 ${isDark
                                                ? "border-white text-white hover:bg-white hover:text-black"
                                                : "border-gray-300 text-black hover:bg-black hover:text-white"
                                                }`}
                                        >
                                            Shop Now
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
                            <div className="lg:bg-[#F6F6F6] bg-white border border-gray-200 rounded-[10px] items-center pt-[72px] hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
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
                                    <button className="absolute top-[-35px] right-9 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors z-10">
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
                                            className="bg-gradient-to-r from-red-500 to-red-600 px-[62px] py-[16px] rounded-md hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
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
                    <button className="mt-6 px-[54px] py-[16px] items-center border border-white rounded-[10px] !text-white hover:bg-white hover:!text-black transition">
                        Shop Now
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