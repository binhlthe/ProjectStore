import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserSidebar";
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "./client/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";


function Navbar() {

  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  console.log("Cart items hiện tại:", cartItems);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  console.log(user);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const cartRef = useRef(null); // Ref để đóng popup giỏ hàng khi click ngoài

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }
        const res = await axios.post('http://localhost:8080/api/user/profile', {}, { withCredentials: true });
        if (res.status === 200) {
          console.log(res.data);
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    // Đóng dropdown và giỏ hàng nếu click ra ngoài
    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        cartRef.current && !cartRef.current.contains(event.target)
      ) {
        setShowCart(false);
      }
    };

    fetchProfile();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-6 w-full fixed top-0 py-3 z-30">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-blue-600">
          <Link to={user && user.role==="ADMIN"? "/admin":"/home"}>
            <img
              src="/images/logo2.png"
              alt="Banner"
              className="h-[30px] object-cover"
            />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Giỏ hàng */}
        <div className="relative" ref={cartRef}>
          <FaShoppingCart
            className="text-xl cursor-pointer"
            onClick={() => setShowCart(!showCart)}
          />
          {showCart && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-50 p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-bold mb-2">Giỏ hàng</h3>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Chưa có sản phẩm</p>
              ) : (
                <ul className="space-y-2">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 border-b pb-2">
                      {/* Ảnh */}
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />

                      {/* Nội dung */}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-red-500">
                          {Number(item.price).toLocaleString()} ₫
                        </div>

                        {/* Số lượng */}
                        <div className="flex items-center mt-1 gap-2 text-sm">
                          <button onClick={() => decreaseQuantity(item.id)} className="p-1 bg-gray-200 rounded">
                            <FaMinus size={10} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="p-1 bg-gray-200 rounded">
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Xoá */}
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeFromCart(item.id)}
                        title="Xóa sản phẩm"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>

              )}
              {cartItems.length > 0 && (
                <div className="mt-3 pt-2 border-t text-right font-semibold">
                  Tổng:{" "}
                  {cartItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString("vi-VN")}{" "}
                  ₫
                </div>
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative" ref={dropdownContainerRef}>
          <FaUser
            className="text-xl cursor-pointer"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          />
          <UserDropdown
            user={user}
            isOpen={showUserDropdown}
            onClose={() => setShowUserDropdown(false)}
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
