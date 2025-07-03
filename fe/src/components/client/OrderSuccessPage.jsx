import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from './ChatBox';

const OrderSuccessPage = () => {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "ORDER - Levents";

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
            <div className="flex flex-1 overflow-hidden">
                <Sidebar user={user} isOpen={sidebarOpen} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center mt-20">
                        <CheckCircle className="mx-auto text-green-500 w-20 h-20 animate-pulse" />
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">Đặt hàng thành công!</h2>
                        <p className="text-gray-600 mt-2 text-lg">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                        </p>

                        <div className="mt-6 text-left bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2">Thông tin vận chuyển</h3>
                            <p><strong>Người nhận:</strong> {user?.fullname || "Nguyễn Văn A"}</p>
                            <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                            <p><strong>SĐT:</strong> 0909 123 456</p>
                            <p><strong>Dự kiến giao:</strong> 2-3 ngày làm việc</p>
                        </div>


                        {/* Nút điều hướng */}
                        <div className="mt-8 space-x-4">
                            <Link
                                to="/home"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
                            >
                                Về trang chủ
                            </Link>
                            <Link
                                to="/my-orders"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition"
                            >
                                Xem đơn hàng
                            </Link>
                        </div>
                    </div>
                    <ChatBox/>
                    <div className="mt-12">
                        <Footer user={user} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
