import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyResetOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  document.title = "OTP-VERIFICATION";

  // Khởi tạo cooldown từ localStorage
  useEffect(() => {
    const lastSent = localStorage.getItem(`otp_sent_${email}`);
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remaining = 300 - elapsed;
      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, [email]);

  // Đếm ngược cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/verify-reset-otp', { email, otp });
      Swal.fire('Thành công', 'Xác thực thành công!', 'success');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Xác thực thất bại', 'error');
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/resend-reset-otp?email=${encodeURIComponent(email)}`);
      Swal.fire('Thành công', res.data || 'Đã gửi lại mã OTP', 'success');
      localStorage.setItem(`otp_sent_${email}`, Date.now().toString());
      setCooldown(300);
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Không thể gửi lại OTP', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Xác thực OTP</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Nhập mã OTP"
            className="w-full border border-gray-300 p-3 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Xác nhận
          </button>
        </form>

        <div className="mt-4 text-center">
          {cooldown > 0 ? (
            <p className="text-gray-500">Bạn có thể gửi lại mã OTP sau {cooldown}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
