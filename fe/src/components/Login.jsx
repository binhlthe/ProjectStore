import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});

  document.title = "LOGIN";

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateForm()){
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      }, { withCredentials: true });

      if (res.status === 200) {
        const user = res.data;
        login(user);

        // Chỉ điều hướng sau khi người dùng ấn OK
        navigate(user.role === "ADMIN" ? "/admin" : "/home");
      }

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại!',
        text: err.response?.data || 'Lỗi server'
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống.";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } 


    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              
            />
            
          </div>
          {errors.username && <p className="text-red-600 font-medium">{errors.username}</p>}

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              
            />
            
          </div>
          {errors.password && <p className="text-red-600 font-medium">{errors.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
