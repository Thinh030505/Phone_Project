import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function để lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createPaymentApi = async (paymentData) => {
  const url = `${API_BASE_URL}/payments`;
  
  console.log('Calling payment API:', url);
  console.log('Request data:', {
    ...paymentData,
    shippingAddress: paymentData.shippingAddress,
    paymentMethod: paymentData.paymentMethod,
    shippingFee: paymentData.shippingFee,
    discount: paymentData.discount,
  });
  
  try {
    const headers = getAuthHeader();
    const response = await axios.post(
      url,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        validateStatus: function (status) {
          return status < 500; // Chấp nhận status < 500 để xử lý lỗi 400
        },
      }
    );
    
    console.log('Payment API Response:', {
      status: response.status,
      data: response.data,
    });
    
    // Kiểm tra nếu response có lỗi
    if (response.status >= 400) {
      const error = new Error(response.data?.message || response.data?.error || 'Thanh toán thất bại');
      error.response = response;
      throw error;
    }
    
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Payment API Error:', {
      url: url,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: error.config?.data ? JSON.parse(error.config.data) : null,
    });
    throw error;
  }
};

