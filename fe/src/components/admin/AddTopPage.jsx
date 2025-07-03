import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminChatBox from "./AdminChatBox";
import Navbar from "../Navbar";

function AddTopPage() {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [errors, setErrors] = useState({});

    document.title = "TOP - Levents";

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "top",
        arrivedDate: "",
        price: "",
        thumbnailImage: null,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: e.target.files[0],
        }));
        console.log(formData);
    };

    const uploadImages = async (file) => {
        const formData = new FormData();
        console.log(file);

        formData.append("file", file)

        for (let [key, value] of formData.entries()) {
            console.log("FormData entry:", key, value);
        }

        const response = await axios.post("http://localhost:8080/api/upload/single", formData);
        console.log(response.data);

        return response.data; // Expect: List<String> URLs
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống.";
        }

        if (!formData.arrivedDate) {
            newErrors.arrivedDate = "Vui lòng chọn ngày nhập hàng.";
        }

        if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            newErrors.price = "Giá phải là số lớn hơn 0.";
        }

        if (!formData.thumbnailImage) {
            newErrors.thumbnailImage = "Vui lòng chọn ảnh sản phẩm.";
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const imageUrls = await uploadImages(formData.thumbnailImage);

            const productData = {
                name: formData.name,
                category: formData.category,
                arrivedDate: formData.arrivedDate,
                price: formData.price,
                thumbnailImage: imageUrls,
            };

            await axios.post("http://localhost:8080/api/products/add-product", productData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert("Thêm sản phẩm thành công!");
            navigate("/admin/product/top");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm.");
        }
    };




    return (
        <div className="flex h-screen bg-gray-100">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

            <div className="flex-1 mt-28 p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Thêm sản phẩm Top</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-600 font-medium mt-1">{errors.name}</p>}
                        </div>




                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Ngày nhập hàng</label>
                            <input
                                type="datetime-local"
                                name="arrivedDate"
                                value={formData.arrivedDate}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.arrivedDate && <p className="text-red-600 font-medium mt-1">{errors.arrivedDate}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Giá (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.price && <p className="text-red-600 font-medium mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Ảnh đại diện</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="px-3 py-1 rounded  w-full"
                            />
                            <div className="flex gap-2 flex-wrap">
                                {formData.thumbnailImage && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(formData.thumbnailImage)}
                                            alt="Ảnh đại diện"
                                            className="w-20 h-20 object-cover rounded border"
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded border transition"
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Thêm sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <AdminChatBox />
        </div>
    );
}

export default AddTopPage;
