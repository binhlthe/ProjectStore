import React, { useState, useRef, useEffect } from "react";
import {
  FaTshirt,
  FaShoppingBag
} from "react-icons/fa";
import { GiArmoredPants } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import axios from 'axios';

function ProductPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState([]);
    const [accessories, setAccessories] = useState([]);
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

  useEffect(() => {
  const fetchProducts = async () => {
      try {
        const res1 = await axios.get('http://localhost:8080/api/admin/products/getAllTops');
        const res2 = await axios.get('http://localhost:8080/api/admin/products/getAllBottoms');
        const res3 = await axios.get('http://localhost:8080/api/admin/products/getAllAccessories');
        
       
        setTops(res1.data); // Lưu vào state đã có price
        console.log(tops);
        setBottoms(res2.data);
        setAccessories(res3.data);

      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  
  const categories = [
    {
      name: "Top",
      description: "Quản lý các sản phẩm áo",
      icon: <FaTshirt className="text-3xl text-gray-700" />,
      bg: "bg-white border border-gray-200",
      hover: "hover:bg-gray-100",
      onClick: () => navigate("/admin/product/top"),
      total: tops.length,
    },
    {
      name: "Bottom",
      description: "Quản lý các sản phẩm quần",
      icon: <GiArmoredPants className="text-3xl text-gray-700" />,
      bg: "bg-white border border-gray-200",
      hover: "hover:bg-gray-100",
      onClick: () => navigate("/admin/product/bottom"),
      total: bottoms.length,
    },
    {
      name: "Accessory",
      description: "Quản lý các sản phẩm phụ kiện",
      icon: <FaShoppingBag className="text-3xl text-gray-700" />,
      bg: "bg-white border border-gray-200",
      hover: "hover:bg-gray-100",
      onClick: () => navigate("/admin/product/accessory"),
      total: accessories.length,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar user={user} />
      <AdminSidebar user={user} />

      <main className="flex-1 mt-[72px] p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Danh Mục Sản Phẩm
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm ${cat.bg} ${cat.hover} transition-all duration-200 cursor-pointer flex items-center p-5`}
              onClick={cat.onClick}
            >
              <div className="mr-5">{cat.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
                <p className="text-gray-600 text-sm">{cat.description}</p>
                <p className="text-gray-500 mt-1 text-xs italic">Tổng sản phẩm: {cat.total}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProductPage;
