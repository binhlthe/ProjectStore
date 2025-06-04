import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();



  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(username+"adasda");
    try {
      const res = await axios.post('http://localhost:8080/api/register', {
        username,
        password,
        confirmPassword,
      });
      
      if (res.status === 200) {
  setMessage("Đăng kí thành công!");
  navigate("/login");
}
      setMessage(res.data); // In ra: Đăng nhập thành công!
    } catch (err) {
      setMessage(err.response?.data || 'Lỗi server');
    }
  };
  return (
    
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Đăng ký</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Tài khoản"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          />
          <input
            type="password"
            placeholder="Mật khẩu xác thực"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          required
          />
          {message && (
          <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
        )}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
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
