
const Header = () => {
    return (
        <div className="w-[100%]">
            <header className="bg-[#4FFFF] px-[160px] py-[16px]">
                <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                        <img src="./F1.png" alt="" className="h-10" />
                    </div>
                    <div className="w-[40%] ">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <img
                                src="./F2.png"
                                alt="Search Icon"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                            />
                        </div>
                    </div>

                    <div className="flex gap-[52px] text-gray-600">
                        <a href="/" className="hover:text-purple-500">Home</a>
                        <a href="/about" className="hover:text-purple-500">About</a>
                        <a href="/contact" className="hover:text-purple-500">Contact Us</a>
                        <a href="/blog" className="hover:text-purple-500">Blog</a>
                    </div>

                    <div className="flex gap-[24px]">
                        <a href="/wishlist">
                            <img src="./F3.png" alt="Wishlist" className="" />
                        </a>
                        <a href="/cart">
                            <img src="./F4.png" alt="Cart" className="" />
                        </a>
                        <a href="/profile">
                            <img src="./F5.png" alt="User" className="" />
                        </a>
                    </div>
                </div>
            </header>
            <div className="bg-[#1F1F1F] text-white w-full ">
                <div className="  flex items-center   justify-between   px-[160px] py-[8px]">
                    {/* Phones */}
                    <div className="flex items-center px-[20px]  border-r border-gray-600 cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Phones" className="w-5 h-5 object-contain" />
                        <span className="text-sm">Phones</span>
                    </div>

                    {/* Computers */}
                    <div className="flex items-center px-[50px] border-r border-gray-600 cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Computers" className="w-5 h-5 object-contain" />
                        <span className="text-sm">Computers</span>
                    </div>

                    {/* Smart Watches */}
                    <div className="flex items-center  px-[50px] border-r border-gray-600 cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Smart Watches" className="w-5 h-5 object-contain" />
                        <span className="text-sm">Smart Watches</span>
                    </div>

                    {/* Cameras */}
                    <div className="flex items-center px-[50px] border-r border-gray-600 cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Cameras" className="w-5 h-5 object-contain" />
                        <span className="text-sm">Cameras</span>
                    </div>

                    {/* Headphones */}
                    <div className="flex items-center px-[50px] border-r border-gray-600 cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Headphones" className="w-5 h-5 object-contain" />
                        <span className="text-sm">Headphones</span>
                    </div>

                    {/* Gaming */}
                    <div className="flex items-center px-[20px] cursor-pointer hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Gaming" className="w-5 h-5 object-contain" />
                        <span className="text-[16px]">Gaming</span>
                    </div>

                </div>
            </div>
        </div>

    )
}
export default Header;