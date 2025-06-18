// src/components/Sidebar.js
// import thêm Link
import { Link, useLocation } from "react-router-dom";
import  { useEffect, useState } from "react";
import axios from "axios";

import React from "react";
import { FaHome, FaStar, FaTshirt, FaSocks, FaUserAlt } from "react-icons/fa";

const menu = [
  { label: "Trang chủ", icon: <FaHome />, path: "/home" },
  { label: "Top Seller", icon: <FaStar />, path: "/homeeee" },
  { label: "New Arrival", icon: <FaTshirt />, path: "/product/new-arrival" },
  { label: "Top", icon: <FaTshirt />, path: "/product/top" },
  { label: "Bottom", icon: <FaSocks />, path: "/product/bottom" },
  { label: "Accessories", icon: <FaUserAlt />, path: "/product/accessory" },
];





const Sidebar = ({ user }) => {
  const location = useLocation(); // để highlight menu đang active
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    console.log("hihih");
    const fetchWallet = async () => {
      try {
        if (!user || !user.id) return;
        const res = await axios.get(`http://localhost:8080/api/wallet/get`,{
          params: {
            userId: user.id
          }
        });
        console.log('aaaa'+res.data);
        setWallet(res.data);
      } catch (err) {
        console.error("Lỗi lấy ví:", err);
      }
    };

    fetchWallet();
  }, [user]);

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
        <div>
          <p className="text-sm font-medium text-gray-800">
          {user?.name || "Guest"}
        </p>
        <p className="text-xs text-red-600">
  {wallet ? wallet.price.toLocaleString() + " ₫" : "0 ₫"}
</p>
        </div>
      </div>
    </aside>
  );
};


export default Sidebar;
