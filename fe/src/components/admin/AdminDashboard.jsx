import React, { useState } from "react";
import { FaBoxOpen, FaClipboardList, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  document.title = "Levents";

  const cards = [
    {
      icon: <FaChartLine className="text-4xl text-gray-700" />,
      title: "Doanh Thu",
      description: "Xem báo cáo doanh thu và xu hướng kinh doanh",
      onClick: () => navigate("/admin/revenue"),
    },
    {
      icon: <FaBoxOpen className="text-4xl text-gray-700" />,
      title: "Quản lý sản phẩm",
      description: "Thêm mới, chỉnh sửa và ẩn sản phẩm",
      onClick: () => navigate("/admin/product"),
    },
    {
      icon: <FaClipboardList className="text-4xl text-gray-700" />,
      title: "Đơn hàng",
      description: "Xem, duyệt và xử lý các đơn hàng",
      onClick: () => navigate("/admin/order"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar user={user} isOpen={sidebarOpen} />

      <main className="flex-1 mt-[150px] p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Bảng Điều Khiển Quản Trị</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[50px]">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className="cursor-pointer rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transform transition duration-200 
             p-6 min-h-[200px] flex flex-col items-center justify-center text-center"
              >
                <div className="mb-4">{card.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{card.title}</h2>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>

            ))}
          </div>
        </div>

        <AdminChatBox />
      </main>
    </div>
  );
}

export default AdminDashboard;
