import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { createPaymentApi } from '../api/payment'
import { API_CONFIG, getAuthToken, getAuthHeaders } from '../config/api'
import '../styles/index.css'

const Checkout = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)

  // Form state
  const [form, setForm] = useState({
    // Shipping Address
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    shippingNote: '',
    // Payment
    paymentMethod: 'COD',
    // Order
    note: '',
  })

  // Order summary - tính toán từ cart items
  const [orderSummary, setOrderSummary] = useState({
    shippingFee: 30000,
    discount: 0,
    subtotal: 0,
  })

  // Fetch giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setCartLoading(true)
        const token = getAuthToken()
        if (!token) {
          toast.error('Bạn cần đăng nhập để thanh toán!')
          navigate('/')
          return
        }

        const response = await fetch(API_CONFIG.CART_API, {
          method: 'GET',
          headers: getAuthHeaders(false)
        })

        if (!response.ok) {
          if (response.status === 404) {
            setCartItems([])
            setCartLoading(false)
            return
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('📦 Cart data from API:', data)

        // Xử lý nhiều format response
        let products = []
        if (Array.isArray(data)) {
          products = data
        } else if (data?.success && data?.data?.items && Array.isArray(data.data.items)) {
          products = data.data.items
        } else if (data?.data?.items && Array.isArray(data.data.items)) {
          products = data.data.items
        } else if (data?.products && Array.isArray(data.products)) {
          products = data.products
        } else if (data?.items && Array.isArray(data.items)) {
          products = data.items
        } else if (data?.data && Array.isArray(data.data)) {
          products = data.data
        }

        // Transform products để có format đúng
        const transformedItems = products.map((item) => {
          const product = item.product || item
          const price = typeof product.price === 'number'
            ? product.price
            : parseFloat(String(product.price || 0).replace(/[^\d]/g, ''))
          const quantity = item.quantity || 1

          return {
            id: item._id || item.id || product._id || product.id,
            title: product.name || product.title || 'Sản phẩm',
            price: price,
            priceFormatted: price.toLocaleString('vi-VN') + ' đ',
            quantity: quantity,
            img: product.image || product.img || product.images?.[0] || '/placeholder.jpg',
            productId: product._id || product.id,
          }
        })

        setCartItems(transformedItems)

        // Tính toán subtotal
        const subtotal = transformedItems.reduce((sum, item) => {
          return sum + (item.price * item.quantity)
        }, 0)

        setOrderSummary(prev => ({
          ...prev,
          subtotal: subtotal,
        }))

        console.log('✅ Cart items loaded:', transformedItems.length, 'items')
        console.log('✅ Subtotal calculated:', subtotal)
      } catch (error) {
        console.error('❌ Error fetching cart:', error)
        toast.error('Không thể tải giỏ hàng. Vui lòng thử lại!')
        setCartItems([])
      } finally {
        setCartLoading(false)
      }
    }

    fetchCart()
  }, [toast, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng!')
      return
    }

    // Validation
    if (!form.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên')
      return
    }
    if (!form.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }
    if (!form.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ')
      return
    }
    if (!form.city.trim()) {
      toast.error('Vui lòng nhập thành phố')
      return
    }
    if (!form.district.trim()) {
      toast.error('Vui lòng nhập quận/huyện')
      return
    }
    if (!form.ward.trim()) {
      toast.error('Vui lòng nhập phường/xã')
      return
    }

    setLoading(true)
    try {
      // Chuẩn bị dữ liệu theo format API yêu cầu
      const paymentData = {
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          ward: form.ward.trim(),
          note: form.shippingNote.trim() || '',
        },
        paymentMethod: form.paymentMethod,
        shippingFee: orderSummary.shippingFee,
        discount: orderSummary.discount,
        note: form.note.trim() || '',
      }

      console.log('📤 Sending payment request:', paymentData)

      const data = await createPaymentApi(paymentData)

      console.log('✅ Payment successful:', data)

      // Hiển thị thông báo thành công màu xanh
      toast.success('Thanh toán đặt hàng thành công!')

      // Reset form sau khi thanh toán thành công
      setForm({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        shippingNote: '',
        paymentMethod: 'COD',
        note: '',
      })
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại!'
      console.error('❌ Lỗi thanh toán:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Sử dụng cartItems thay vì orderItems hardcode
  const orderItems = cartItems

  const totalAmount = orderSummary.subtotal + orderSummary.shippingFee - orderSummary.discount

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left - Checkout Form */}
        <div className="w-full lg:w-[65%]">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Thanh toán</h2>

            <form onSubmit={handleSubmit}>
              {/* 1. Thông tin giao hàng */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Thông tin giao hàng
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập họ tên"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập số điện thoại"
                        required
                        pattern="[0-9]{10,11}"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ví dụ: Hà Nội"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ví dụ: Quận Ba Đình"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ví dụ: Phường Trúc Bạch"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú giao hàng
                    </label>
                    <textarea
                      name="shippingNote"
                      value={form.shippingNote}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Ví dụ: Giao hàng giờ hành chính"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Phương thức thanh toán */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Phương thức thanh toán
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                      <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={form.paymentMethod === 'BANK_TRANSFER'}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                      <p className="text-sm text-gray-500">Chuyển khoản qua tài khoản ngân hàng</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="E_WALLET"
                      checked={form.paymentMethod === 'E_WALLET'}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">Ví điện tử</span>
                      <p className="text-sm text-gray-500">Thanh toán qua ví điện tử (MoMo, ZaloPay, ...)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Ghi chú đơn hàng */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Ghi chú đơn hàng (tùy chọn)
                </h3>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Ví dụ: Giao hàng nhanh, vui lòng gọi trước khi giao"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-credit-card"></i>
                      <span>Thanh toán</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-white rounded-xl border border-gray-200 py-6 px-6 shadow-lg sticky top-4">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Đơn hàng của bạn</h3>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cartLoading ? (
                <div className="text-center py-4 text-gray-500">Đang tải giỏ hàng...</div>
              ) : orderItems.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Giỏ hàng trống</div>
              ) : (
                orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {item.priceFormatted || item.price}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-medium">{orderSummary.subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="font-medium text-green-600">{orderSummary.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá:</span>
                <span className="font-medium text-red-600">-{orderSummary.discount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Button Tiếp tục mua sắm */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/home')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Tiếp tục mua sắm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
