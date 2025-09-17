import { DiJava } from "react-icons/di";
import React from 'react';
import { Tabs } from 'antd';
const Home = () => {
    const categories = [
        { id: 1, name: "Phones", img: "/F14.png" },
        { id: 2, name: "Phones", img: "/F14.png" },
        { id: 3, name: "Phones", img: "/F14.png" },
        { id: 4, name: "Phones", img: "/F14.png" },
        { id: 5, name: "Phones", img: "/F14.png" },
        { id: 6, name: "Phones", img: "/F14.png" },
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
    // layout col-6
    const product = [
        {
            id: 1,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: true,

        },
        {
            id: 2,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: true,

        },
        {
            id: 3,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        },
        {
            id: 4,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        },
        {
            id: 5,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        },
        {
            id: 6,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        },
        {
            id: 7,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        },
        {
            id: 8,
            name: "Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)",
            price: "$900",
            img: "/F15.png",
            like: false,

        }



    ]
    const product2 = [
        {
            id: 1,
            title: "Popular Products",
            desc: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
            img: "/F16.png",
            img2: "/F17.png",
            style: "light"
        },
        {
            id: 2,
            title: "Ipad Pro",
            desc: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use..",
            img: "/F19.png",
            style: "light"
        },
        {
            id: 3,
            title: "SamSung Galaxy",
            desc: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
            img: "/F18.png",
            style: "muted"
        },
        {
            id: 4,
            title: "Macbook Pro",
            desc: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
            img: "/F12.png",
            style: "dark"
        }
    ]
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
            <div className="bg-[#0F0F10] text-white px-[160px]">
                <div className="  grid grid-cols-2 items-center">
                    <div className="">
                        <p className="text-gray-400 text-[25px] opacity-[40%]">Pro.Beyond.</p>
                        <h1 className="text-[96px] font-light">
                            IPhone 14 <span className="font-semibold">Pro</span>
                        </h1>
                        <p className="text-gray-400 text-[18px] mb-[24px] ">
                            Created to change everything for the better. For everyone
                        </p>
                        <button className="px-[56px] py-[16px] border border-white rounded-md hover:bg-white hover:text-black transition">
                            Shop Now
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <img
                            src="./F7.png"
                            alt="iPhone 14 Pro"
                            className="w-[406px] h-[632px] object-contain"
                        />
                    </div>

                </div>
            </div>
            <div className=" grid grid-cols-2 ">
                <div className="">
                    <div className="bg-white grid grid-cols-2 items-center ">
                        <div className="">
                            <img src="/F8.png" alt="Playstation 5" className="w-[513px] h-[343px] " />
                        </div>
                        <div className="space-y-4 px-[48px] py-[112px] ml-[-10%]">
                            <h2 className="text-[48px] font-[500] ">Playstation5</h2>
                            <p className="text-gray-500 text-14px ">
                                Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 ">
                        <div className="bg-[#FFFF] flex">
                            <div className="ml-[-15%]">
                                <img src="/F9.png" alt="AirPods Max" className="w-[245px] h-[272px] object-contain" />
                            </div>
                            <div className="px-[48px] py-[64px]">
                                <h2 className="text-[29px] font-medium">Apple</h2>
                                <h2 className="text-[29px] font-semibold">AirPods <span className="font-bold">Max</span></h2>
                                <p className="text-14px text-gray-400 mt-2">
                                    Computational audio. Listen, it’s powerful
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#1F1F1F] text-white  flex  justify-between">
                            <div className="flex justify-end mt-4">
                                <img src="/F10.png" alt="Vision Pro" className="w-[140px] h-auto object-contain" />
                            </div>
                            <div className=" ml-[16px]">
                                <h2 className="text-[29px] pt-[90px] font-[300]">Apple</h2>
                                <h2 className="text-[29px] font-[300]">Vision Pro</h2>
                                <p className="text-sm text-gray-400 mt-[8px]">
                                    An immersive way to experience entertainment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#F5F5F7] flex items-center overflow-hidden">
                    <div className="ml-[48px]">
                        <h2 className="text-[64px] font-light w-full">
                            Macbook <span className="font-semibold">Air</span>
                        </h2>
                        <p className="text-[14px] gray-600  py-[16px]">
                            The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
                        </p>
                        <button className="px-6 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
                            Shop Now
                        </button>
                    </div>
                    <div className="flex justify-center mr-[-10%]">
                        <img src="/F12.png" alt="Macbook Air" className="w-[682px] h-[468px]  object-contain" />
                    </div>
                </div>
            </div>
            <div className="px-[160px] mt-[80px]">
                <div className="flex justify-between">
                    <h2 className="font-[500] text-[24px]">Browse By Category</h2>
                    <img src="/F13.png" alt="" />
                </div>

                <div className="grid grid-cols-6 gap-6 mt-[32px]">
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center bg-[#EBEBEB] p-6 rounded-xl"
                        >
                            <img src={item.img} alt={item.name} className="w-[40px] h-[40px]" />
                            <p className="mt-[8px]  font-[500] text-[14px]">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-[160px] p-[40px]">
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
            <div className="px-[160px] py-[40px]">
                <div className="grid grid-cols-4 items-center gap-[16px] ">
                    {product.map((item) => (
                        <div key={item.id} className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] ">
                            <div className="relative px-[54px] ">
                                <img src={item.img} alt="" className="w-[160px] h-[160px]" />
                                <span className="absolute top-[-35px] right-9">
                                    {item.like ? (
                                        <i className="fa-solid fa-heart text-red-500"></i>

                                    ) : (
                                        <i className="fa-regular fa-heart"></i>
                                    )}
                                </span>

                            </div>
                            <div className="mb-[24px]">
                                <p className="pt-[16px] font-[500] text-center px-[16px]">{item.name}</p>
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
            <div className=" py-[40px]" >
                <div className="grid grid-cols-1 md:grid-cols-4 ">
                    {product2.map((p) => {
                        const isDark = p.style === "dark";
                        const cardBg = isDark ? "bg-[#111218] text-white" : p.style === "muted" ? "bg-[#E4E4E4] text-black" : "bg-white text-black";

                        return (
                            <div
                                key={p.id}
                                className={`${cardBg}  overflow-visible shadow-sm flex flex-col`}
                            >
                                {/* IMAGE AREA */}
                                {p.id === 1 && p.img && p.img2 ? (
                                    <div className="relative h-[280px] bg-covers  flex items-center ">
                                        <img
                                            src={p.img2}
                                            className="absolute   w-[420px]  object-cover top-0  "
                                        />
                                        <img
                                            src={p.img}
                                            className="absolute right-0 top-4  w-[213px] h-[243px]  object-cover  "
                                        />
                                    </div>
                                ) : p.id === 3 ? (
                                    <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="object-contain h-[240px] w-auto"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative h-[280px] flex items-center justify-end overflow-hidden">
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="object-contain h-full  w-auto"
                                        />
                                    </div>
                                )}


                                {/* TEXT AREA */}
                                <div className="pl-[32px]   py-6  flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <p className=" font-[300] text-[32px] whitespace-nowrap">{p.title}</p>
                                        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} `}>
                                            {p.desc}
                                        </p>
                                    </div>

                                    {/* BUTTON */}
                                    <div className="mt-6">
                                        <button
                                            className={`rounded-md px-6 py-3 border transition-all duration-150 ${isDark
                                                ? "border-white text-white hover:bg-white hover:text-black"
                                                : "border-gray-300 text-black hover:bg-black hover:text-white"
                                                }`}
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="px-[160px] py-[40px]">
                <div className="text-[24px] font-[500] font-SF Pro Display">
                    Discounts up to -50%
                </div>
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
            <div className=" relative bg-gradient-to-r from-[#2E2E2E] to-[#000000] w-[100%] overflow-hidden">
                <div className="flex-col text-center pt-[159px] pb-[90px] ">
                    <div className="text-[72px] font-light text-[#FFFF]">
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
                        className="absolute left-60 top-[-50px]  w-[337px] h-[181px]"
                    />
                    <img
                        src="/F23.png"
                        alt="Tablet"
                        className="absolute left-10 top-[0px] z-10  w-[237px] h-[192px] bg-cover"
                    />
                    <img
                        src="/F24.png"
                        alt=""
                        className="absolute left-0 top-[35%]  w-[418px] h-[262px] bg-cover"
                    />
                    <img
                        src="/F22.png"
                        alt=""
                        className="absolute right-0 top-[0px]  w-[120px] h-[365px] bg-cover"
                    />
                    <img
                        src="/F21.png"
                        alt=""
                        className="absolute right-0 bottom-[-15%]  w-[404px] h-[321px] bg-cover"
                    />
                </div>
            </div>
        </>
    )
}
export default Home;