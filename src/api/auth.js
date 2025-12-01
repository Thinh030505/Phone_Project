import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const loginApi = async ({ email, password }) => {
  const url = `${API_BASE_URL}/auth/login`;
  
  // Log để debug
  console.log('Calling login API:', url);
  console.log('Request data:', { email: email.trim(), password: '***' });
  
  try {
    const response = await axios.post(
      url,
      {
        email: email.trim(),
        password: password.trim(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500; // Chấp nhận status < 500 để xử lý lỗi 400
        },
      }
    );
    
    console.log('Login API Response:', {
      status: response.status,
      data: response.data,
    });
    
    // Kiểm tra nếu response có lỗi
    if (response.status >= 400) {
      const error = new Error(response.data?.message || response.data?.error || 'Đăng nhập thất bại');
      error.response = response;
      throw error;
    }
    
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Login API Error:', {
      url: url,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: error.config?.data,
    });
    throw error;
  }
};

export const registerApi = async ({ name, email, password, phone, avatar }) => {
  const url = `${API_BASE_URL}/auth/register`;
  
  // Chuẩn bị request data
  const requestData = {
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
    phone: phone.trim(),
    role: 'USER', // Tất cả user đăng ký đều là USER, admin chỉ tạo trực tiếp
  };

  // Thêm avatar nếu có - đảm bảo format đúng như database yêu cầu
  if (avatar) {
    if (typeof avatar === 'object' && avatar.base64) {
      // Avatar có đầy đủ thông tin (base64 + metadata)
      // Gửi avatar là base64 string
      requestData.avatar = avatar.base64;
      
      // Gửi avatarInfo là object chứa đầy đủ metadata
      // Đảm bảo có các trường: fileName, fileSize, fileSizeFormatted, fileType, uploadDate, extension
      // Kiểm tra và đảm bảo tất cả giá trị không phải null/undefined
      if (avatar.info) {
        requestData.avatarInfo = {
          fileName: avatar.info.fileName || '',
          fileSize: avatar.info.fileSize || 0,
          fileSizeFormatted: avatar.info.fileSizeFormatted || '0 Bytes',
          fileType: avatar.info.fileType || '',
          extension: avatar.info.extension || '',
          uploadDate: avatar.info.uploadDate || new Date().toISOString(),
        };
        
        // Thêm thông tin bổ sung nếu có
        if (avatar.info.width !== null && avatar.info.width !== undefined) {
          requestData.avatarInfo.width = avatar.info.width;
        }
        if (avatar.info.height !== null && avatar.info.height !== undefined) {
          requestData.avatarInfo.height = avatar.info.height;
        }
        if (avatar.info.aspectRatio) {
          requestData.avatarInfo.aspectRatio = avatar.info.aspectRatio;
        }
        if (avatar.info.base64Length) {
          requestData.avatarInfo.base64Length = avatar.info.base64Length;
        }
        if (avatar.info.mimeType) {
          requestData.avatarInfo.mimeType = avatar.info.mimeType;
        }
      } else {
        // Nếu không có info, tạo object rỗng để backend không bị lỗi
        requestData.avatarInfo = {};
      }
      
      console.log('📤 Sending avatar with full metadata to database:', {
        avatar: requestData.avatar.substring(0, 50) + '...',
        avatarInfo: requestData.avatarInfo,
      });
      console.log('📊 Avatar info details (before sending):', {
        fileName: requestData.avatarInfo?.fileName,
        fileSize: requestData.avatarInfo?.fileSize,
        fileSizeFormatted: requestData.avatarInfo?.fileSizeFormatted,
        fileType: requestData.avatarInfo?.fileType,
        extension: requestData.avatarInfo?.extension,
        uploadDate: requestData.avatarInfo?.uploadDate,
        width: requestData.avatarInfo?.width,
        height: requestData.avatarInfo?.height,
      });
      
      // Verify avatarInfo không có giá trị null/undefined
      const hasValidAvatarInfo = requestData.avatarInfo && 
        requestData.avatarInfo.fileName && 
        requestData.avatarInfo.fileSize > 0;
      
      if (!hasValidAvatarInfo) {
        console.warn('⚠️ AvatarInfo có thể không đầy đủ:', requestData.avatarInfo);
      }
    } else if (typeof avatar === 'string') {
      // Avatar chỉ là base64 string (fallback)
      requestData.avatar = avatar;
      console.log('📤 Sending avatar as base64 string only (no metadata)');
    }
  } else {
    console.log('📤 No avatar will be sent (will use default)');
  }
  
  // Log để debug
  console.log('Calling register API:', url);
  console.log('Request data:', { 
    name: requestData.name, 
    email: requestData.email, 
    phone: requestData.phone, 
    password: '***',
    hasAvatar: !!requestData.avatar,
    avatarType: typeof requestData.avatar,
    avatarLength: requestData.avatar ? requestData.avatar.length : 0,
    hasAvatarInfo: !!requestData.avatarInfo,
  });
  
  try {
    const response = await axios.post(
      url,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: function (status) {
          return status < 500; // Chấp nhận status < 500 để xử lý lỗi 400
        },
      }
    );
    
    console.log('Register API Response:', {
      status: response.status,
      data: response.data,
      userHasAvatar: !!response.data?.user?.avatar,
      avatarLength: response.data?.user?.avatar?.length || 0,
      userHasAvatarInfo: !!response.data?.user?.avatarInfo,
      avatarInfo: response.data?.user?.avatarInfo || null,
    });
    
    // Log chi tiết avatarInfo nếu có
    if (response.data?.user?.avatarInfo) {
      console.log('✅ AvatarInfo đã được lưu vào database:', {
        fileName: response.data.user.avatarInfo.fileName,
        fileSize: response.data.user.avatarInfo.fileSize,
        fileSizeFormatted: response.data.user.avatarInfo.fileSizeFormatted,
        fileType: response.data.user.avatarInfo.fileType,
        extension: response.data.user.avatarInfo.extension,
        uploadDate: response.data.user.avatarInfo.uploadDate,
      });
    }
    
    // Kiểm tra nếu response có lỗi
    if (response.status >= 400) {
      const error = new Error(response.data?.message || response.data?.error || 'Đăng ký thất bại');
      error.response = response;
      throw error;
    }
    
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Register API Error:', {
      url: url,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: error.config?.data ? JSON.parse(error.config.data) : null,
    });
    throw error;
  }
};

