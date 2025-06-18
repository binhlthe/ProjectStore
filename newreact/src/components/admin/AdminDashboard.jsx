// AdminDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaBoxOpen, FaClipboardList, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const cards = [
    {
      icon: <FaChartLine className="text-4xl text-white" />,
      title: "Doanh Thu",
      description: "Xem báo cáo doanh thu và xu hướng kinh doanh",
      bgColor: "bg-gradient-to-tr from-blue-500 to-blue-700",
      onClick: () => navigate("/admin/revenue"),
    },
    {
      icon: <FaBoxOpen className="text-4xl text-white" />,
      title: "Quản lý sản phẩm",
      description: "Thêm mới, chỉnh sửa và ẩn sản phẩm",
      bgColor: "bg-gradient-to-tr from-green-500 to-green-700",
      onClick: () => navigate("/admin/product"),
    },
    {
      icon: <FaClipboardList className="text-4xl text-white" />,
      title: "Đơn hàng",
      description: "Xem, duyệt và xử lý các đơn hàng",
      bgColor: "bg-gradient-to-tr from-yellow-500 to-yellow-700",
      onClick: () => navigate("/admin/order"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar user={user} />
      <AdminSidebar user={user} />

      <main className="flex-1 mt-[72px] p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Bảng Điều Khiển Quản Trị</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${card.bgColor}`}
              >
                <div className="absolute inset-0 opacity-10 bg-pattern" />
                <div className="p-6">
                  <div className="mb-4">{card.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{card.title}</h2>
                  <p className="text-white text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
