import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserSidebar";
import { FaUser, FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaWallet  } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "./client/CartContext";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";



function Navbar() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const cartRef = useRef(null);
  const [selectedProducts, setSelectedProducts] = useState([]);


  const navigate = useNavigate();


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
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    fetchProfile();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSelectItem = (productVariantId) => {
    setSelectedItems((prev) =>
      prev.includes(productVariantId)
        ? prev.filter((id) => id !== productVariantId)
        : [...prev, productVariantId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.productVariantId));
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter(item =>
      selectedItems.includes(item.productVariantId)
    );
    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn sản phẩm',
        text: 'Vui lòng chọn ít nhất một sản phẩm để mua.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    
setSelectedProducts(selectedProducts); // lưu vào context

    console.log("Các sản phẩm đã chọn để mua:", selectedProducts);

    navigate("/checkout", {
  state: { selectedProducts }  // truyền selectedProducts sang trang checkout
});

    // TODO: Gửi selectedProducts lên backend hoặc chuyển trang thanh toán
  };

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-6 w-full fixed top-0 py-3 z-30">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-blue-600">
          <Link to={user && user.role === "ADMIN" ? "/admin" : "/home"}>
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

<div className="relative">
         <FaWallet
    className="text-xl cursor-pointer "
    title="Nạp tiền vào tài khoản"
    onClick={() => navigate("/deposit")}
  />
        </div>
         

        {/* Giỏ hàng */}
        <div className="relative" ref={cartRef}>
          <FaShoppingCart
            className="text-xl cursor-pointer"
            onClick={() => setShowCart(!showCart)}
          />
          {showCart && (
            <div className="absolute right-0 mt-4 w-96 bg-white shadow-lg rounded-md z-50 p-4 max-h-[400px] overflow-y-auto">
              <h3 className="font-bold mb-2 flex justify-between items-center">
                Giỏ hàng
                {cartItems.length > 0 && (
                  <button onClick={toggleSelectAll} className="text-blue-600 text-sm">
                    {selectedItems.length === cartItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                )}
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-500">Chưa có sản phẩm</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {cartItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 border-b pb-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.productVariantId)}
                          onChange={() => toggleSelectItem(item.productVariantId)}
                        />
                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            Màu: <span className="font-medium">{item.color}</span> — Size: <span className="font-medium">{item.size}</span>
                          </div>
                          <div className="text-sm text-red-500">
                            {Number(item.price).toLocaleString()} ₫
                          </div>
                          <div className="flex items-center mt-1 gap-2 text-sm">
                            <button onClick={() => decreaseQuantity(item.productVariantId)} className="p-1 bg-gray-200 rounded">
                              <FaMinus size={10} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.productVariantId)} className="p-1 bg-gray-200 rounded">
                              <FaPlus size={10} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeFromCart(item.productVariantId)}
                          title="Xóa sản phẩm"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tổng và nút mua */}
                  <div className="mt-4 pt-3 border-t text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Tổng:</span>
                      <span className="font-semibold text-red-500">
                        {cartItems
                          .filter(item => selectedItems.includes(item.productVariantId))
                          .reduce((sum, item) => sum + item.price * item.quantity, 0)
                          .toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Mua hàng
                    </button>
                  </div>
                </>
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
