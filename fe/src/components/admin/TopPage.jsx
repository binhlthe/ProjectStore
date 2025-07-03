import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import axios from "axios";

function TopPage() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });
    const [setShowUserDropdown] = useState(false);
    const dropdownContainerRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "TOP - Levents";

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null); // Modal image

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (
            dropdownContainerRef.current &&
            !dropdownContainerRef.current.contains(event.target)
        ) {
            setShowUserDropdown(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/admin/products/tops?page=${currentPage - 1}&size=${itemsPerPage}`
                );
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [currentPage]);

    const handleView = (product) => {
        navigate(`/admin/product/${product.id}`);
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

            <div className="flex-1 p-8 mt-16 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Danh sách sản phẩm Top</h2>
                    <button
                        onClick={() => navigate("/admin/product/top/add")}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <FaPlus />
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow">
                        <thead className="bg-gray-300 text-left">
                            <tr>
                                <th className="py-3 px-4 border-b">ID</th>
                                <th className="py-3 px-4 border-b">Hình ảnh</th>
                                <th className="py-3 px-4 border-b">Tên sản phẩm</th>
                                <th className="py-3 px-4 border-b">Giá</th>
                                <th className="py-3 px-4 border-b">Kho</th>
                                <th className="py-3 px-4 border-b text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-600 hover:text-white odd:bg-gray-200"
                                >
                                    <td className="py-3 px-4 border-b">{product.id}</td>
                                    <td className="py-3 px-4 border-b">
                                        <img
                                            src={product.thumbnailImage}
                                            alt={product.name}
                                            className="w-10 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                            onClick={() => setSelectedImage(product.thumbnailImage)}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border-b">{product.name}</td>
                                    <td className="py-3 px-4 border-b">
                                        {Number(product.price).toLocaleString("vi-VN")}₫
                                    </td>
                                    <td className="py-3 px-4 border-b">{product.totalQuantity}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <button
                                            onClick={() => handleView(product)}
                                            className="text-blue-600 hover:text-blue-800 mr-4"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Không có sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="flex justify-center mt-4 space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal hiển thị ảnh */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Ảnh sản phẩm"
                        className="max-w-[90%] max-h-[80%] object-contain rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <AdminChatBox />
        </div>
    );
}

export default TopPage;