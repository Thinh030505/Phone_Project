import { Breadcrumb, Button } from 'antd';
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';

const ProductPage2 = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('id') || '1';
    const [selectedColor, setSelectedColor] = useState("black");
    const [selectedStorage, setSelectedStorage] = useState("1TB");
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    // Dữ liệu sách
    const booksData = [
        {
            id: 1,
            name: "Sapiens - Lược Sử Loài Người",
            price: "95.400đ",
            originalPrice: "120.000đ",
            img: "/V1.jpg",
            images: ["/V1.jpg", "/V2.webp", "/V3.webp", "/V4.jpg"],
            description: "Cuốn sách kinh điển của Yuval Noah Harari kể về lịch sử loài người từ thời tiền sử đến hiện tại. Một tác phẩm triết học sâu sắc về sự tiến hóa của nhân loại và những thách thức của tương lai.",
            author: "Yuval Noah Harari",
            publisher: "NXB Thế Giới",
            pages: 512,
            language: "Tiếng Việt",
            format: "Bìa mềm",
            dimensions: "13 x 20.5 cm",
            weight: "450g",
            publicationYear: 2023,
            rating: 4.8,
            reviews: 125
        },
        {
            id: 2,
            name: "Homo Deus - Lược Sử Tương Lai",
            price: "89.000đ",
            originalPrice: "110.000đ",
            img: "/V2.webp",
            images: ["/V2.webp", "/V1.jpg", "/V3.webp", "/V4.jpg"],
            description: "Tiếp nối thành công của Sapiens, Harari đưa chúng ta vào tương lai của nhân loại. Cuốn sách dự đoán về sự tiến hóa tiếp theo của loài người trong kỷ nguyên công nghệ.",
            author: "Yuval Noah Harari",
            publisher: "NXB Thế Giới",
            pages: 448,
            language: "Tiếng Việt",
            format: "Bìa mềm",
            dimensions: "13 x 20.5 cm",
            weight: "420g",
            publicationYear: 2023,
            rating: 4.7,
            reviews: 98
        },
        {
            id: 3,
            name: "21 Bài Học Cho Thế Kỷ 21",
            price: "75.000đ",
            originalPrice: "95.000đ",
            img: "/V3.webp",
            images: ["/V3.webp", "/V1.jpg", "/V2.webp", "/V4.jpg"],
            description: "Harari đưa ra 21 bài học quan trọng để hiểu và đối mặt với những thách thức của thế kỷ 21. Từ công nghệ AI đến biến đổi khí hậu, từ chính trị đến tôn giáo.",
            author: "Yuval Noah Harari",
            publisher: "NXB Thế Giới",
            pages: 368,
            language: "Tiếng Việt",
            format: "Bìa mềm",
            dimensions: "13 x 20.5 cm",
            weight: "380g",
            publicationYear: 2022,
            rating: 4.6,
            reviews: 87
        },
        {
            id: 4,
            name: "Atomic Habits - Thói Quen Nguyên Tử",
            price: "82.000đ",
            originalPrice: "105.000đ",
            img: "/V4.jpg",
            images: ["/V4.jpg", "/V1.jpg", "/V2.webp", "/V3.webp"],
            description: "Cuốn sách bán chạy nhất về việc xây dựng thói quen tốt và loại bỏ thói quen xấu. James Clear đưa ra phương pháp khoa học để tạo ra những thay đổi nhỏ nhưng có tác động lớn.",
            author: "James Clear",
            publisher: "NXB Lao Động",
            pages: 320,
            language: "Tiếng Việt",
            format: "Bìa mềm",
            dimensions: "13 x 20.5 cm",
            weight: "350g",
            publicationYear: 2023,
            rating: 4.9,
            reviews: 156
        }
    ];

    // Load sản phẩm theo ID
    useEffect(() => {
        const product = booksData.find(book => book.id === parseInt(productId));
        if (product) {
            setCurrentProduct(product);
        }
    }, [productId]);

    // Helper: đọc giỏ hàng từ localStorage luôn trả về mảng an toàn
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
            // Trước tiên, lấy giỏ hàng hiện tại của user
            const getCartResponse = await fetch('https://dummyjson.com/carts/user/1');
            let existingCart = null;

            if (getCartResponse.ok) {
                const cartData = await getCartResponse.json();
                if (cartData.carts && cartData.carts.length > 0) {
                    existingCart = cartData.carts[0];
                }
            }

            let products = [];
            
            // Chuẩn bị sản phẩm với đầy đủ thông tin theo format API dummyjson.com/carts
            const productPrice = parseFloat(currentProduct.price.replace(/[^\d]/g, '')) / 100; // Convert VND to USD
            const discountPercentage = 10.0; // Giảm giá 10%
            const discountAmount = productPrice * (discountPercentage / 100);
            const discountedTotal = productPrice - discountAmount;
            
            const productToAdd = {
                id: currentProduct.id,
                title: currentProduct.name,
                price: productPrice,
                quantity: 1,
                total: productPrice,
                discountPercentage: discountPercentage,
                discountedTotal: discountedTotal,
                thumbnail: currentProduct.img.startsWith('http') ? currentProduct.img : `${window.location.origin}${currentProduct.img}`
            };

            if (existingCart && existingCart.products) {
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingProductIndex = existingCart.products.findIndex(item => item.id === currentProduct.id);

                if (existingProductIndex >= 0) {
                    // Nếu đã có, tăng số lượng và cập nhật total, discountedTotal
                    products = [...existingCart.products];
                    products[existingProductIndex].quantity += 1;
                    products[existingProductIndex].total = products[existingProductIndex].price * products[existingProductIndex].quantity;
                    // Tính lại discountedTotal khi tăng số lượng
                    const discountPercent = products[existingProductIndex].discountPercentage || 10.0;
                    products[existingProductIndex].discountedTotal = products[existingProductIndex].total * (1 - discountPercent / 100);
                } else {
                    // Nếu chưa có, thêm mới với đầy đủ thông tin
                    products = [...existingCart.products, productToAdd];
                }
            } else {
                // Nếu chưa có giỏ hàng, tạo mới với đầy đủ thông tin
                products = [productToAdd];
            }

            // Gọi API để tạo/cập nhật giỏ hàng
            // API dummyjson.com/carts/add là endpoint đúng để thêm cart
            const requestBody = {
                userId: 1,
                products: products
            };
            
            console.log('📤 Gửi request đến API:', 'POST https://dummyjson.com/carts/add');
            console.log('📦 Body gửi lên:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch('https://dummyjson.com/carts/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                setCartMessage("Đã thêm sản phẩm vào giỏ hàng thành công! Đang chuyển đến giỏ hàng...");
                console.log('✅ Response từ API:', result);
                console.log('📋 Sản phẩm đã được thêm:', result.products);

                // Lưu toàn bộ cart response vào localStorage với đầy đủ thông tin
                // Vì API dummyjson.com không persist, nên cần lưu local
                const cartToSave = {
                    id: result.id,
                    userId: result.userId,
                    products: products // Lưu products với đầy đủ thông tin đã chuẩn bị
                };
                localStorage.setItem('localCart', JSON.stringify(cartToSave));

                // Dispatch custom event để Cart.jsx có thể refresh
                window.dispatchEvent(new CustomEvent('cartUpdated'));

                // Chờ 3 giây rồi chuyển đến trang cart
                setTimeout(() => {
                    navigate('/cart');
                }, 3000);
            } else {
                throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            setCartMessage("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const product = currentProduct ? currentProduct.images.map((img, index) => ({ id: index + 1, img })) : [
        { id: 1, img: "/V1.jpg" },
    ];
    const mainImg = currentProduct ? [{ id: 1, img: currentProduct.img }] : [
        { id: 1, img: "/V1.jpg" },
    ];
    // Sách liên quan
    const relatedBooks = [
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
            <div className="py-[44px] px-[160px]">
                <Breadcrumb
                    className=" hidden md:block md:font-[300] md:text-[16px]"
                    separator=">"
                    items={[
                        { title: "Trang chủ" },
                        { title: "Sách" },
                        { title: "Chi tiết sách" },
                        { title: currentProduct ? currentProduct.name : "Sapiens - Lược Sử Loài Người" },
                    ]}
                />
            </div>
            <div className=" px-[50px] md:px-[100px] lg:px-[160px] w-full flex flex-col xl:flex-row mt-[5px] items-center  gap-6">
                <div className=" flex flex-col w-full xl:flex-row  xl:w-[50%] justify-between">
                    {/* Thumbnail */}
                    <div className="flex w-full  xl:w-[20%] mt-[30px] gap-3 order-2 xl:order-1 justify-between xl:flex-col xl:justify-start xl:pt-[100px]">
                        {product.map((item) => (
                            <div
                                key={item.id}
                                className="w-16 h-20 rounded-[10px] overflow-hidden flex-shrink-0"
                            >
                                <img
                                    src={item.img}
                                    alt={`Thumbnail ${item.id}`}
                                    className="w-[46px] h-[93px] object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="mt-[45px] order-1 xl:order-2 flex justify-center xl:block">
                        {mainImg.map((item) => (
                            <div key={item.id}>
                                <img
                                    src={item.img}
                                    alt={`Main ${item.id}`}
                                    className=" w-[415px] h-[516px] object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className=' flex-1 ml-[42px] px-[20px] '>
                    <h1 className="  text-center text-[42px] font-[700]  md:text-left md:text-[42px] lg:text-2xl ">
                        {currentProduct ? currentProduct.name : "Sapiens - Lược Sử Loài Người"}
                    </h1>
                    <div className="flex items-center gap-4 mt-[24px] mb-[16px]">
                        <span className="text-[32px] font-[] md:text-2xl font-semibold text-black">
                            {currentProduct ? currentProduct.price : "95.400đ"}
                        </span>
                        <span className="text-gray-400 line-through">
                            {currentProduct ? currentProduct.originalPrice : "120.000đ"}
                        </span>
                    </div>
                    <div className='flex items-center gap-[24px]' >
                        <span className=''>Tác giả:</span>
                        <div className='flex gap-[20px] md:gap-[8px] items-center  '>
                            <span className="text-[16px] font-medium">
                                {currentProduct ? currentProduct.author : "Yuval Noah Harari"}
                            </span>
                        </div>
                    </div>
                    <div className='mt-[24px]'>
                        <div className="flex items-center gap-[8px]">
                            <span className="text-[14px] text-gray-600">Nhà xuất bản:</span>
                            <span className="text-[14px] font-medium">
                                {currentProduct ? currentProduct.publisher : "NXB Thế Giới"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-[24px]">
                            <div className="flex items-center  px-[16px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-book text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Số trang</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.pages : "512"}</p>
                                </div>
                            </div>

                            {/* Ngôn ngữ */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-language text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Ngôn ngữ</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.language : "Tiếng Việt"}</p>
                                </div>
                            </div>

                            {/* Định dạng */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-file-lines text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Định dạng</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.format : "Bìa mềm"}</p>
                                </div>
                            </div>

                            {/* Kích thước */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-ruler text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Kích thước</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.dimensions : "13 x 20.5 cm"}</p>
                                </div>
                            </div>

                            {/* Trọng lượng */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-weight text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Trọng lượng</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.weight : "450g"}</p>
                                </div>
                            </div>

                            {/* Năm xuất bản */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-calendar text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Năm xuất bản</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">{currentProduct ? currentProduct.publicationYear : "2023"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='leading-[1.5]  text-[14px] font-[400] text-[#2C2C2C] pt-[24px]  '>
                        <p className='leading-[2] tracking-[1.5px] md:tracking-[0.3px]'>
                            {currentProduct ? currentProduct.description : "Cuốn sách kinh điển của Yuval Noah Harari kể về lịch sử loài người từ thời tiền sử đến hiện tại. Một tác phẩm triết học sâu sắc về sự tiến hóa của nhân loại và những thách thức của tương lai."}
                        </p>
                    </div>
                    <div className='py-[32px] flex gap-[16px]'>
                        <button className='border px-[78px] rounded-[6px]  font-[700]  py-[16px] '>Thêm vào yêu thích</button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className='border px-[78px] rounded-[6px] !text-[white] bg-black font-[700] py-[16px] disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>

                    {/* Thông báo */}
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
                                <p
                                    className="text-[14px] text-gray-500"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    Giao hàng miễn phí
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    1-2 ngày
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-[16px] py-[12px]">
                            <button className="border-none rounded-[8px] bg-[#F6F6F6] px-[16px] py-[16px]">
                                <i className="fa-solid fa-store"></i>
                            </button>
                            <div className="whitespace-nowrap">
                                <p
                                    className="text-[14px] text-gray-500"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    Còn hàng
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    Hôm nay
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-[16px] py-[12px]">
                            <button className="border-none rounded-[8px] bg-[#F6F6F6] px-[16px] py-[16px]">
                                <i className="fa-solid fa-circle-check" ></i >

                            </button>
                            <div className="whitespace-nowrap">
                                <p
                                    className="text-[14px] text-gray-500"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    Bảo hành
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    1 năm
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-[#FAFAFA]'>
                <div className='px-[160px] py-[80px] bg-[#FAFAFA]'>
                    <div className='px-[40px] rounded-[8px] bg-[#FFFFFF]  py-[48px]'>
                        <div className='font-500 text-[24px]'>
                            <p className='font-500 text-[24px] mb-[32px]'>Chi tiết sách</p>
                            <p className='font-500 text-[14px] leading-6 text-[#9D9D9D] mb-[32px]'>Cuốn sách này mang đến những góc nhìn sâu sắc và độc đáo về lịch sử loài người. Tác giả đã dành nhiều năm nghiên cứu để tạo ra một tác phẩm có giá trị học thuật cao, đồng thời dễ hiểu và hấp dẫn đối với độc giả. Nội dung sách được trình bày một cách logic và có hệ thống, giúp người đọc dễ dàng theo dõi và hiểu được những vấn đề phức tạp.</p>
                            <p className='font-500 text-[24px] mt-[32px] mb-[16px]'>Thông tin xuất bản</p>
                        </div>
                        <div>
                            {/* Thông tin xuất bản */}
                            <div>
                                <div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>Tác giả</span>
                                        <span>{currentProduct ? currentProduct.author : "Yuval Noah Harari"}</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>Nhà xuất bản</span>
                                        <span>{currentProduct ? currentProduct.publisher : "NXB Thế Giới"}</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400]  border-[#CDCDCD] ' >
                                        <span>Số trang</span>
                                        <span>{currentProduct ? currentProduct.pages : "512"}</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>Ngôn ngữ</span>
                                        <span>{currentProduct ? currentProduct.language : "Tiếng Việt"}</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Định dạng</span>
                                        <span>{currentProduct ? currentProduct.format : "Bìa mềm"}</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Năm xuất bản</span>
                                        <span>{currentProduct ? currentProduct.publicationYear : "2023"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin kỹ thuật */}
                            <div>
                                <p className='font-500 text-[24px] mb-[32px] pt-[40px] pb-[16px]'>Thông tin kỹ thuật</p>
                                <div>
                                    <div className='flex justify-between pb-[12px] text-[16px] border-b font-[400] border-[#CDCDCD]'>
                                        <span>Kích thước</span>
                                        <span>{currentProduct ? currentProduct.dimensions : "13 x 20.5 cm"}</span>
                                    </div>
                                    <div className='flex justify-between  pb-[8px] pt-[12px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Trọng lượng</span>
                                        <span>{currentProduct ? currentProduct.weight : "450g"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <div className=' flex justify-center text-[14px] font-[500] '>
                                <button className='border rounded-[8px] px-[56px] py-[12px]'>Xem thêm <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <div className='px-[160px] pt-[80px] pb-[32px] '>
                <div className=" p-4 rounded-md">
                    {/* Tiêu đề */}
                    <h2 className="text-[24px] font-[500] mb-[48px]">Đánh giá từ độc giả</h2>

                    <div className="flex gap-[60px]">
                        {/* Cột bên trái */}
                        <div className="flex flex-col leading-0 items-center px-[32px] py-[42px] bg-[#FAFAFA] rounded-[25px]">
                            <p className="text-[56px] font-[500]  ">{currentProduct ? currentProduct.rating : "4.8"}</p>
                            <p className="text-[14px] ">trên {currentProduct ? currentProduct.reviews : "125"} đánh giá</p>
                            <div className="flex gap-1 mt-2 text-[#FFB547]">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-regular fa-star-half-stroke"></i>
                            </div>
                        </div>
                        {/* Cột bên phải */}
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
                    <div className="border-[#FAFAFA] border-[2px] rounded-[7px] px-[16px] mt-[16px]  py-[16px]">
                        <input
                            type="text"
                            placeholder="Viết đánh giá của bạn..."
                            className="w-full border-none outline-none text-[14px] text-gray-500"
                        />
                    </div>
                </div>
                <div class="">
                    <div class="bg-white rounded-[10px] border border-[#F4F4F4] px-[28px] py-[24px]  shadow-sm">
                        <div class="flex justify-between items-center">
                            <div class="flex items-start gap-4">
                                <img
                                    src="./F29.png"
                                    alt="Ronald Richards"
                                    class=" rounded-full object-cover"
                                />
                                <div class="flex flex-col leading-0 mt-[10px]">
                                    <p class="text-[14px] font-[600]">Nguyễn Văn A</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">24 Tháng 1, 2024</div>
                        </div>
                        <div className='ml-[6%] leading-6'>
                            <p class="mt-[10px] text-gray-700 text-[14px] ">
                                Cuốn sách này thực sự tuyệt vời! Tác giả đã trình bày những ý tưởng phức tạp một cách dễ hiểu và hấp dẫn.
                                Nội dung sâu sắc, cách viết lôi cuốn. Đây là một trong những cuốn sách hay nhất tôi từng đọc về lịch sử loài người.
                                Rất đáng để đọc và suy ngẫm.
                            </p>
                        </div>
                    </div>
                    <div class="bg-white rounded-[10px] border border-[#F4F4F4] px-[28px] py-[24px] mt-[24px]  shadow-sm">
                        <div class="flex justify-between items-center">
                            <div class="flex items-start gap-4">
                                <img
                                    src="./F30.png"
                                    alt="Ronald Richards"
                                    class=" rounded-full object-cover"
                                />
                                <div class="flex flex-col leading-0 mt-[10px]">
                                    <p class="text-[14px] font-[600]">Trần Thị B</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">20 Tháng 1, 2024</div>
                        </div>
                        <div className='ml-[6%] leading-6'>
                            <p class="mt-[10px] text-gray-700 text-[14px] ">
                                Một cuốn sách đáng đọc! Cách tác giả phân tích và giải thích các sự kiện lịch sử rất thú vị.
                                Tôi đã học được rất nhiều điều mới mẻ về lịch sử loài người.
                                Đặc biệt thích phần nói về sự phát triển của ngôn ngữ và văn hóa.
                            </p>
                        </div>
                        <div className='flex mt-[16px] gap-[8px] ml-[6%] '>
                            <img src="./F31.png" alt="" />
                            <img src="./F32.png" alt="" />
                        </div>
                    </div>
                    <div class="bg-white rounded-[10px] border border-b-0  border-[#F4F4F4] px-[28px] mt-[24px] py-[24px] shadow-[50px] relative">
                        <div class="flex justify-between items-center">
                            <div class="flex items-start gap-4">
                                <div class="relative w-[48px] h-[48px]">
                                    <img
                                        src="./F29.png"
                                        alt="John Malcolm"
                                        class="w-[48px] h-[48px] rounded-full object-cover"
                                    />
                                    <div class="absolute inset-0   rounded-full"></div>
                                </div>
                                <div class="flex flex-col mt-[6px] leading-[24px]">
                                    <p class="text-[14px] font-[600]">Lê Văn C</p>
                                    <div class="flex items-center gap-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-regular fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">18 Tháng 1, 2024</div>
                        </div>


                        <div class="ml-[6%] mt-[10px] relative">
                            <p class="text-gray-700 text-[14px] leading-[24px] max-h-[72px] overflow-hidden relative">
                                Cuốn sách này đã thay đổi cách tôi nhìn nhận về lịch sử và tương lai của nhân loại.
                                Tác giả có cách viết rất thuyết phục và logic.
                                Tôi đặc biệt ấn tượng với phần phân tích về sự phát triển của các tôn giáo và hệ thống chính trị.
                            </p>

                            <div class="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                        <div class="flex justify-center mt-6">
                            <button class="absolute px-[56px] py-[12px] z-[99] border rounded-md shadow-sm text-[14px] font-medium">
                                Xem thêm <i class="fa-solid fa-chevron-down ml-1 text-[12px]"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-[160px] py-[56px]'>
                <h2 className='text-[24px] font-[500]'>Sách liên quan</h2>
                <div className="grid grid-cols-4 items-center gap-[16px] mt-[32px]" >
                    {relatedBooks.map((item) => (
                        <div key={item.id} className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] ">
                            <div className="relative px-[54px] ">
                                <img src={item.img} alt="" className="w-[160px] h-[160px]" />
                                <span className="absolute top-[-35px] right-9">
                                    {item.liked ? (
                                        <i className="fa-regular fa-heart"></i>
                                    ) : (

                                        <i className="fa-solid fa-heart text-red-500"></i>
                                    )}
                                </span>


                            </div>
                            <div className="mb-[24px]">
                                <p className="pt-[16px] font-[500] text-center px-[16px]">{item.title}</p>
                                <p className="font-[500] text-[24px] text-center">{item.price}</p>
                                <div className="flex justify-center mt-4">
                                    <button className="bg-black px-[62px] py-[16px] rounded-md ">
                                        <span className="text-[#FFFFFF]">Mua ngay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};


export default ProductPage2;
