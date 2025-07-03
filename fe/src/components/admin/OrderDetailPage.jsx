import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Navbar from '../Navbar';
import axios from 'axios';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { BiSolidUser, BiSolidPhone } from 'react-icons/bi';
import { PiMapPinLineBold } from 'react-icons/pi';
import AdminChatBox from './AdminChatBox';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [user] = useState(() => {
        const cached = localStorage.getItem('user');
        return cached ? JSON.parse(cached) : null;
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    document.title = "ORDER - Levents";

    const [parsedAddress, setParsedAddress] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Modal image
    const [setShowUserDropdown] = useState(false);
    const dropdownContainerRef = useRef(null);

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
        axios
            .get(`http://localhost:8080/api/admin/order/detail/${id}`)
            .then(res => {
                setOrder(res.data);

                try {
                    const address = JSON.parse(res.data.userAddress);
                    setParsedAddress(address);
                } catch (err) {
                    console.error('Lỗi parse địa chỉ:', err);
                    setParsedAddress(null);
                }
            })
            .catch(err => console.error(err));
    }, [id]);
    if (!order) return <div className="text-center mt-20 text-xl">Đang tải đơn hàng...</div>;

    return (
        <div className="flex bg-gray-100 h-screen">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

            <div className="flex-1 p-6 mt-16 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">Chi tiết đơn hàng #{order.id}</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                        <div className="flex items-center gap-2">
                            <BiSolidUser className="text-blue-500" />
                            <span><strong>Người nhận:</strong> {parsedAddress.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BiSolidPhone className="text-green-500" />
                            <span><strong>SĐT:</strong> {parsedAddress.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <PiMapPinLineBold className="text-red-500" />
                            <span>
                                <strong>Địa chỉ:</strong>{' '}
                                {parsedAddress
                                    ? `${parsedAddress.addressDetail}, ${parsedAddress.ward}, ${parsedAddress.district}, ${parsedAddress.province}`
                                    : order.userAddress}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdOutlinePayment className="text-purple-500" />
                            <span><strong>Thanh toán:</strong> {order.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegClock className="text-orange-500" />
                            <span><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">Sản phẩm trong đơn:</h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (

                            <div key={index} className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.productName}
                                        className="w-10 h-10 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                        onClick={() => setSelectedImage(item.image)}
                                    />
                                    <div>
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-gray-500">Màu: {item.color} | Size: {item.size}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">Số lượng: <strong>{item.quantity}</strong></p>
                                    <p className="text-sm">Giá: <strong>{item.productPrice?.toLocaleString() || '---'}₫</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
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
};

export default OrderDetailPage;
