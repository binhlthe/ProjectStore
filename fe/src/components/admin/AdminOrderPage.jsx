import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaEye, FaShippingFast, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";


const MySwal = withReactContent(Swal);


const TABS = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" },
];

const statusMap = {
    PENDING: {
        label: "Chờ xử lý",
        icon: <FaBox className="inline mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        icon: <FaCheckCircle className="inline mr-1" />,
        color: "bg-blue-100 text-blue-800",
    },
    SHIPPING: {
        label: "Đang giao",
        icon: <FaShippingFast className="inline mr-1" />,
        color: "bg-purple-100 text-purple-800",
    },
    DELIVERED: {
        label: "Đã giao",
        icon: <FaCheckCircle className="inline mr-1" />,
        color: "bg-green-100 text-green-800",
    },
    CANCELLED: {
        label: "Đã hủy",
        icon: <FaTimesCircle className="inline mr-1" />,
        color: "bg-red-100 text-red-800",
    },
    default: {
        label: "Không rõ",
        icon: <FaBox className="inline mr-1" />,
        color: "bg-gray-100 text-gray-800",
    },
};


const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "ORDER - Levents";
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
        const result = await MySwal.fire({
            title: 'Phê duyệt đơn hàng?',
            text: 'Bạn có chắc muốn phê duyệt đơn hàng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Phê duyệt',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`http://localhost:8080/api/admin/order/${orderId}/approve`);
                if (response.status === 200) {
                    MySwal.fire('Thành công', 'Đơn hàng đã được phê duyệt.', 'success');
                    fetchOrders();
                }
            } catch (error) {
                console.error('Lỗi duyệt đơn:', error);
                MySwal.fire('Lỗi', 'Không thể phê duyệt đơn hàng.', 'error');
            }
        }
    };


    const handleCancel = async (orderId) => {
        const result = await MySwal.fire({
            title: 'Hủy đơn hàng?',
            text: 'Bạn có chắc muốn hủy đơn hàng này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hủy đơn',
            cancelButtonText: 'Quay lại',
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.put(`http://localhost:8080/api/admin/order/${orderId}/cancel`);
                if (res.status === 200) {
                    MySwal.fire('Đã hủy', 'Đơn hàng đã bị hủy.', 'success');
                    fetchOrders();
                }
            } catch (err) {
                console.error("Lỗi khi hủy đơn hàng:", err);
                MySwal.fire('Lỗi', 'Không thể hủy đơn hàng.', 'error');
            }
        }
    };


    const handleAssigned = async (orderId) => {
        const result = await MySwal.fire({
            title: 'Giao đơn hàng?',
            text: 'Bạn có chắc muốn giao đơn này cho bên vận chuyển?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Giao hàng',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.put(`http://localhost:8080/api/admin/order/${orderId}/assign`);
                if (res.status === 200) {
                    MySwal.fire('Thành công', 'Đơn đã được giao cho bên vận chuyển.', 'success');
                    fetchOrders();
                }
            } catch (err) {
                console.error("Lỗi khi giao đơn hàng:", err);
                MySwal.fire('Lỗi', 'Không thể giao đơn hàng.', 'error');
            }
        }
    };



    const handleView = (orderId) => {
        navigate(`/admin/order/detail/${orderId}`);
    };

    console.log(orders);

    return (
        <div className="flex h-screen bg-gray-100">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

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
                                        <td className="py-3 px-4 border-b whitespace-nowrap">
                                            {new Date(order.orderDate).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 border-b text-red-600 font-semibold whitespace-nowrap">
                                            {order.totalAmount?.toLocaleString()} ₫
                                        </td>



                                        <td className="py-3 px-4 border-b whitespace-nowrap">
                                            {(() => {
                                                const status = statusMap[order.status] || statusMap.default;
                                                return (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex items-center gap-1 w-fit ${status.color}`}>
                                                        {status.icon}
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}

                                        </td>

                                        <td className="py-2 px-3 border-b">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(order.id)}
                                                    className="text-blue-500 hover:text-blue-700 text-base"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>

                                                {order.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(order.id)}
                                                            className="text-green-600 hover:text-green-800 text-base"
                                                            title="Chấp thuận đơn hàng"
                                                        >
                                                            ✔️
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(order.id)}
                                                            className="text-red-600 hover:text-red-800 text-base"
                                                            title="Hủy đơn hàng"
                                                        >
                                                            ❌
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === "CONFIRMED" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAssigned(order.id)}
                                                            className="text-green-600 hover:text-green-800 text-base"
                                                            title="Chấp thuận đơn hàng"
                                                        >
                                                            <FaShippingFast className='text-blue-500' />
                                                        </button>

                                                    </>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <AdminChatBox />
            </main>
        </div>
    );
};

export default AdminOrderPage;
