import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import UserDropdown from "../UserSidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { FiFilter } from "react-icons/fi";
import ChatBox from "./ChatBox";

function BottomPage() {
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const  [setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  document.title = "BOTTOM - Levents";

  const pageSize = 6; // mỗi trang 6 sản phẩm

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/sort/bottoms`, {
          params: {
            page: currentPage,
            size: pageSize,
            sort: sortBy,
            name: searchTerm,
            priceRange: priceFilter,
          }
        });
        console.log(res.data);
        if (Array.isArray(res.data.content)) {

          setProducts(res.data.content);
        } else {
          console.error("Dữ liệu trả về không phải mảng:", res.data.content);
          setProducts([]); // fallback an toàn
        }
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm top:", err);
      }
    };

    fetchProducts();
  }, [sortBy, currentPage, searchTerm, priceFilter]);

  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar user={user} isOpen={sidebarOpen} />

      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Tất cả sản phẩm BOTTOM
            <div className="text-base font-normal ml-2 text-gray-500">
              ({products.length} sản phẩm / trang {currentPage + 1}/{totalPages})
            </div>
          </h1>

          <div className="flex flex-col gap-4 mb-4">
            <div
              className="flex flex-col sm:flex-row gap-4 items-center animate-filter-fade-in"
            >
              {/* Ô tìm kiếm */}
              <div className="relative w-full sm:w-60 transition-transform duration-300 transform hover:scale-[1.02]">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-gray-300 focus:outline-none transition-all"
                />
              </div>

              {/* Bộ lọc giá */}
              <div className="relative w-full sm:w-60 transition-transform duration-300 transform hover:scale-[1.02]">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-gray-300 focus:outline-none transition-all"
                >
                  <option value="">Lọc theo giá</option>
                  <option value="0-300000">Dưới 300.000₫</option>
                  <option value="300000-500000">300.000₫ - 500.000₫</option>
                  <option value="500000-1000000">Trên 500.000₫</option>
                </select>
              </div>
            </div>

            {/* Dropdown sắp xếp */}
            <div className="relative w-full sm:w-60 mt-4 sm:mt-0 animate-filter-fade-in transition-transform duration-300 transform hover:scale-[1.02]">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-gray-300 focus:outline-none transition-all"
              >
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"

            >
              <img
                src={product.thumbnailImage}
                alt={product.name}
                className="w-full h-auto object-contain aspect-[3/4] rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
                {product.name}
              </h3>
              <p className="text-red-600">
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </p>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 border rounded ${i === currentPage ? "bg-black text-white" : ""
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              &raquo;
            </button>
          </div>
        )}
        <ChatBox />

        <Footer />

      </main>
    </div>
  );
}

export default BottomPage;
