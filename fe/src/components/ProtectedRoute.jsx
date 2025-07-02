// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: loading, true: logged in, false: not logged in

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Gửi yêu cầu đến backend để kiểm tra phiên/token
        // Đây là endpoint mà backend dùng để xác thực người dùng đã đăng nhập
        const res = await axios.post('http://localhost:8080/api/user/profile', {}, { withCredentials: true });
        if (res.status === 200) {
          setIsLoggedIn(true); // Đã đăng nhập
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false); // Chưa đăng nhập hoặc session hết hạn
      }
    };

    checkUser();
  }, []); // Chỉ chạy một lần khi component mount

  if (isLoggedIn === null) {
    // Đang tải dữ liệu hoặc kiểm tra trạng thái đăng nhập
    // Bạn có thể hiển thị một spinner hoặc màn hình tải ở đây
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Nếu đã đăng nhập, cho phép truy cập vào route con
  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;