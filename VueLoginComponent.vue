<template>
  <div class="relative w-full h-screen flex items-center justify-center overflow-hidden">
    <video
      autoplay
      muted
      loop
      playsinline
      class="w-[100%] h-full object-cover"
    >
      <source
        src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        type="video/mp4"
      />
    </video>
    <div class="absolute z-10 w-full flex flex-col items-center justify-center px-8">
      <!-- Logo phía trên -->
      <div class="mb-8">
        <img :src="Logo" alt="Logo" class="w-32 h-32 object-contain opacity-90" />
      </div>
      <!-- Form đăng nhập -->
      <div class="w-[400px] p-6 rounded-lg bg-transparent shadow-lg">
        <h2 class="text-center text-[30px] font-semibold mb-4 text-white">Đăng Nhập</h2>
        <a-form :model="form" :rules="rules" @finish="onFinish">
          <a-form-item name="email">
            <a-input v-model:value="form.email" class="mb-[20px]" placeholder="Email" />
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="form.password" placeholder="Mật khẩu" />
          </a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            Đăng Nhập
          </a-button>
        </a-form>
        <div class="text-center mt-20">
          <router-link to="/Register" class="text-white underline">Chưa có tài khoản? Đăng ký</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { loginApi } from '../api/auth'
import Logo from '@/assets/images/Logo.png'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email', message: 'Email không hợp lệ' }
  ],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }]
}

const onFinish = async () => {
  loading.value = true
  try {
    const data = await loginApi({
      email: form.email,
      password: form.password
    })

    const { token, user } = data

    // Lưu token với nhiều key để đảm bảo tương thích
    // Key 'token' cho React app
    if (token) {
      localStorage.setItem('token', token)
      // Giữ lại 'access_token' cho Vue app nếu cần
      localStorage.setItem('access_token', token)
      // Các key khác mà React app có thể tìm
      localStorage.setItem('authToken', token)
      localStorage.setItem('accessToken', token)
    }

    // Lưu thông tin user
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user))
      localStorage.setItem('user', JSON.stringify(user))
    }

    message.success('Đăng nhập thành công')

    // Kiểm tra xem có return URL từ React app không
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get('return')
    
    // Nếu có return URL từ React app, redirect về React app
    if (returnUrl) {
      // URL của React app (thay đổi theo port của bạn)
      const reactAppUrl = 'http://localhost:5173'
      window.location.href = `${reactAppUrl}${returnUrl}`
    } else {
      // Nếu không có return URL, kiểm tra xem có đang ở Vue app hay React app
      // Nếu đang ở Vue app, redirect đến trang Data
      // Nếu muốn luôn redirect về React app, dùng dòng dưới
      const reactAppUrl = 'http://localhost:5173' // Thay đổi theo URL React app của bạn
      window.location.href = reactAppUrl
      
      // Hoặc nếu muốn giữ nguyên behavior của Vue app:
      // router.push('/Data')
    }
  } catch (error) {
    message.error(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu')
  } finally {
    loading.value = false
  }
}
</script>

