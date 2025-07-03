import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';
import AdminSidebar from '../components/admin/AdminSidebar'
import Navbar from './Navbar';
import Footer from './Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [user] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  document.title = "CHANGE-PASSWORD";

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu mới không khớp', 'error');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/change-password',
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      Swal.fire('Thành công', 'Đổi mật khẩu thành công', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Đổi mật khẩu thất bại', 'error');
    }
  };

  const renderInput = (label, value, setValue, show, setShow, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {user.role == 'USER' && (
        <Sidebar user={user} isOpen={sidebarOpen} />
      )}
      {user.role == 'ADMIN' && (
        <AdminSidebar user={user} isOpen={sidebarOpen} />
      )}

      <main className="flex-1 mt-[72px] p-8 space-y-8 overflow-y-auto">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Đổi mật khẩu</h2>
          <form onSubmit={handleChangePassword} className="space-y-5">
            {renderInput('Mật khẩu hiện tại', currentPassword, setCurrentPassword, showCurrent, setShowCurrent, 'Nhập mật khẩu hiện tại')}
            {renderInput('Mật khẩu mới', newPassword, setNewPassword, showNew, setShowNew, 'Nhập mật khẩu mới')}
            {renderInput('Xác nhận mật khẩu mới', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, 'Nhập lại mật khẩu mới')}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>
        <Footer />
      </main>
    </div>
  );
}
