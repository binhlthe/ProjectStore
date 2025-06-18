// src/components/Sidebar.js
// import thêm Link
import { Link, useLocation } from "react-router-dom";

import React from "react";
import { FaHome, FaChartLine , FaBoxOpen, FaClipboardList, FaUserAlt } from "react-icons/fa";

const menu = [
  { label: "Dashboard", icon: <FaHome />, path: "/admin" },
  { label: "Doanh Thu", icon: <FaChartLine />, path: "/admin/revenue" },
  { label: "Quản lí sản phẩm", icon: <FaBoxOpen />, path: "/admin/product" },
  { label: "Đơn hàng", icon: <FaClipboardList />, path: "/admin/order" },
];



const Sidebar = ({ user }) => {
  const location = useLocation(); // để highlight menu đang active

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
          MyShop Admin
        </div>
        <nav className="mt-4">
          {menu.map((item, idex) => (
            <Link to={item.path} key={idex}>
              <div
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all ${location.pathname === item.path
                    ? "bg-gray-300 text-black font-bold"
                    : "text-black-300 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 p-6 border-t border-gray-200">
        <img
          src={user?.username ? user.avatar : "/images/avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-sm font-medium text-gray-800">
          {user?.username || "Guest"}
        </p>
      </div>
    </aside>
  );
};


export default Sidebar;
