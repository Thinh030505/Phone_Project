import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/index.css'
import { API_CONFIG } from '../config/api'

const API_URL = API_CONFIG.PRODUCTS_API

const ProductsApi = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        async function fetchProducts() {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(API_URL, { signal })
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
                const data = await res.json()
                // Xử lý nhiều format response khác nhau
                let list = []
                if (Array.isArray(data)) {
                    list = data
                } else if (data.data && Array.isArray(data.data)) {
                    list = data.data
                } else if (data.products && Array.isArray(data.products)) {
                    list = data.products
                } else if (data.result && Array.isArray(data.result)) {
                    list = data.result
                }
                setProducts(list)
                console.log('✅ Sản phẩm từ API:', list)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('❌ Lỗi khi gọi API:', err)
                    setError(err.message || 'Không thể tải sản phẩm từ API')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
        return () => controller.abort()
    }, [])

    const handleProductClick = (productId) => {
        navigate(`/ProductPage2?id=${productId}`)
    }

    const formatPrice = (price) => {
        if (!price) return '0 đ'
        // Nếu price là số, format thành VND
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN') + ' đ'
        }
        // Nếu price là string, kiểm tra xem đã có đơn vị chưa
        if (typeof price === 'string') {
            if (price.includes('đ') || price.includes('$')) {
                return price
            }
            const numPrice = parseFloat(price.replace(/[^\d]/g, ''))
            if (!isNaN(numPrice)) {
                return numPrice.toLocaleString('vi-VN') + ' đ'
            }
        }
        return price
    }

    return (
        <div className="md:px-[10px] lg:px-[160px] p-[40px] min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Sách từ API Backend</h2>
                <p className="text-gray-600">Danh sách sản phẩm được lấy từ API backend của bạn</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                    <p className="text-gray-500">Đang tải sản phẩm từ API...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Lỗi khi tải dữ liệu</h3>
                            <p className="text-red-600 text-sm">{error}</p>
                            <p className="text-red-500 text-xs mt-2">
                                Vui lòng kiểm tra: API đang chạy tại {API_URL}?
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <i className="fa-solid fa-box-open text-gray-400 text-6xl mb-4"></i>
                            <p className="text-gray-600 text-lg">Không có sản phẩm nào.</p>
                            <p className="text-gray-400 text-sm mt-2">API có thể chưa trả về dữ liệu hoặc format không đúng.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Tìm thấy <span className="font-semibold">{products.length}</span> sản phẩm
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((p, idx) => {
                                    const productId = p.id || p._id || idx + 1
                                    const productName = p.title || p.name || 'Sản phẩm không có tên'
                                    const productImage = p.image || p.img || p.cover || '/V1.jpg'
                                    const productAuthor = p.author || p.brand || ''
                                    const productPrice = p.price || p.priceUsd || 0

                                    return (
                                        <div
                                            key={productId}
                                            className="bg-[#F6F6F6] border-none rounded-[10px] items-center pt-[72px] hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="px-[25px] relative lg:px-[40px] xl:px-[54px]">
                                                <div className="relative overflow-hidden rounded-lg">
                                                    <img
                                                        src={productImage}
                                                        alt={productName}
                                                        className="w-[160px] h-[160px] mx-auto cursor-pointer group-hover:scale-110 transition-transform duration-300 object-contain"
                                                        onClick={() => handleProductClick(productId)}
                                                        onError={(e) => {
                                                            e.target.src = '/V1.jpg'
                                                        }}
                                                    />
                                                </div>
                                                <button className="absolute top-[-35px] right-9 bg-white rounded-full p-2 shadow-md transition-all duration-300 hover:!bg-red-50 hover:scale-110 active:scale-100">
                                                    <i className="fa-regular fa-heart text-gray-400 group-hover:text-red-500"></i>
                                                </button>
                                            </div>
                                            <div className="mb-[24px]">
                                                <p className="pt-[16px] font-[500] text-center px-[16px] line-clamp-2 min-h-[48px]">
                                                    {productName}
                                                </p>
                                                {productAuthor && (
                                                    <p className="text-gray-600 text-sm text-center mt-1">{productAuthor}</p>
                                                )}
                                                <p className="font-[600] text-[24px] text-center text-blue-600 mt-2">
                                                    {formatPrice(productPrice)}
                                                </p>
                                                <div className="flex justify-center mt-4">
                                                    <button
                                                        onClick={() => handleProductClick(productId)}
                                                        className="bg-black px-[62px] py-[16px] rounded-md transition-all duration-300 transform hover:!bg-gray-800 hover:scale-105 active:scale-100"
                                                    >
                                                        <span className="text-[#FFFFFF] font-semibold">Buy Now</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default ProductsApi
