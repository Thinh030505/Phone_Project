import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { getAuthToken, getAuthHeaders } from '../config/api';

const API_BASE = 'http://localhost:5000/api/v1';

const AdminOrderManagement = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Bạn chưa đăng nhập!');
        return;
      }

      const headers = getAuthHeaders(false);

      // Kiểm tra nếu là admin để lấy tất cả đơn hàng
      const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
      const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'Admin' || currentUser?.email === 'admin@gmail.com';

      // Endpoint GET /api/v1/payments
      // Nếu là admin, thêm query param để lấy TẤT CẢ đơn hàng
      // Nếu không phải admin, chỉ lấy đơn hàng của user hiện tại
      let endpoint = `${API_BASE}/payments`;

      // Thêm query param cho admin để lấy tất cả đơn hàng
      if (isAdmin) {
        endpoint = `${API_BASE}/payments?all=true`;
        console.log('🔑 Admin detected - fetching ALL orders');
      } else {
        console.log('👤 Regular user - fetching own orders only');
      }

      console.log('📤 Fetching orders from:', endpoint);
      console.log('📤 Headers:', headers);
      console.log('📤 Is Admin:', isAdmin);
      console.log('📤 Current User:', currentUser);
      console.log('📤 Token:', token ? 'Present' : 'Missing');

      const response = await axios.get(endpoint, {
        headers,
        validateStatus: (status) => status < 500, // Accept 4xx errors for custom handling
      });

      console.log('📥 Orders API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
      });

      if (response.status === 404) {
        const errorMsg = 'Backend chưa có endpoint GET /api/v1/payments.';
        console.error('❌ 404 Error:', errorMsg);
        toast.warning('Backend chưa có endpoint GET cho payments.');
        setOrders([]);
        return;
      }

      if (response.status >= 400) {
        const errorMessage = response.data?.message || response.data?.error || `Lỗi ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      let ordersList = [];

      // Xử lý nhiều format response khác nhau
      // Format 1: {success: true, count: 0, data: Array(0)} - Format mới từ backend
      if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        ordersList = response.data.data;
        console.log('✅ Parsed format: {success, count, data}');
        console.log('📊 Count from API:', response.data.count);
        console.log('📊 Success:', response.data.success);
      }
      // Format 2: Array trực tiếp
      else if (Array.isArray(response.data)) {
        ordersList = response.data;
        console.log('✅ Parsed format: Direct array');
      }
      // Format 3: {data: Array}
      else if (response.data?.data && Array.isArray(response.data.data)) {
        ordersList = response.data.data;
        console.log('✅ Parsed format: {data: Array}');
      }
      // Format 4: {payments: Array}
      else if (response.data?.payments && Array.isArray(response.data.payments)) {
        ordersList = response.data.payments;
        console.log('✅ Parsed format: {payments: Array}');
      }
      // Format 5: {orders: Array}
      else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersList = response.data.orders;
        console.log('✅ Parsed format: {orders: Array}');
      }
      // Format 6: {result: Array}
      else if (response.data?.result && Array.isArray(response.data.result)) {
        ordersList = response.data.result;
        console.log('✅ Parsed format: {result: Array}');
      }
      else {
        console.warn('⚠️ Unexpected response format:', response.data);
        console.warn('⚠️ Response structure:', {
          isArray: Array.isArray(response.data),
          hasData: !!response.data?.data,
          hasSuccess: !!response.data?.success,
          keys: response.data ? Object.keys(response.data) : [],
        });
        ordersList = [];
      }

      console.log('✅ Orders loaded:', ordersList.length);
      console.log('📋 Orders data:', ordersList);
      console.log('📋 First order (if any):', ordersList[0]);

      setOrders(ordersList);

      if (ordersList.length === 0) {
        toast.info('Chưa có đơn hàng nào trong hệ thống');
      } else {
        toast.success(`Đã tải ${ordersList.length} đơn hàng`);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      let errorMessage = 'Không thể tải danh sách đơn hàng!';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Bạn chưa đăng nhập hoặc token đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền truy cập danh sách đơn hàng.';
        } else if (error.response.status === 404) {
          errorMessage = 'Endpoint GET /api/v1/payments không tồn tại.';
        } else {
          errorMessage = error.response.data?.message ||
            error.response.data?.error ||
            `Lỗi ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.';
      } else {
        errorMessage = error.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng.';
      }

      toast.error(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (updatedData) => {
    try {
      setUpdating(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Bạn chưa đăng nhập!');
        return;
      }

      const headers = getAuthHeaders();
      const orderId = editingOrder._id || editingOrder.id;

      // Chuẩn bị data theo format API yêu cầu
      const updatePayload = {};

      // Cập nhật status nếu có
      if (updatedData.status) {
        updatePayload.status = updatedData.status;
      }

      // Cập nhật paymentMethod nếu có
      if (updatedData.paymentMethod) {
        updatePayload.paymentMethod = updatedData.paymentMethod;
      }

      // Cập nhật note nếu có
      if (updatedData.note !== undefined) {
        updatePayload.note = updatedData.note;
      }

      // Cập nhật shippingAddress nếu có
      if (updatedData.shippingAddress) {
        updatePayload.shippingAddress = updatedData.shippingAddress;
      }

      // Cập nhật shippingFee nếu có
      if (updatedData.shippingFee !== undefined) {
        updatePayload.shippingFee = updatedData.shippingFee;
      }

      // Cập nhật discount nếu có
      if (updatedData.discount !== undefined) {
        updatePayload.discount = updatedData.discount;
      }

      // Cập nhật items nếu có (sẽ tự tính lại subtotal và total)
      if (updatedData.items) {
        updatePayload.items = updatedData.items;
      }

      console.log('📤 Updating order:', orderId);
      console.log('📤 Update payload:', updatePayload);

      const response = await axios.put(
        `${API_BASE}/payments/${orderId}`,
        updatePayload,
        {
          headers,
          validateStatus: (status) => status < 500
        }
      );

      console.log('📥 Update response:', {
        status: response.status,
        data: response.data,
      });

      if (response.status >= 400) {
        const errorMessage = response.data?.message || response.data?.error || 'Không thể cập nhật đơn hàng!';
        throw new Error(errorMessage);
      }

      toast.success('Cập nhật đơn hàng thành công!');
      setIsEditModalOpen(false);
      setEditingOrder(null);
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      console.error('❌ Error updating order:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = 'Không thể cập nhật đơn hàng!';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Bạn chưa đăng nhập hoặc token đã hết hạn.';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền cập nhật đơn hàng này hoặc đơn hàng không ở trạng thái có thể cập nhật.';
        } else if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy đơn hàng.';
        } else {
          errorMessage = error.response.data?.message ||
            error.response.data?.error ||
            `Lỗi ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server.';
      } else {
        errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật đơn hàng.';
      }

      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN') + ' đ';
    }
    return price || '0 đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-sync-alt"></i>
          Làm mới
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phương thức</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  // Xử lý nhiều format dữ liệu khác nhau
                  const orderId = order._id || order.id || 'N/A';
                  const customerName =
                    order.shippingAddress?.fullName ||
                    order.customerName ||
                    order.user?.name ||
                    order.user?.fullName ||
                    'N/A';
                  const customerPhone =
                    order.shippingAddress?.phone ||
                    order.phone ||
                    order.user?.phone ||
                    'N/A';
                  const orderDate = order.createdAt || order.createdAtVN || order.date || order.createdAt;
                  const totalAmount = order.totalAmount || order.amount || order.total || 0;
                  const paymentMethod = order.paymentMethod || order.payment_method || 'COD';
                  const status = order.status || order.orderStatus || 'Pending';

                  return (
                    <tr key={orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{typeof orderId === 'string' ? orderId.slice(-8) : String(orderId).slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(orderDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatPrice(totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {paymentMethod}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewDetail(order)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Xem chi tiết"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEdit(order)}
                            className="text-green-600 hover:text-green-800 transition"
                            title="Chỉnh sửa"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && !loading && (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <i className="fa-solid fa-inbox text-4xl mb-4 text-gray-300"></i>
                  <p className="text-lg font-medium">Không có đơn hàng nào</p>
                </div>
                <div className="text-sm text-gray-400 max-w-md mx-auto">
                  <p className="mb-2">API đã hoạt động nhưng chưa có đơn hàng nào.</p>
                  <p className="mb-2">Lưu ý: Endpoint GET /api/v1/payments chỉ trả về đơn hàng của user hiện tại.</p>
                  <p className="mb-2">Nếu bạn là admin và muốn xem tất cả đơn hàng:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Backend cần hỗ trợ query param <code className="bg-gray-100 px-1 rounded">?all=true</code> hoặc <code className="bg-gray-100 px-1 rounded">?admin=true</code></li>
                    <li>Hoặc backend tự động trả về tất cả đơn hàng nếu user là admin</li>
                    <li>Kiểm tra Console để xem response từ API</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Thông tin khách hàng</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Họ tên:</span>{' '}
                    {selectedOrder.shippingAddress?.fullName ||
                      selectedOrder.customerName ||
                      selectedOrder.user?.name ||
                      selectedOrder.user?.fullName ||
                      'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số điện thoại:</span>{' '}
                    {selectedOrder.shippingAddress?.phone ||
                      selectedOrder.phone ||
                      selectedOrder.user?.phone ||
                      'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{' '}
                    {selectedOrder.shippingAddress?.email ||
                      selectedOrder.email ||
                      selectedOrder.user?.email ||
                      'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Địa chỉ:</span>{' '}
                    {[
                      selectedOrder.shippingAddress?.address,
                      selectedOrder.shippingAddress?.ward,
                      selectedOrder.shippingAddress?.district,
                      selectedOrder.shippingAddress?.city,
                      selectedOrder.address,
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Mã đơn:</span>{' '}
                    #{selectedOrder._id?.slice(-8) || selectedOrder.id?.slice(-8) || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ngày đặt:</span>{' '}
                    {formatDate(selectedOrder.createdAt || selectedOrder.createdAtVN || selectedOrder.date)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Trạng thái:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status || selectedOrder.orderStatus)}`}>
                      {selectedOrder.status || selectedOrder.orderStatus || 'Pending'}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Thông tin thanh toán</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Phương thức:</span>{' '}
                    {selectedOrder.paymentMethod || selectedOrder.payment_method || 'COD'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tạm tính:</span>{' '}
                    {formatPrice(selectedOrder.subtotal || selectedOrder.subTotal || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phí vận chuyển:</span>{' '}
                    {formatPrice(selectedOrder.shippingFee || selectedOrder.shipping_fee || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Giảm giá:</span>{' '}
                    {formatPrice(selectedOrder.discount || 0)}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="font-medium">Tổng cộng:</span>{' '}
                    {formatPrice(
                      selectedOrder.totalAmount ||
                      selectedOrder.amount ||
                      selectedOrder.total ||
                      0
                    )}
                  </p>
                </div>
              </div>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sản phẩm</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{item.name || item.productName || 'Sản phẩm'}</p>
                          <p className="text-xs text-gray-500">Số lượng: {item.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedOrder.note || selectedOrder.shippingNote) && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ghi chú</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedOrder.note || selectedOrder.shippingNote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && editingOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            if (!updating) {
              setIsEditModalOpen(false);
              setEditingOrder(null);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa đơn hàng</h3>
                <button
                  onClick={() => {
                    if (!updating) {
                      setIsEditModalOpen(false);
                      setEditingOrder(null);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={updating}
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái đơn hàng
                </label>
                <select
                  value={editingOrder.status || editingOrder.orderStatus || 'Pending'}
                  onChange={(e) => {
                    setEditingOrder({
                      ...editingOrder,
                      status: e.target.value,
                      orderStatus: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Đang chờ xử lý (Pending)</option>
                  <option value="Processing">Đang xử lý (Processing)</option>
                  <option value="Confirmed">Đã xác nhận (Confirmed)</option>
                  <option value="Shipped">Đã giao hàng (Shipped)</option>
                  <option value="Delivered">Đã nhận hàng (Delivered)</option>
                  <option value="Completed">Hoàn thành (Completed)</option>
                  <option value="Cancelled">Đã hủy (Cancelled)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Lưu ý: Chỉ có thể cập nhật khi đơn hàng ở trạng thái Pending hoặc Confirmed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  value={editingOrder.paymentMethod || editingOrder.payment_method || 'COD'}
                  onChange={(e) => {
                    setEditingOrder({
                      ...editingOrder,
                      paymentMethod: e.target.value,
                      payment_method: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="E_WALLET">Ví điện tử</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phí vận chuyển (VND)
                </label>
                <input
                  type="number"
                  value={editingOrder.shippingFee || editingOrder.shipping_fee || 0}
                  onChange={(e) => {
                    setEditingOrder({
                      ...editingOrder,
                      shippingFee: parseInt(e.target.value) || 0,
                      shipping_fee: parseInt(e.target.value) || 0,
                    });
                  }}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập phí vận chuyển"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm giá (VND)
                </label>
                <input
                  type="number"
                  value={editingOrder.discount || 0}
                  onChange={(e) => {
                    setEditingOrder({
                      ...editingOrder,
                      discount: parseInt(e.target.value) || 0,
                    });
                  }}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền giảm giá"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={editingOrder.note || editingOrder.shippingNote || ''}
                  onChange={(e) => {
                    setEditingOrder({
                      ...editingOrder,
                      note: e.target.value,
                    });
                  }}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ghi chú cho đơn hàng..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  if (!updating) {
                    setIsEditModalOpen(false);
                    setEditingOrder(null);
                  }
                }}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const updateData = {
                    status: editingOrder.status || editingOrder.orderStatus,
                    paymentMethod: editingOrder.paymentMethod || editingOrder.payment_method,
                    shippingFee: editingOrder.shippingFee || editingOrder.shipping_fee,
                    discount: editingOrder.discount,
                    note: editingOrder.note,
                  };
                  handleUpdateOrder(updateData);
                }}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;

