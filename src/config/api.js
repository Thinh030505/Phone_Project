// API Configuration
export const API_CONFIG = {
    // Backend Product API
    PRODUCTS_API: 'http://localhost:5000/api/v1/products',
    
    // Backend Cart API
    CART_API: 'http://localhost:5000/api/v1/cart',
    
    // Có thể thêm các API khác ở đây
    // USERS_API: 'http://localhost:5000/api/v1/users',
}

// Helper function để lấy API URL
export const getApiUrl = (endpoint) => {
    return API_CONFIG[endpoint] || endpoint
}

// Helper function để lấy token từ localStorage
export const getAuthToken = () => {
    // Thử các key phổ biến cho token
    return localStorage.getItem('access_token') ||
           localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('accessToken') ||
           localStorage.getItem('jwt') ||
           null;
}

// Helper function để tạo headers với token
export const getAuthHeaders = (includeContentType = true) => {
    const headers = {};
    
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

