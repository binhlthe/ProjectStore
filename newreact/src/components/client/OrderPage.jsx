import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab } from "@headlessui/react"; // Hoặc dùng custom tab
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";

const tabs = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang giao", value: "SHIPPED" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" },
];


const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedTab, setSelectedTab] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);


    const [user, setUser] = useState(() => {
        // Lấy từ localStorage khi load lại trang
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;

    });

    useEffect(() => {
        fetchOrders();
    }, [selectedTab]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/order/get", {
                params: {
                    status: selectedTab,
                    userId: user.id
                }
            });
            console.log(res.data);
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi lấy đơn hàng:", err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Navbar user={user} />
            {/* Sidebar */}
            <Sidebar user={user} />
            <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
                <h2 className="text-2xl font-bold mb-4">Đơn hàng của bạn</h2>

                <div className="flex space-x-4 mb-4 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            className={`px-4 py-2 rounded ${selectedTab === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setSelectedTab(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {orders.map(order => {
                        const address = JSON.parse(order.userAddress);
                        return (
                            <div key={order.id} className="border rounded p-4 bg-white shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Mã đơn: #{order.id}</span>
                                    <span className="text-sm text-blue-600">{order.status}</span>
                                </div>
                                <div className="text-sm text-gray-700 mb-2">
                                    {`${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`}
                                </div>
                                <div className="text-sm text-gray-700 mb-2">
                                    Tổng tiền: <span className="text-red-600 font-semibold">{order.totalAmount.toLocaleString()}₫</span>
                                </div>

                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        );
                    })}
                    {orders.length === 0 && (
                        <div className="text-center text-gray-500 py-6">Không có đơn hàng nào.</div>
                    )}
                </div>
                {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-100">
    <div className="bg-white rounded-lg w-[800px] shadow-lg max-h-[70vh] flex flex-col overflow-hidden">
      
      {/* Header cố định */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
      </div>

      {/* Danh sách sản phẩm cuộn được */}
      <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {selectedOrder.items?.map((item, idx) => {
          let images = [];
          try {
            images = JSON.parse(item.image); // parse từ chuỗi JSON
          } catch (e) {
            console.error("Lỗi parse ảnh:", e);
          }

          const firstImage = images[0];
          return (
            <li key={idx} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-2">
                <img
                  src={firstImage}
                  alt={item.productName}
                  className="w-10 h-10 object-cover"
                />
                <div className='flex flex-col'>
                    <span>{item.productName} - {item.color} / {item.size}</span>
                    <span className="text-xs text-gray-500">Số Lượng: {item.quantity}</span>
                </div>
                
               
              </div>
              <div  className="flex items-center gap-4">
                <div > Giá: <span className="text-red-600 font-semibold">{item.productPrice.toLocaleString()}đ</span></div>
              </div>
              
              
            </li>
          );
        })}
      </ul>

      {/* Footer cố định */}
      <div className="p-4 border-t text-right">
        <button
          className="px-4 py-2 text-sm text-red-600 hover:underline"
          onClick={() => setSelectedOrder(null)}
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}


                <Footer />
            </main>
        </div>
    );
};

export default UserOrdersPage;
