import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiLock } from "react-icons/fi";
import Swal from 'sweetalert2';


export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [exist, setExist] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');


  document.title = "REGISTER";

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await axios.post('http://localhost:8080/api/register', {
        username,
        name,
        email,
        password,
        confirmPassword,
      });

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Chúng tôi đã gửi mã OTP đến email của bạn.',
          confirmButtonText: 'Xác nhận'
        }).then(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        });

      } else {
        setExist(res.data);
      }
    } catch (err) {
      setExist(err.response?.data);
      if (!err.response?.data) {
        setMessage('Lỗi server');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.username = "Tên người dùng không được để trống.";
    }

    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống.";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Mật khẩu xác thực không được để trống.";
    } else {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác thực không khớp"
      }
    }


    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-700 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Đăng ký</h2>

        <form onSubmit={handleRegister} className="space-y-5">


          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="text-red-600 font-medium">{errors.email}</p>}
          </div>


          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tài khoản</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tài khoản"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}

              />

            </div>
            {errors.username && <p className="text-red-600 font-medium">{errors.username}</p>}
            {exist && <p className="text-red-600 font-medium">{exist}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

              />

            </div>
            {errors.password && <p className="text-red-600 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

            </div>
            {errors.confirmPassword && <p className="text-red-600 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Display Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tên người dùng</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}

              />

            </div>
            {errors.name && <p className="text-red-600 font-medium">{errors.name}</p>}

          </div>

          {message && <p className="text-red-600 font-medium">{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
