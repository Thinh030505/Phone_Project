import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { registerApi } from '../api/auth'

// Logo - Sử dụng file Logo.jpg từ thư mục public
const Logo = '/Logo.jpg'

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarInfo, setAvatarInfo] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const beforeUpload = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ được tải lên file ảnh!')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)
    setAvatarFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result

      // Tạo Image object để lấy dimensions
      const img = new Image()
      img.onload = () => {
        // Lưu thông tin đầy đủ về ảnh (đúng format như database yêu cầu)
        const info = {
          // Thông tin file cơ bản (bắt buộc)
          fileName: file.name,
          fileSize: file.size, // Số bytes (number)
          fileSizeFormatted: formatFileSize(file.size), // String như "3.2 MB"
          fileType: file.type, // MIME type như "image/jpeg"
          extension: file.name.split('.').pop().toLowerCase(), // "jpg", "png", etc.
          uploadDate: new Date().toISOString(), // ISO 8601 format

          // Thông tin bổ sung
          base64Length: base64String.length,
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2),
        }

        setAvatarInfo(info)
        setAvatarUrl(base64String)
        URL.revokeObjectURL(objectUrl)

        console.log('✅ Avatar file loaded and converted to base64!')
        console.log('📊 Avatar info đầy đủ:', info)

        toast.success(
          `Tải ảnh thành công! (${info.fileName}, ${info.fileSizeFormatted}, ${info.width}x${info.height}px)`
        )
      }

      img.onerror = () => {
        // Nếu không đọc được dimensions, vẫn lưu thông tin cơ bản
        const info = {
          fileName: file.name,
          fileSize: file.size,
          fileSizeFormatted: formatFileSize(file.size),
          fileType: file.type,
          extension: file.name.split('.').pop().toLowerCase(),
          uploadDate: new Date().toISOString(),
          base64Length: base64String.length,
          width: null,
          height: null,
          aspectRatio: null,
        }

        setAvatarInfo(info)
        setAvatarUrl(base64String)
        URL.revokeObjectURL(objectUrl)

        console.warn('⚠️ Could not read image dimensions, but file info saved')
        toast.success(`Tải ảnh thành công! (${info.fileName}, ${info.fileSizeFormatted})`)
      }

      img.src = base64String
    }
    reader.onerror = () => {
      toast.error('Lỗi khi đọc file ảnh!')
      URL.revokeObjectURL(objectUrl)
    }
    reader.readAsDataURL(file)
  }

  const onFinish = async () => {
    // Validation
    if (!form.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên')
      return
    }
    if (!form.email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }
    if (!form.password.trim() || form.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (!form.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }

    setLoading(true)
    try {
      // Chuẩn bị avatar data với đầy đủ thông tin
      let avatarToSend = null
      if (avatarUrl?.startsWith('data:image')) {
        if (avatarInfo) {
          // Gửi cả base64 và metadata đầy đủ
          avatarToSend = {
            base64: avatarUrl,
            info: avatarInfo,
          }
          console.log('📤 Avatar data sẽ được gửi đến API:', {
            avatar: avatarUrl.substring(0, 50) + '...',
            avatarInfo: avatarInfo,
          })
        } else {
          // Fallback: chỉ gửi base64
          avatarToSend = avatarUrl
          console.warn('⚠️ Avatar sẽ được gửi nhưng thiếu thông tin metadata')
        }
      }

      const data = await registerApi({
        name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        phone: form.phone.trim(),
        avatar: avatarToSend,
      })

      const { token, user } = data

      // Lưu token
      localStorage.setItem('access_token', token)

      // Tạo user object nhỏ gọn KHÔNG chứa avatar base64 để tránh QuotaExceededError
      // Avatar đã được lưu vào database, sẽ lấy từ API khi cần
      const userWithoutLargeAvatar = {
        _id: user._id || user.id,
        name: user.name || user.fullName,
        fullName: user.fullName || user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAtVN: user.createdAtVN,
        updatedAtVN: user.updatedAtVN,
        // Giữ avatarInfo (metadata) vì nó nhỏ
        avatarInfo: user.avatarInfo || null,
        // KHÔNG lưu avatar base64 vì quá lớn (4.4MB+)
        // Chỉ lưu URL nếu có (không phải base64)
        avatar: user.avatar && !user.avatar.startsWith('data:image')
          ? user.avatar
          : null,
      }

      try {
        localStorage.setItem('current_user', JSON.stringify(userWithoutLargeAvatar))
        console.log('✅ User data saved to localStorage (without large avatar base64):', {
          userId: userWithoutLargeAvatar._id,
          email: userWithoutLargeAvatar.email,
          hasAvatarInfo: !!userWithoutLargeAvatar.avatarInfo,
          avatarInfo: userWithoutLargeAvatar.avatarInfo,
        })
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          console.error('❌ localStorage quota exceeded. Trying to clear old data...')
          try {
            // Thử xóa một số key cũ
            localStorage.removeItem('user_avatars')
            localStorage.setItem('current_user', JSON.stringify(userWithoutLargeAvatar))
            console.log('✅ Retry successful after clearing old data')
          } catch (retryError) {
            console.error('❌ Still failed after cleanup. User data too large.')
            toast.warning('Lưu thông tin người dùng thất bại do bộ nhớ đầy. Đăng nhập vẫn thành công.')
          }
        } else {
          throw storageError
        }
      }

      console.log('✅ User đã được tạo với avatar từ database:', {
        userId: user?._id || user?.id,
        hasAvatar: !!user?.avatar,
        hasAvatarInfo: !!user?.avatarInfo,
        avatarInfo: user?.avatarInfo || null,
      })

      // Hiển thị thông báo thành công màu xanh trong 3 giây
      toast.success('Đăng ký thành công!')

      // Chờ 3 giây rồi mới chuyển trang
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!'
      console.error('❌ Lỗi đăng ký:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-8 py-4">
        <div className="mb-3">
          <img src={Logo} alt="Logo" className="w-20 h-20 object-contain opacity-90" />
        </div>

        <div className="w-[420px] p-6 rounded-xl bg-transparent  shadow-2xl border border-white/20">
          <h2 className="text-center text-2xl font-bold mb-6 text-white drop-shadow-lg">
            Đăng Ký
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); onFinish() }} className="px-[20px]">
            {/* Avatar Upload Section */}
            <div className="flex justify-center mb-5">
              <div className="flex flex-col items-center gap-3">
                <label className="cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => beforeUpload(e.target.files[0])}
                  />
                  {avatarUrl ? (
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden relative bg-gray-200 shadow-lg ring-2 ring-white/50 ring-offset-2 ring-offset-transparent group-hover:ring-white transition-all">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Thay đổi</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[80px] h-[80px] flex items-center justify-center border-2 border-dashed border-white/60 rounded-full hover:border-white hover:bg-white/10 transition-all shadow-lg">
                      <i className="fa-solid fa-user-plus text-white text-xl"></i>
                    </div>
                  )}
                </label>
                <p className="text-white/80 text-xs text-center font-medium">
                  Ảnh đại diện (không giới hạn kích thước)
                </p>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-5">
              <div>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Họ tên"
                  className="w-full px-4 py-3 rounded-lg bg-white/95 border border-white/40 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all shadow-sm hover:bg-white"
                  required
                />
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/95 border border-white/40 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all shadow-sm hover:bg-white"
                  required
                />
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 rounded-lg bg-white/95 border border-white/40 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all shadow-sm hover:bg-white"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-3 rounded-lg bg-white/95 border border-white/40 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all shadow-sm hover:bg-white"
                  required
                  pattern="[0-9]{10,11}"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                  <span>Đăng Ký</span>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 px-[20px]">
            <a
              href="/"
              className="text-white/90 hover:text-white hover:underline text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              <span>Đã có tài khoản?</span>
              <span className="text-blue-300 font-semibold">Đăng nhập</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
