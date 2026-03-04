import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

interface PaymentRequest {
  productName: string
  description: string
  price: number
  returnUrl: string
  cancelUrl: string
}

const Payment: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentInfo, setPaymentInfo] = useState<PaymentRequest>({
    productName: 'Premium Membership',
    description: 'StudyMate Premium Membership - Unlimited Access',
    price: 199000,
    returnUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
  })

  useEffect(() => {
    // Check token instead of user to avoid race condition
    const token = localStorage.getItem('token')
    if (!token && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPaymentInfo(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Vui lòng đăng nhập để thanh toán')
        navigate('/login')
        return
      }

      const response = await fetch('https://localhost:7259/api/Payment/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentInfo)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Có lỗi xảy ra khi tạo liên kết thanh toán')
      }

      const result = await response.json()
      
      // PayOS will return a payment URL
      if (result.checkoutUrl || result.paymentUrl) {
        // Redirect to PayOS payment page
        window.location.href = result.checkoutUrl || result.paymentUrl
      } else if (result.data?.checkoutUrl || result.data?.paymentUrl) {
        window.location.href = result.data.checkoutUrl || result.data.paymentUrl
      } else {
        throw new Error('Không nhận được URL thanh toán')
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi xử lý thanh toán')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
              <span className="text-xl font-bold text-[#1976d2]">StudyMate</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
                Trang chủ
              </Link>
              {user && (
                <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900">
                  Hồ sơ
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1976d2] to-[#1565c0] px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Thanh toán</h1>
            <p className="text-blue-100 text-sm">
              Sử dụng PayOS để thanh toán an toàn và nhanh chóng
            </p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="px-8 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-slate-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={paymentInfo.productName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={paymentInfo.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
                Số tiền (VNĐ)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={paymentInfo.price}
                onChange={handleInputChange}
                required
                min="1000"
                step="1000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent outline-none transition"
              />
              <p className="mt-2 text-sm text-slate-500">
                Tổng: {paymentInfo.price.toLocaleString('vi-VN')} đ
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Thông tin thanh toán</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Phương thức: PayOS</li>
                <li>• Bảo mật: Mã hóa SSL</li>
                <li>• Hỗ trợ: Chuyển khoản ngân hàng, QR Code</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                disabled={loading}
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  'Thanh toán ngay'
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              🔒 Giao dịch của bạn được bảo mật với công nghệ mã hóa tiên tiến
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">PayOS là gì?</h4>
              <p className="text-sm text-slate-600">
                PayOS là cổng thanh toán trực tuyến cho phép bạn thanh toán qua chuyển khoản ngân hàng và QR Code an toàn.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">Mất bao lâu để xác nhận thanh toán?</h4>
              <p className="text-sm text-slate-600">
                Thanh toán thường được xác nhận ngay lập tức sau khi chuyển khoản thành công.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">Tôi có thể hủy thanh toán không?</h4>
              <p className="text-sm text-slate-600">
                Bạn có thể hủy thanh toán trước khi hoàn tất giao dịch trên PayOS.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-sm text-slate-500">
            © 2026 StudyMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Payment
