const ShoppingCart = () => {
    const CartItem = [
        {
            id: 1,
            name: "Apple iPhone 14 Pro Max 128Gb",
            detail: "128Gb Deep Purple",
            code: "#25139526913984",
            price: 1399,
            quantity: 1,
            img: "/F15.png"
        },
        {
            id: 2,
            name: "Apple iPhone 14 Pro Max 128Gb",
            detail: "128Gb Deep Purple",
            code: "#25139526913984",
            price: 1399,
            quantity: 1,
            img: "/F15.png"
        },
        {
            id: 3,
            name: "Apple iPhone 14 Pro Max 128Gb",
            detail: "128Gb Deep Purple",
            code: "#25139526913984",
            price: 1399,
            quantity: 1,
            img: "/F15.png"
        }
    ]
    return (
        <>
            <div className="px-[160px] py-[70px] w-[100%] flex gap-[48px]">
                <div className="w-[45%]">
                    <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
                    <div className="flex flex-col gap-6">
                        {CartItem.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center mt-[56px] justify-between border-b border-[#A3A3A3] pb-[61px]"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-[60px] h-[60px] object-cover"
                                    />
                                    <div className="leading-[0.6] items-center pt-[15px] ">
                                        <p className="font-medium text-[16px] ">{item.name}</p>
                                        <p className="font-medium text-[16px] ">{item.detail}</p>
                                        <p className="text-gray-500 text-xs">{item.code}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[20px]">
                                    <button className="px-2 border rounded">-</button>
                                    <span>{item.quantity}</span>
                                    <button className="px-2 border rounded">+</button>
                                    <p className="font-[500] items-center text-[20px] pt-[15px]">${item.price}</p>
                                    <button className="text-gray-500 text-[24px]">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1  bg-white rounded-[10px] border border-[#EBEBEB] py-[56px] px-[64px]">
                    {/* Title */}
                    <h2 className="text-[20px] font-[600] pb-[40px]">Order Summary</h2>

                    {/* Promo Code */}
                    <div className="mt-[8px]">
                        <p className="text-[14px] font-[500] text-[#545454] ">  Discount code / Promo code</p>
                        <input
                            type="text"
                            placeholder="Code"
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-100"
                        />
                    </div>

                    {/* Bonus card with Apply button on right */}
                    <div className="">
                        <div className="relative">
                            <p className="text-[14px] font-[500] text-[#545454] pt-[24px] ">Your bonus card number</p>
                            <input
                                type="text"
                                placeholder="Enter Card Number"
                                className="w-full border border-gray-200 rounded px-[16px] py-[20px] text-[14px] pr-24"
                            />
                            <button
                                className="absolute right-[10px] bottom-4  px-3 py-1 border border-gray-300 rounded text-[14pxs] bg-white hover:bg-black hover:!text-white transition"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 mt-[24px] ">
                        <div className="flex justify-between items-center">
                            <span className="text-[16px] font-[700] text-black">Subtotal</span>
                            <span className="font-[500] text-[16px]">$2347</span>
                        </div>

                        <div className="flex justify-between items-center mt-[16px]">
                            <span className="text-sm text-gray-600">Estimated Tax</span>
                            <span className=" font-[500] !text-black">$50</span>
                        </div>

                        <div className="flex justify-between items-center  mt-[16px]">
                            <span className="text-sm text-gray-600">
                                Estimated shipping &amp; Handling
                            </span>
                            <span className="font-[500] !text-black">$29</span>
                        </div>

                        <div className=" mt-[20px]  flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-lg font-bold">$2426</span>
                        </div>
                    </div>
                    <div className="pt-[80px]">
                        <button className=" bg-black w-full !text-white px-[170px] py-[16px] rounded-[6px] text-[14px] font-medium hover:opacity-50 transition">
                            Checkout
                        </button>
                    </div>
                </div>
            </div >
        </>
    )

}
export default ShoppingCart