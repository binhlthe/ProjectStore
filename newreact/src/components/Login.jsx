import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // 👈 Nhớ đúng đường dẫn

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Sử dụng context thay vì localStorage trực tiếp

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      }, { withCredentials: true });

      if (res.status === 200) {
        const user = res.data; // Đây là object user từ backend
        login(user); // 👈 Cập nhật context và localStorage cùng lúc
        setMessage("Đăng nhập thành công!");

        // Điều hướng theo vai trò
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setMessage(err.response?.data || 'Lỗi server');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Đăng nhập
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
          {message && (
            <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
          )}
        </form>
        <p className="text-center text-sm mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng kí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
