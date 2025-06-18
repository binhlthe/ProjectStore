import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import { FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const TABS = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang giao", value: "SHIPPED" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" },
];

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [user, setUser] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/order/get', {
                params: { status: filterStatus }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/admin/order/${orderId}/approve`);
            if (response.status === 200) {
                alert('Đã phê duyệt đơn hàng!');
                fetchOrders();
            }
        } catch (error) {
            console.error('Lỗi duyệt đơn:', error);
            alert('Không thể phê duyệt đơn hàng.');
        }
    };

    const handleCancel = async (orderId) => {
    try {
        const res = await axios.put(`http://localhost:8080/api/admin/order/${orderId}/cancel`);
        if (res.status === 200) {
            alert("Đã hủy đơn hàng.");
            fetchOrders();
        }
    } catch (err) {
        console.error("Lỗi khi hủy đơn hàng:", err);
        alert("Không thể hủy đơn hàng.");
    }
};


    const handleView = (orderId) => {
        navigate(`/admin/order/detail/${orderId}`);
    };

    console.log(orders);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar user={user} />
            <AdminSidebar user={user} />

            <main className="flex-1 mt-[80px] p-6 overflow-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý đơn hàng</h2>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${filterStatus === tab.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Order Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-700">
                                <th className="py-3 px-4 border-b">Mã đơn</th>
                                <th className="py-3 px-4 border-b">Người nhận</th>
                                <th className="py-3 px-4 border-b">SĐT</th>
                                <th className="py-3 px-4 border-b">Địa chỉ</th>
                                <th className="py-3 px-4 border-b">Thời gian</th>
                                <th className="py-3 px-4 border-b">Tổng tiền</th>
                                <th className="py-3 px-4 border-b">Trạng thái</th>
                                <th className="py-3 px-4 border-b text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const address = JSON.parse(order.userAddress);
                                return (
                                    <tr key={order.id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                                        <td className="py-3 px-4 border-b">{order.id}</td>
                                        <td className="py-3 px-4 border-b">{address.fullName}</td>
                                        <td className="py-3 px-4 border-b">{address.phone}</td>
                                        <td className="py-3 px-4 border-b">
                                            {`${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`}
                                        </td>
                                        <td className="py-3 px-4 border-b">{new Date(order.orderDate).toLocaleString()}</td>
                                        <td className="py-3 px-4 border-b text-red-600 font-semibold">
                                            {order.totalAmount?.toLocaleString()} ₫
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center space-x-3">
                                            <button
                                                onClick={() => handleView(order.id)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </button>

                                            {order.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(order.id)}
                                                        className="text-green-600 hover:text-green-800 ml-2"
                                                        title="Chấp thuận đơn hàng"
                                                    >
                                                        ✔️
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        className="text-red-600 hover:text-red-800 ml-2"
                                                        title="Hủy đơn hàng"
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOrderPage;
