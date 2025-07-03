// src/components/Sidebar.js
// import thêm Link
import { Link, useLocation } from "react-router-dom";
import  { useEffect, useState } from "react";
import axios from "axios";

import React from "react";
import { FaHome, FaStar, FaTshirt, FaUsers	,FaShoppingBag  } from "react-icons/fa";
import { GiArmoredPants  } from 'react-icons/gi';
import { MdNewReleases } from "react-icons/md";


const menu = [
  { label: "Trang chủ", icon: <FaHome />, path: "/home" },
  { label: "About", icon: <FaUsers />, path: "/about" },
  { label: "Top Seller", icon: <FaStar />, path: "/product/top-seller" },
  { label: "New Arrival", icon: <MdNewReleases  />, path: "/product/new-arrival" },
  { label: "Top", icon: <FaTshirt />, path: "/product/top" },
  { label: "Bottom", icon: <GiArmoredPants  />, path: "/product/bottom" },
  { label: "Accessory", icon: <FaShoppingBag  />, path: "/product/accessory" },

];





const Sidebar = ({ user , isOpen}) => {
  const location = useLocation(); // để highlight menu đang active
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
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
    <>
      {/* backdrop trên mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 top-[0px] z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>

      <aside
        className={`fixed md:static  left-0 top-[0px] z-20 h-screen w-64 bg-white shadow-lg flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
            {/* Logo hoặc gì đó */}
          </div>
          <nav className="mt-10">
            {menu.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all ${
                    location.pathname === item.path
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
              {wallet ? wallet.balance.toLocaleString() + " ₫" : "0 ₫"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;
