import { Breadcrumb } from 'antd';
import React, { useState } from "react";
import { Pagination } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ProductPage = () => {
    const [price, setPrice] = useState([0, 2000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState([]);
    const [search, setSearch] = useState("");
    const [searchMemory, setSearchMemory] = useState("");
    const [current, setCurrent] = useState(3);
    const brandsData = [
        { id: 1, name: "Apple", count: 110 },
        { id: 2, name: "Samsung", count: 125 },
        { id: 3, name: "Xiaomi", count: 68 },
        { id: 4, name: "Poco", count: 44 },
        { id: 5, name: "OPPO", count: 36 },
        { id: 6, name: "Honor", count: 10 },
        { id: 7, name: "Motorola", count: 34 },
        { id: 8, name: "Nokia", count: 22 },
        { id: 9, name: "Realme", count: 35 },
    ];
    const filter = [
        { id: 1, name: "Protection class" },
        { id: 2, name: "Screen diagonal" },
        { id: 3, name: "Screen type" },
        { id: 4, name: "Battery capacity" },
    ];

    const MemoryData = [
        { id: 1, name: "16GB", count: 65 },
        { id: 2, name: "32GB", count: 123 },
        { id: 3, name: "64GB", count: 48 },
        { id: 4, name: "128GB", count: 50 },
        { id: 5, name: "256GB", count: 24 },
        { id: 6, name: "512GB", count: 8 },
    ];
    const Phone = [
        { id: 1, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 2, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 3, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 4, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 5, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 6, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 7, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 8, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },
        { id: 9, img: "/F15.png", title: "Apple iPhone 11 128GB White (MQ233)", price: "$510", liked: false },

    ]
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const onChange = page => {
        console.log(page);
        setCurrent(page);
    }

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };


    const toggleMemory = (memory) => {
        if (selectedMemory.includes(memory)) {
            setSelectedMemory(selectedMemory.filter((m) => m !== memory));
        } else {
            setSelectedMemory([...selectedMemory, memory]);
        }
    };

    return (
        <>
            <div className="md:px-[10px] lg:px-[160px] p-[40px]  flex">
                {/* layout1 */}
                <div className='hidden md:block w-[25%]'>
                    <div className="py-[20px]">
                        <div style={{ padding: "20px" }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>Catalog</Breadcrumb.Item>
                                <Breadcrumb.Item>Smartphones</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>

                    <div className="  md:bg-white p-2 ">
                        {/* PRICE */}
                        <div className="border-b border-[#DFDFDF] pb-4 mb-4">
                            <h3 className="text-[18px] flex justify-between items-center cursor-pointer pb-[16px] ">
                                Price <span className="ml-[80%]"><FontAwesomeIcon icon={faChevronUp} className="text-gray-600" /></span>
                            </h3>
                            <div className="border-b border-[#DFDFDF] mb-[20px] "></div>
                            <div className="flex items-center gap-2 mt-[12px] mb-[24px]">
                                <input
                                    type="number"
                                    className="w-[50%] border border-[#DFDFDF] py-[8px] pl-[8px] text-sm"
                                    value={price[0]}
                                    onChange={(e) => setPrice([+e.target.value, price[1]])}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="w-[50%] border border-[#DFDFDF] py-[8px] pl-[8px] text-sm"
                                    value={price[1]}
                                    onChange={(e) => setPrice([price[0], +e.target.value])}
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                value={price[0]}
                                onChange={(e) => setPrice([+e.target.value, price[1]])}
                                className="w-full mt-4 accent-black mb-[24px]"
                            />
                        </div>

                        {/* BRAND */}
                        <div className="border-b border-[#DFDFDF] pb-4 mb-4">
                            <h3 className="text-[18px] font-[500] py-[12px] flex justify-between items-center cursor-pointer">
                                Brand <span> <FontAwesomeIcon icon={faChevronUp} className="text-gray-600" /></span>
                            </h3>
                            <div className="border-b border-[#DFDFDF] mb-[20px]"></div>
                            <div className="flex justify-center py-[5px] mb-[15px]">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-[90%] bg-[#F5F5F5] rounded px-2 py-[11px] text-sm"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
                                {brandsData
                                    .filter((b) =>
                                        b.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((brand) => (
                                        <label
                                            key={brand.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand.name)}
                                                onChange={() => toggleBrand(brand.name)}
                                                className="w-4 h-4"
                                            />
                                            <span>{brand.name}</span>
                                            <span className="text-gray-500">{brand.count}</span>
                                        </label>
                                    ))}
                            </div>
                        </div>

                        {/* MEMORY */}
                        <div className="border-b border-[#DFDFDF] pb-4 mb-4">
                            <h3 className="text-[18px] font-[500] py-[12px] flex justify-between items-center cursor-pointer">
                                Memory <span><FontAwesomeIcon icon={faChevronUp} className="text-gray-600" /></span>
                            </h3>
                            <div className="border-b border-[#DFDFDF] mb-[20px]"></div>
                            <div className="flex justify-center py-[5px] mb-[15px]">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchMemory}
                                    onChange={(e) => setSearchMemory(e.target.value)}
                                    className="w-[90%] bg-[#F5F5F5] rounded px-2 py-[11px] text-sm"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
                                {MemoryData.filter((m) =>
                                    m.name.toLowerCase().includes(searchMemory.toLowerCase())
                                ).map((memory) => (
                                    <label
                                        key={memory.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMemory.includes(memory.name)}
                                            onChange={() => toggleMemory(memory.name)}
                                            className="w-4 h-4"
                                        />
                                        <span>{memory.name}</span>
                                        <span className="text-gray-500">{memory.count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div>
                                {filter.map((item) => (
                                    <div key={item.id} className="border-b border-[#DFDFDF] w-full py-[24px] flex justify-between">
                                        <span>{item.name}</span>
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className="text-gray-500 w-4 h-4"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* layout2 */}
                <div className='w-[100%] mt-[10%] ml-[32px] '>
                    <div className=' hidden md:flex justify-between items-center'>
                        <p>Seclect Product : <span className='font-[500] text-[20px]'>85</span></p>
                        <div className='relative'>
                            <input type="" className='border border-[#DFDFDF] rounded-[8px] py-[12px] pl-[16px]' placeholder='by rating' />
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="text-gray-500 w-4 h-4 absolute top-[12px] right-5"
                            />
                        </div>
                    </div>
                    {/* Nút lọc và sắp xếp - chỉ hiển thị ở màn hình nhỏ hơn lg */}
                    <div className=" md:hidden justify-between flex gap-4 px-4 py-3 border-b border-gray-200">
                        <button className="flex items-center gap-2 px-[16px] py-[20px] border border-[#CECECE] rounded">
                            <i className="fas fa-sliders-h"></i>
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-[16px] py-[20px] bg-white border border-gray-300 rounded">
                            By rating
                            <i className="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    {/* phone */}
                    <div className='py-[40px]'>
                        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-[16px] mt-[32px]" >
                            {Phone.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] ${index === Phone.length - 1 ? 'hidden md:block' : ''
                                        }`}
                                >
                                    <div className="relative px-[10px] md:px-[20px] lg:px-[30px] xl:px-[54px] flex justify-center">
                                        <img src={item.img} alt="" className="w-[160px] flex  h-[160px] bg-contain" />
                                        <span className="absolute top-[-35px] right-9">
                                            {item.liked ? (
                                                <i className="fa-solid fa-heart text-red-500"></i>
                                            ) : (
                                                <i className="fa-regular fa-heart"></i>
                                            )}
                                        </span>

                                    </div>
                                    <div className="mb-[24px]">
                                        <p className="pt-[16px] font-[500] text-[16px] text-center px-[16px]">{item.title}</p>
                                        <p className="font-[600] text-[24px] text-center">{item.price}</p>
                                        <div className="flex justify-center mt-4">
                                            <button className="bg-black px-[62px] py-[16px] rounded-md hover:bg-[#69AAE8]  ">
                                                <span className="text-[#FFFFFF]">Buy Now</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
            <div className='flex justify-center ml-[15%] '>
                <Pagination current={current} onChange={onChange} total={50} />
            </div>
        </>
    );
};

export default ProductPage;
