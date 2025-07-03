import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserSidebar";
import { FaUser, FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "./client/CartContext";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import SidebarToggleButton from "./SidebarToggleButton";




function Navbar({ onToggleSidebar }) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const cartRef = useRef(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [typing, setTyping] = useState(false);




  const navigate = useNavigate();


  useEffect(() => {
    if (!user || !user.id) {

      return;
    }
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

  const handleSearch = async (query) => {
    try {
      const res = await axios.get("http://localhost:8080/api/products/search", {
        params: { query }
      });
      if (res.status === 200) {
        setSearchResults(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 100); // đợi 500ms sau khi người dùng dừng gõ

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);



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

  useEffect(() => {
    if (searchQuery.trim() === "") return;

    setTyping(true);
    const timeout = setTimeout(() => {
      setTyping(false); // Sau 500ms không gõ thì tắt hiệu ứng
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);


  return (
    <header className="bg-white shadow-md flex items-center justify-between px-4 sm:px-6 w-full fixed top-0 h-[66px] z-30">
      <div className="flex items-center gap-2 min-w-0">
        {onToggleSidebar && (
          <div className="shrink-0">
            <SidebarToggleButton onClick={onToggleSidebar} />
          </div>
        )}
        <div className="shrink min-w-0">
          <Link to={user && user.role === "ADMIN" ? "/admin" : "/home"}>
            <img
              src="/images/logo2.png"
              alt="Banner"
              className="h-[30px] object-contain max-w-[120px] sm:max-w-none"
            />
          </Link>
        </div>
      </div>


      <div className="flex items-center gap-2 relative group">
        {((user?.role === "USER") || (!user)) && (
          <div className="relative ">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 w-[160px] sm:w-[200px] md:w-[300px] lg:w-[400px] border border-gray-300 rounded-full text-sm
    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
    transition-all duration-300 ease-in-out shadow-sm hover:shadow-md placeholder-gray-400"
            />




            <FaSearch
              className={`absolute left-4 top-4 text-gray-400 transition-transform duration-300
   ${typing ? "animate-spin" : ""}
  `}
            />


          </div>
        )}
        {searchResults.length > 0 && (
          <div
            className="absolute top-full left-0 mt-1 w-[90%] bg-white shadow-lg rounded z-50 max-h-60 overflow-y-auto
               transition-all duration-300 transform opacity-100 translate-y-0
               animate-fade-in"
          >
            {searchResults.map(product => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 border-b"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <img
                  src={product.thumbnailImage}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{product.name}</div>
                  <div className="text-xs text-red-500">
                    {Number(product.price).toLocaleString()} ₫
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>



      <div className="flex items-center gap-2 relative">
        {user?.role === "USER" && (
          <div className="relative">
            <FaWallet
              className="text-xl cursor-pointer"
              title="Nạp tiền vào tài khoản"
              onClick={() => navigate("/deposit")}
            />
          </div>
        )}

        {/* Giỏ hàng */}
        {user?.role === "USER" && (
          <div className="relative" ref={cartRef}>
            <FaShoppingCart
              className="text-xl cursor-pointer"
              onClick={() => setShowCart(!showCart)}
            />
            {showCart && (
              <div className="absolute right-0 mt-4 w-96 bg-white shadow-lg rounded-md z-50 p-4 max-h-[400px] overflow-y-auto animate-slide-fade-in transition-all duration-300">
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
        )}




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
