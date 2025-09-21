import { Breadcrumb, Button } from 'antd';
import React, { useState } from "react";
const ProductPage2 = () => {
    const [selectedColor, setSelectedColor] = useState("black");
    const [selectedStorage, setSelectedStorage] = useState("1TB");
    const product = [
        { id: 1, img: "/F15.png" },
        { id: 1, img: "/F26.png" },
        { id: 2, img: "/F27.png" },
        { id: 3, img: "/F28.png" },
    ];
    const mainImg = [
        { id: 1, img: "/F15.png" },
    ];
    const colors = [
        { id: 1, name: "black", code: "bg-black" },
        { id: 2, name: "purple", code: "bg-purple-700" },
        { id: 3, name: "red", code: "bg-red-600" },
        { id: 4, name: "yellow", code: "bg-yellow-400" },
        { id: 5, name: "white", code: "bg-gray-300" },
    ];
    const storages = ["128GB", "256GB", "512GB", "1TB"];
    const product3 = [
        {
            title: "Apple Watch Series 9 GPS 41mm Starlight Aluminium ",
            price: "$579",
            img: "/F15.png",
            liked: "false"
        },
        {
            title: "Apple Watch Series 9 GPS 41mm Starlight Aluminium ",
            price: "$579",
            img: "/F15.png",
            liked: "false"
        },
        {
            title: "Apple Watch Series 9 GPS 41mm Starlight Aluminium ",
            price: "$579",
            img: "/F15.png",
            liked: "false"
        },
        {
            title: "Apple Watch Series 9 GPS 41mm Starlight Aluminium ",
            price: "$579",
            img: "/F15.png",
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
                        { title: "Home" },
                        { title: "Application Center" },
                        { title: "Application List" },
                        { title: "An Application" },
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
                    <h1 className="  text-center text-[42px] font-[700]  md:text-left md:text-[42px] lg:text-2xl ">Apple iPhone 14 Pro Max</h1>
                    <div className="flex items-center gap-4 mt-[24px] mb-[16px]">
                        <span className="text-[32px] font-[] md:text-2xl font-semibold text-black">$1399</span>
                        <span className="text-gray-400 line-through">$1499</span>
                    </div>
                    <div className='flex items-center gap-[24px]' >
                        <span className=''>Set color :</span>
                        <div className='flex gap-[20px] md:gap-[8px] items-center  '>
                            {colors.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedColor(item.name)}
                                    aria-pressed={selectedColor === item.name}
                                    className={` w-[32px] h-[32px] rounded-full border ${item.code}   ${selectedColor === item.name ? "ring-2 ring-offset-1 ring-black" : ""} `}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='mt-[24px]'>
                        {/* <div className='flex gap-[10px] text-[#D5D5D5]'>
                            <button className=' px-[24px]  rounded-[8px]  py-[12px] border border-[#CFCFCF]'>128Gb</button>
                            <button className=' px-[24px]  rounded-[8px]  py-[12px] border border-[#CFCFCF]'>256Gb</button>
                            <button className=' px-[24px]  rounded-[8px]  py-[12px] border border-[#CFCFCF]'>512Gb</button>
                            <button className=' px-[24px]  rounded-[8px]  py-[12px] border border-[#CFCFCF]'>1TB</button>
                        </div> */}

                        <div className="flex items-center gap-[8px]">
                            {storages.map((item) => (
                                <button
                                    key={item}
                                    className={`px-[24px] py-[12px] border rounded-[8px]  ${selectedStorage === item ? "border-black border-[2px] bg-white text-white" : "bg-gray-100"}`}
                                    onClick={() => setSelectedStorage(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-[24px]">
                            <div className="flex items-center  px-[16px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-mobile-screen-button text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Screen size</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">6.7"</p>
                                </div>
                            </div>

                            {/* CPU */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-microchip text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">CPU</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">Apple A16 Bionic</p>
                                </div>
                            </div>

                            {/* Number of Cores */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-circle-nodes text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Number of Cores</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">6</p>
                                </div>
                            </div>

                            {/* Main Camera */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-camera text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Main camera</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">48-12-12 MP</p>
                                </div>
                            </div>

                            {/* Front Camera */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-camera-rotate text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Front-camera</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">12 MP</p>
                                </div>
                            </div>

                            {/* Battery */}
                            <div className="flex items-center px-[12px] pt-[12px] border-none rounded-[8px] bg-[#F4F4F4]">
                                <i className="fa-solid fa-battery-full text-gray-600 text-[16px] mr-[6px]"></i>
                                <div className="flex flex-col leading-[0.4]">
                                    <p className="m-0 p-0 text-[13px] text-gray-500">Battery capacity</p>
                                    <p className="m-0 p-0 text-[14px] font-medium">4323 mAh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='leading-[1.5]  text-[14px] font-[400] text-[#2C2C2C] pt-[24px]  '>
                        <p className='leading-[2] tracking-[1.5px] md:tracking-[0.3px]'>Enhanced capabilities thanks toan enlarged display of 6.7 inchesand work without rechargingthroughout the day. Incredible photosas in weak, yesand in bright lightusing the new systemwith two cameras more...</p>
                    </div>
                    <div className='py-[32px] flex gap-[16px]'>
                        <button className='border px-[78px] rounded-[6px]  font-[700]  py-[16px] '>Add to Wishlist</button>
                        <button className='border px-[78px] rounded-[6px] !text-[white] bg-black font-[700]  py-[16px] '>Add to Card</button>
                    </div>
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
                                    Free Delivery
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    1-2 day
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
                                    In Stock
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    Today
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
                                    Guaranteed
                                </p>
                                <p
                                    className="text-[14px] font-semibold"
                                    style={{ margin: 0, lineHeight: "16px" }}
                                >
                                    1 Year
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
                            <p className='font-500 text-[24px] mb-[32px]'>Detail</p>
                            <p className='font-500 text-[14px] leading-6 text-[#9D9D9D] mb-[32px]'>Just as a book is judged by its cover, the first thing you notice when you pick up a modern smartphone is the display. Nothing surprising, because advanced technologies allow you to practically level the display frames and cutouts for the front camera and speaker, leaving no room for bold design solutions. And how good that in such realities Apple everything is fine with displays. Both critics and mass consumers always praise the quality of the picture provided by the products of the Californian brand. And last year's 6.7-inch Retina panels, which had ProMotion, caused real admiration for many.</p>
                            <p className='font-500 text-[24px] mt-[32px] mb-[16px]'>Screen</p>
                        </div>
                        <div>
                            {/* Screen */}
                            <div>
                                <h2>Screen</h2>
                                <div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>Screen diagonal</span>
                                        <span>6.7"</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>The screen resolution</span>
                                        <span>2796×1290</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400]  border-[#CDCDCD] ' >
                                        <span>The screen refresh rate</span>
                                        <span>120 Hz</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD] '>
                                        <span>The pixel density</span>
                                        <span>460 ppi</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Screen type</span>
                                        <span>OLED</span>
                                    </div>
                                    <div className='flex justify-between border-b pb-[8px] pt-[24px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Additionally</span>
                                        <div>
                                            <p>Dynamic Island</p>
                                            <p>Always-On display</p>
                                            <p>HDR display</p>
                                            <p>True Tone</p>
                                            <p>Wide color (P3)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CPU */}
                            <div>
                                <p className='font-500 text-[24px] mb-[32px] pt-[40px] pb-[16px]'>CPU</p>
                                <div>
                                    <div className='flex justify-between pb-[12px] text-[16px] border-b font-[400] border-[#CDCDCD]'>
                                        <span>CPU</span>
                                        <span>A16 Bionic</span>
                                    </div>
                                    <div className='flex justify-between  pb-[8px] pt-[12px] text-[16px] font-[400] border-[#CDCDCD]'>
                                        <span>Number of cores</span>
                                        <span>6</span>
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <div className=' flex justify-center text-[14px] font-[500] '>
                                <button className='border rounded-[8px] px-[56px] py-[12px]'>View More <i class="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <div className='px-[160px] pt-[80px] pb-[32px] '>
                <div className=" p-4 rounded-md">
                    {/* Tiêu đề */}
                    <h2 className="text-[24px] font-[500] mb-[48px]">Reviews</h2>

                    <div className="flex gap-[60px]">
                        {/* Cột bên trái */}
                        <div className="flex flex-col leading-0 items-center px-[32px] py-[42px] bg-[#FAFAFA] rounded-[25px]">
                            <p className="text-[56px] font-[500]  ">4.8</p>
                            <p className="text-[14px] ">of 125 reviews</p>
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
                                <span className="w-28 text-sm">Excellent</span>
                                <div className="flex-1 bg-gray-200 h-[24px] rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "90%" }}></div>
                                </div>
                                <span className="text-sm">100</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Good</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "70%" }}></div>
                                </div>
                                <span className="text-sm">11</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Average</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "50%" }}></div>
                                </div>
                                <span className="text-sm">3</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Below Average</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: "40%" }}></div>
                                </div>
                                <span className="text-sm">8</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-28 text-sm">Poor</span>
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
                            placeholder="Leave Comment"
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
                                    <p class="text-[14px] font-[600]">Ronald Richards</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">24 January, 2023</div>
                        </div>
                        <div className='ml-[6%] leading-6'>
                            <p class="mt-[10px] text-gray-700 text-[14px] ">
                                This phone has 1T storage and is durable. Plus all the new iPhones have a C port!
                                Apple is phasing out the current ones! So if you want a phone that's going to last
                                grab an iPhone 14 pro max and get several cords and plugs.
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
                                    <p class="text-[14px] font-[600]">Darcy King</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">24 January, 2023</div>
                        </div>
                        <div className='ml-[6%] leading-6'>
                            <p class="mt-[10px] text-gray-700 text-[14px] ">
                                This phone has 1T storage and is durable. Plus all the new iPhones have a C port!
                                Apple is phasing out the current ones! So if you want a phone that's going to last
                                grab an iPhone 14 pro max and get several cords and plugs.
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
                                    <p class="text-[14px] font-[600]">John Malcolm</p>
                                    <div class="flex items-center gap-1">
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-solid fa-star text-yellow-400"></i>
                                        <i class="fa-regular fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">24 January, 2023</div>
                        </div>


                        <div class="ml-[6%] mt-[10px] relative">
                            <p class="text-gray-700 text-[14px] leading-[24px] max-h-[72px] overflow-hidden relative">
                                In Washington, it is already difficult to surprise with the opening of a new institution,
                                but it is still possible. Especially if it is a True Cost project.
                                Here you pay an entrance fee and get meals at cost price.
                            </p>

                            <div class="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                        <div class="flex justify-center mt-6">
                            <button class="absolute px-[56px] py-[12px] z-[99] border rounded-md shadow-sm text-[14px] font-medium">
                                View More <i class="fa-solid fa-chevron-down ml-1 text-[12px]"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-[160px] py-[56px]'>
                <h2 className='text-[24px] font-[500]'>Related Product</h2>
                <div className="grid grid-cols-4 items-center gap-[16px] mt-[32px]" >
                    {product3.map((item) => (
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
                                        <span className="text-[#FFFFFF]">Buy Now</span>
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
