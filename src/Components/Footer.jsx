const Footer = () => {
    return (
        <>
            <footer className="bg-black text-white px-[160px] py-[104px]">
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
            </footer>
        </>
    )
}
export default Footer