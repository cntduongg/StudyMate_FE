import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('orderCode')
  const reason = searchParams.get('reason') || 'Người dùng hủy giao dịch'

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Cancel Icon */}
          <div className="text-center px-8 py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="mx-auto w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Thanh toán đã bị hủy</h1>
            <p className="text-lg text-slate-600">
              Giao dịch của bạn chưa được hoàn tất
            </p>
          </div>

          {/* Cancel Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Thông tin</h3>
              <div className="space-y-2">
                {orderCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Mã đơn hàng:</span>
                    <span className="font-medium text-slate-900">{orderCode}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Lý do:</span>
                  <span className="font-medium text-slate-900">{reason}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 font-medium text-orange-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Đã hủy
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Thời gian:</span>
                  <span className="font-medium text-slate-900">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Why was it cancelled */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Tại sao giao dịch bị hủy?</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Bạn đã chọn hủy thanh toán</li>
                <li>• Phiên thanh toán hết hạn</li>
                <li>• Lỗi kết nối trong quá trình thanh toán</li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Bạn có thể làm gì?</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ Thử thanh toán lại</li>
                <li>✓ Kiểm tra kết nối internet</li>
                <li>✓ Liên hệ hỗ trợ nếu gặp vấn đề</li>
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
                to="/payment"
                className="flex-1 px-6 py-3 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition font-medium text-center"
              >
                Thử lại
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Gặp vấn đề? Liên hệ với chúng tôi tại{' '}
              <a href="mailto:support@studymate.com" className="text-[#1976d2] hover:underline">
                support@studymate.com
              </a>
              {' '}hoặc gọi{' '}
              <a href="tel:1900xxxx" className="text-[#1976d2] hover:underline">
                1900 xxxx
              </a>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">
                Tiền có bị trừ khi hủy thanh toán không?
              </h4>
              <p className="text-sm text-slate-600">
                Không, nếu giao dịch bị hủy hoặc chưa hoàn tất, bạn sẽ không bị trừ tiền.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">
                Tôi có thể thanh toán lại không?
              </h4>
              <p className="text-sm text-slate-600">
                Có, bạn có thể thử thanh toán lại bất cứ lúc nào bằng cách nhấn nút "Thử lại" ở trên.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-1">
                Làm sao để đảm bảo thanh toán thành công?
              </h4>
              <p className="text-sm text-slate-600">
                Đảm bảo kết nối internet ổn định và thực hiện thanh toán trong thời gian quy định.
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

export default PaymentCancel
