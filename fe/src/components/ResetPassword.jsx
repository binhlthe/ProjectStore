import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  document.title = "RESET-PASSWORD";

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      Swal.fire('Lỗi', 'Mật khẩu không khớp', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/reset-password', { email, newPassword: password });
      Swal.fire('Thành công', 'Mật khẩu đã được đặt lại!', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Không thể đặt lại mật khẩu', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Đặt lại mật khẩu</h2>
        <form onSubmit={handleReset} className="space-y-4">
          {/* Mật khẩu mới */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              className="w-full border border-gray-300 p-3 rounded pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-gray-300 p-3 rounded pr-12"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}
