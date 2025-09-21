const Footer = () => {
    return (
        <>
            {/* <footer className="bg-black text-white px-[160px] py-[104px]">
                <div className="grid grid-cols-3  w-full ">
                    <div>
                        <img src="./F25.png " alt="" />
                        <p className="text-[14px] font-[500] text-[#CFCFCF] pt-[24px]">
                            We are a residential interior design firm located in Portland. Our
                            boutique-studio offers more than
                        </p>
                        <div className="flex space-x-4  pt-[90px]">
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-tiktok"></i>
                            <i className="fab fa-google"></i>
                        </div>
                    </div>
                    <div className="ml-[112px] ">
                        <h3 className="text-[16px] font-[600] mb-[8] ">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Bonus program</li>
                            <li>Gift cards</li>
                            <li>Credit and payment</li>
                            <li>Service contracts</li>
                            <li>Non-cash account</li>
                            <li>Payment</li>
                        </ul>
                    </div>
                    <div className="ml-[150px]s">
                        <h3 className="text-lg font-semibold mb-4">Assistance to the buyer</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Find an order</li>
                            <li>Terms of delivery</li>
                            <li>Exchange and return of goods</li>
                            <li>Guarantee</li>
                            <li>Frequently asked questions</li>
                            <li className="italic">Terms of use of the site</li>
                        </ul>
                    </div>
                </div>
            </footer> */}
            <footer className="bg-black text-white px-6 sm:px-12 lg:px-[160px] py-[60px] lg:py-[104px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20 w-full text-center md:text-left">

                    {/* Cột 1 */}
                    <div className="flex flex-col items-center md:items-start">
                        <img src="./F25.png" alt="logo" className="w-[120px] h-auto" />
                        <p className="text-[14px] font-medium text-[#CFCFCF] pt-[20px] leading-relaxed max-w-xs">
                            We are a residential interior design firm located in Portland.
                            Our boutique-studio offers more than
                        </p>
                        <div className="flex space-x-5 pt-[30px]">
                            <i className="fab fa-twitter hover:text-gray-400 transition"></i>
                            <i className="fab fa-facebook hover:text-gray-400 transition"></i>
                            <i className="fab fa-tiktok hover:text-gray-400 transition"></i>
                            <i className="fab fa-google hover:text-gray-400 transition"></i>
                        </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-[16px] font-semibold mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-[#CFCFCF]">
                            <li className="hover:text-white cursor-pointer">Bonus program</li>
                            <li className="hover:text-white cursor-pointer">Gift cards</li>
                            <li className="hover:text-white cursor-pointer">Credit and payment</li>
                            <li className="hover:text-white cursor-pointer">Service contracts</li>
                            <li className="hover:text-white cursor-pointer">Non-cash account</li>
                            <li className="hover:text-white cursor-pointer">Payment</li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-[16px] font-semibold mb-4">Assistance to the buyer</h3>
                        <ul className="space-y-2 text-sm text-[#CFCFCF]">
                            <li className="hover:text-white cursor-pointer">Find an order</li>
                            <li className="hover:text-white cursor-pointer">Terms of delivery</li>
                            <li className="hover:text-white cursor-pointer">Exchange and return of goods</li>
                            <li className="hover:text-white cursor-pointer">Guarantee</li>
                            <li className="hover:text-white cursor-pointer">Frequently asked questions</li>
                            <li className="italic hover:text-white cursor-pointer">Terms of use of the site</li>
                        </ul>
                    </div>

                </div>
            </footer>


        </>
    )
}
export default Footer