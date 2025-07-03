import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  document.title = "EMAIL-VERIFICATION";

  // Lấy email từ URL query (?email=...)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("Không tìm thấy địa chỉ email.");
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.trim() === '') {
      setError("Vui lòng nhập mã OTP.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/verify-otp', {
        email,
        otp,
      });

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Xác thực thành công!',
          text: 'Bạn có thể đăng nhập ngay bây giờ.',
        }).then(() => navigate('/login'));
      }
    } catch (err) {
      setError(err.response?.data || 'Đã có lỗi xảy ra.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Xác thực Email</h2>
        {email && (
          <p className="text-center text-gray-600 mb-4">
            Mã OTP đã được gửi đến: <strong>{email}</strong>
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Xác thực
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
