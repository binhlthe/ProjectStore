// AdminDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaBoxOpen, FaSearch, FaShoppingCart, FaClipboardList, FaPlusCircle, FaBars, FaUser, FaShoppingBag, FaTshirt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserDropdown from "../UserSidebar"; // giả định đã có UserSidebar.jsx
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cards = [
    {
      icon: <FaPlusCircle className="text-3xl text-blue-500" />,
      title: "Thêm sản phẩm",
      description: "Thêm các sản phẩm mới vào cửa hàng",
      onClick: () => navigate("/admin/add-product"),
    },
    {
      icon: <FaBoxOpen className="text-3xl text-green-500" />,
      title: "Quản lý sản phẩm",
      description: "Xem và chỉnh sửa danh sách sản phẩm",
      onClick: () => navigate("/admin/product"),
    },
    {
      icon: <FaClipboardList className="text-3xl text-yellow-500" />,
      title: "Đơn hàng",
      description: "Xem và duyệt đơn hàng của khách",
      onClick: () => navigate("/admin/orders"),
    },
  ];



  return (
    <div className="flex h-screen bg-gray-100">


      <Navbar user={user} />
      {/* Sidebar */}
      <AdminSidebar user={user} />

      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all border border-gray-200"
            >
              <div className="mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;