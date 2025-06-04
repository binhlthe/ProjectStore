
import React, { useState, useRef, useEffect } from "react";
import { FaBoxOpen, FaSearch, FaShoppingCart, FaClipboardList, FaPlusCircle, FaBars, FaUser, FaTshirt, FaShoppingBag } from "react-icons/fa";
import { GiArmoredPants } from "react-icons/gi";

import { useNavigate } from "react-router-dom";
import UserDropdown from "../UserSidebar";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";

function ProductPage() {
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




    return (
        <div className="flex h-screen bg-gray-100">


            <Navbar user={user} />
            {/* Sidebar */}
            <AdminSidebar user={user} />

            <div className="flex-1 p-8 overflow-y-auto mt-16">
                <h1 className="text-2xl font-bold mb-6">Chọn danh mục sản phẩm để quản lý</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition"
                        onClick={() => navigate("/admin/product/top")}
                    >
                        <FaTshirt className="text-green-500" />
                        <h2 className="text-xl font-semibold mb-2">Top</h2>

                        <p>Quản lý các sản phẩm áo</p>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition"
                        onClick={() => navigate("/admin/product/bottom")}
                    >
                        <GiArmoredPants className="text-blue-500" />
                        <h2 className="text-xl font-semibold mb-2">Bottom</h2>
                        <p>Quản lý các sản phẩm quần</p>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition"
                        onClick={() => navigate("/admin/product/accessory")}
                    >
                        <FaShoppingBag className="text-pink-500" />
                        <h2 className="text-xl font-semibold mb-2">Accessory</h2>
                        <p>Quản lý các sản phẩm phụ kiện </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProductPage;