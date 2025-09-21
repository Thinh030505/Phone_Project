import React from 'react';
import { Tabs } from 'antd';
const Step3 = () => {
    const onChange = key => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Credit Card',

        },
        {
            key: '2',
            label: ' PayPal',

        },
        {
            key: '3',
            label: 'PayPal Credit',
        },
    ];
    return (
        <>
            <div className="px-[160px] py-[40px] w-full">
                <div className="flex items-center justify-between  py-[72px] ">
                    {/* Step 1 */}
                    <div className="flex items-center gap-[4px] rounded ">
                        <i className="fa-solid fa-location-dot text-black w-[11px] h-[14px] bg-cover"></i>
                        <div className="leading-0 text-black font-[500]">
                            <p className="text-[18] ">Step 1</p>
                            <p className=" text-black">Address</p>
                        </div>
                    </div>

                    <div className="flex-1  border-t border-dashed mx-[70px] opacity-[0.5] border-gray-300 "></div>


                    <div className="flex items-center gap-[4px]  opacity-20">
                        <i className="fa-solid fa-truck"></i>
                        <div className="leading-0">
                            <p className="text-[16px]">Step 2</p>
                            <p className="font-semibold">Shipping</p>
                        </div>
                    </div>


                    <div className="flex-1  border-t border-dashed border-gray-300 mx-[70px] opacity-[0.5]"></div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-[4px]  opacity-20">
                        <i className="fa-solid fa-credit-card"></i>
                        <div className="leading-0">
                            <p className="text-[16px]">Step 3</p>
                            <p className="font-semibold">Payment</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex gap-[96px]">
                    <div className=" bg-white rounded-[8px] w-[50%] border border-gray-200 shadow-sm px-[24px] py-[32px]">
                        <h2 className="text-[20px] font-[500] pb-[24px]">Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between bg-[#F6F6F6] rounded-[13px] p-[16px] ">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/F15.png"
                                        alt="iPhone"
                                        className="w-[40px] h-[40px] object-cover"
                                    />
                                    <span className="text-[16px] font-[500]">
                                        Apple iPhone 14 Pro Max 128Gb
                                    </span>
                                </div>
                                <span className="font-[600]">$1399</span>
                            </div>
                            <div className="flex items-center justify-between bg-[#F6F6F6] rounded-[13px] p-[16px] ">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/F15.png"
                                        alt="iPhone"
                                        className="w-[40px] h-[40px] object-cover"
                                    />
                                    <span className="text-[16px] font-[500]">
                                        Apple iPhone 14 Pro Max 128Gb
                                    </span>
                                </div>
                                <span className="font-[600]">$1399</span>
                            </div>

                            <div className="flex items-center justify-between bg-[#F6F6F6] rounded-[13px] p-[16px] ">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/F15.png"
                                        alt="iPhone"
                                        className="w-[40px] h-[40px] object-cover"
                                    />
                                    <span className="text-[16px] font-[500]">
                                        Apple iPhone 14 Pro Max 128Gb
                                    </span>
                                </div>
                                <span className="font-[600]">$1399</span>
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="text-14px text-[#545454] mb-[8px]">Address</p>
                            <p className="text-[16px] font-[400]">
                                1131 Dusty Townline, Jacksonville, TX 40322
                            </p>
                        </div>
                        <div className="mb-6">
                            <p className="text-[14px] text-[#545454] mb-[8px]">Shipment method</p>
                            <p className="text-[16px] font-[400]">Free</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-[500] text-[16px]">Subtotal</span>
                                <span className="font-medium">$2347</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500">
                                <span className="font-[400] text-[16px]">Estimated Tax</span>
                                <span className="font-[500] text-black text-[16px]">$50</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500">
                                <span className="font-[400]  text-[16px]">Estimated shipping & Handling</span>
                                <span className="font-[500] text-black text-[16px]">$29</span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-4">
                                <span className="font-[500] text-[16px]">Total</span>
                                <span className="font-[500] text-black text-[16px]">$2426</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 ">
                        {/* Title */}
                        <h2 className="text-[20px] font-[600] mb-[24px]">Payment</h2>

                        {/* Tabs */}
                        <div className="py-[48px]">
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </div>
                        <div className="pb-[40px]">
                            <img className='w-[337px] h-[188px] bg-cover' src="./F34.png" alt="" />
                        </div>

                        {/* Form */}
                        <form className="">
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                className="w-full border  border-[#CECECE] rounded-lg p-[16px] text-sm "
                            />
                            <input
                                type="text"
                                placeholder="Card Number"
                                className="w-full border border-[#CECECE] rounded-lg p-[16px] text-sm  "
                            />

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Exp.Date"
                                    className="w-1/2 border border-[#CECECE]s rounded-lg px-3 py-2 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    className="w-1/2 border border-[#CECECE] rounded-lg px-3 py-2 text-sm "
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="accent-black" />
                                Same as billing address
                            </label>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    className="w-1/2 border border-black rounded-lg py-2 text-sm font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-black text-white rounded-lg py-2 text-sm font-medium"
                                >
                                    Pay
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Step3