const Step1 = () => {
    return (
        <>
            <div className="px-[160px] py-[40px] w-full">
                <div className="flex items-center justify-between   ">
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
                <div className="w-full py-[48px]">

                    <h2 className="text-[20px]  pb-[32px]">
                        Select Address
                    </h2>

                    <div className="flex  justify-between bg-[#F6F6F6] rounded-lg p-4 mb-4">
                        <div className="flex gap-[16px]">
                            <div>
                                <input className="" type="radio" name="address" checked readOnly />
                            </div>
                            {/* Info */}
                            <div>
                                <div className="flex items-center gap-[24px]">
                                    <h3 className="font-[400] text-[18px] text-[#17183B]">2118 Thornridge</h3>
                                    <span className="bg-black text-white text-[12px] px-[8px] py-[4px] rounded-[4px]">
                                        HOME
                                    </span>
                                </div>
                                <p className="text-[16px] text-[#17183B] font-[400]">
                                    2118 Thornridge Cir. Syracuse, Connecticut 35624
                                </p>
                                <p className="text-[16px] text-[]#17183B">(209) 555-0104</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 text-[#17183B]">
                            <i className="fa-solid fa-pen cursor-pointer "></i>
                            <i className="fa-solid fa-xmark cursor-pointer"></i>
                        </div>
                    </div>

                    <div className="flex  justify-between bg-[#F6F6F6] rounded-lg p-4 mb-4">
                        <div className="flex gap-[16px]">
                            <div>
                                <input className="" type="radio" name="address" checked readOnly />
                            </div>

                            <div>
                                <div className="flex items-center gap-[24px]">
                                    <h3 className="font-[400] text-[18px] text-[#17183B]">Headoffice</h3>
                                    <span className="bg-black text-white text-[12px] px-[8px] py-[4px] rounded-[4px]">
                                        office                                    </span>
                                </div>
                                <p className="text-[16px] text-[#17183B] font-[400]">
                                    2715 Ash Dr. San Jose, South Dakota 83475                                </p>
                                <p className="text-[16px] text-[]#17183B">(704) 555-0127</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#17183B]">
                            <i className="fa-solid fa-pen cursor-pointer "></i>
                            <i className="fa-solid fa-xmark cursor-pointer"></i>
                        </div>
                    </div>
                    {/* Add new address */}
                    <div className="border-t relative border-dashed  mt-[48px] flex flex-col items-center">
                        <button className="flex items-center justify-center gap-2 text-gray-800 text-sm font-medium">
                            <span className=" absolute bottom-13  flex items-center justify-center rounded-full ">
                                <img className="w-[24px] h-[24px]" src="./F33.png" alt="" />
                            </span>
                            <div>
                                <p className="pt-[30px] text-[16px] font-[400]">Add New Address</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="flex gap-[24px] justify-end ">
                    <button className="rounded-[8px] px-[86px] py-[24px] !border-black border-[1px]  !text-black">Back</button>
                    <button className="rounded-[8px] px-[86px] py-[24px] bg-black !text-white">Next</button>
                </div>
            </div>
        </>
    )
}
export default Step1