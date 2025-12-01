import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()

    const handleUserIconClick = () => {
        navigate('/data-user')
    }

    return (
        <div className="w-[100%]">
            <header className="bg-[#4FFFF] px-[50px] sm:py-[16px]  lg:px-[160px] py-[16px]">
                <div className="flex justify-between md:flex items-center sm:justify-between">

                    <div className="flex items-center">
                        <img src="./F1.png" alt="" className="h-10" />
                    </div>


                    <div className="hidden md:block w-[40%]">
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


                    <div className="hidden md:flex gap-[52px] text-gray-600">
                        <a href="/" className="hover:text-purple-500">Home</a>
                        <a href="/about" className="hover:text-purple-500">About</a>
                        <a href="/contact" className="hover:text-purple-500">Contact Us</a>
                        <a href="/blog" className="hover:text-purple-500">Blog</a>
                    </div>


                    <div className="hidden md:flex gap-[24px]">
                        <a href="/wishlist">
                            <img src="./F3.png" alt="Wishlist" />
                        </a>
                        <a href="/cart">
                            <img src="./F4.png" alt="Cart" />
                        </a>
                        <button
                            onClick={handleUserIconClick}
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                            aria-label="User Profile"
                        >
                            <img src="./F5.png" alt="User" />
                        </button>
                    </div>

                    <div className="md:hidden">
                        <i className="fas fa-bars text-2xl text-[#0B0B45]"></i>
                    </div>
                </div>
            </header>
            <div className="bg-[#1F1F1F] text-white w-full  ">
                <div className="hidden   md:flex items-center  justify-between px-[10px]   lg:px-[160px] py-[8px]">
                    <div className="flex items-center px-[20px]  border-r border-gray-600 cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Fiction" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-sm">Tiểu thuyết</span>
                    </div>

                    <div className="flex items-center px-[40px] border-r border-gray-600 cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Bestsellers" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-sm">Bán chạy</span>
                    </div>

                    <div className="flex items-center  px-[40px] border-r border-gray-600 cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="New Releases" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-sm">Mới phát hành</span>
                    </div>


                    <div className="flex items-center px-[40px] border-r border-gray-600 cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Kids" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-sm">Thiếu nhi</span>
                    </div>

                    {/* Academic */}
                    <div className="flex items-center px-[40px] border-r border-gray-600 cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Academic" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-sm">Học thuật</span>
                    </div>

                    {/* Curated */}
                    <div className="flex items-center px-[20px] cursor-pointer category-item hover:scale-105 hover:text-purple-400 transition">
                        <img src="/F6.png" alt="Curated" className="w-5 h-5 object-contain float-slow" />
                        <span className="text-[16px]">Tuyển chọn</span>
                    </div>

                </div>
            </div>
        </div>

    )
}
export default Header;