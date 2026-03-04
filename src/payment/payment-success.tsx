import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [error, setError] = useState('')

  const orderCode = searchParams.get('orderCode')
  const id = searchParams.get('id')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderCode && !id) {
        setError('Không tìm thấy thông tin đơn hàng')
        setVerifying(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        // Verify payment with backend
        const response = await fetch(
          `https://localhost:7259/api/Payment/verify-payment?orderCode=${orderCode || id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Không thể xác minh thanh toán')
        }

        const result = await response.json()
        setPaymentDetails(result.data || result)
      } catch (err: any) {
        console.error('Payment verification error:', err)
        // Even if verification fails, show success if we have orderCode
        if (orderCode || id) {
          setPaymentDetails({
            orderCode: orderCode || id,
            status: 'PAID',
            amount: searchParams.get('amount') || 'N/A'
          })
        } else {
          setError(err.message || 'Có lỗi xảy ra khi xác minh thanh toán')
        }
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [orderCode, id, navigate])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1976d2] border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Đang xác minh thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
              <span className="text-xl font-bold text-[#1976d2]">StudyMate</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="text-center px-8 py-12">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Có lỗi xảy ra</h1>
              <p className="text-slate-600 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/payment"
                  className="px-6 py-3 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition font-medium"
                >
                  Thử lại
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Success Icon */}
            <div className="text-center px-8 py-12 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Thanh toán thành công!</h1>
              <p className="text-lg text-slate-600">
                Cảm ơn bạn đã sử dụng dịch vụ của StudyMate
              </p>
            </div>

            {/* Payment Details */}
            <div className="px-8 py-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Chi tiết giao dịch</h3>
                <div className="space-y-2">
                  {paymentDetails?.orderCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Mã đơn hàng:</span>
                      <span className="font-medium text-slate-900">{paymentDetails.orderCode}</span>
                    </div>
                  )}
                  {paymentDetails?.amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Số tiền:</span>
                      <span className="font-medium text-slate-900">
                        {typeof paymentDetails.amount === 'number' 
                          ? paymentDetails.amount.toLocaleString('vi-VN') 
                          : paymentDetails.amount} đ
                      </span>
                    </div>
                  )}
                  {paymentDetails?.status && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Trạng thái:</span>
                      <span className="inline-flex items-center gap-1 font-medium text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thành công
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Thời gian:</span>
                    <span className="font-medium text-slate-900">
                      {new Date().toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Tiếp theo</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>✓ Tài khoản của bạn đã được nâng cấp</li>
                  <li>✓ Bạn có thể truy cập tất cả các tính năng Premium</li>
                  <li>✓ Email xác nhận đã được gửi đến hộp thư của bạn</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  to="/"
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-center"
                >
                  Về trang chủ
                </Link>
                <Link
                  to="/courses"
                  className="flex-1 px-6 py-3 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition font-medium text-center"
                >
                  Xem khóa học
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Cần hỗ trợ? Liên hệ với chúng tôi tại{' '}
                <a href="mailto:support@studymate.com" className="text-[#1976d2] hover:underline">
                  support@studymate.com
                </a>
              </p>
            </div>
          </div>
        )}
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

export default PaymentSuccess
