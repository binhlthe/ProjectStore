import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaShippingFast, FaCheckCircle, FaTrashAlt, FaTimesCircle } from 'react-icons/fa';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from './ChatBox';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);



const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];


const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const [user] = useState(() => {
    // Lấy từ localStorage khi load lại trang
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;

  });

  document.title = "ORDER - Levents";
  const handleCancelOrder = (orderId) => {
    MySwal.fire({
      title: 'Bạn chắc chắn muốn hủy đơn?',
      text: "Thao tác này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Đóng'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:8080/api/admin/order/${orderId}/cancel`);
          Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy.', 'success');

          fetchOrders(); // load lại danh sách
        } catch (err) {
          Swal.fire('Lỗi', 'Không thể hủy đơn hàng', 'error');
        }
      }
    });
  };

  const handleMarkAsDelivered = (orderId) => {
    MySwal.fire({
      title: 'Xác nhận đã nhận hàng?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Đã nhận',
      cancelButtonText: 'Đóng'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`http://localhost:8080/api/order/confirm-received/${orderId}`);
          Swal.fire('Thành công', 'Đơn hàng đã đánh dấu là đã nhận.', 'success');
          fetchOrders();
        } catch (err) {
          Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng.', 'error');
        }
      }
    });
  };


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

  const renderOrderStatus = (status) => {
    const statusMap = {
      PENDING: {
        label: "Chờ xử lý",
        icon: <FaBox />,
        color: "bg-yellow-100 text-yellow-800",
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        icon: <FaCheckCircle />,
        color: "bg-blue-100 text-blue-800",
      },
      SHIPPING: {
        label: "Đang giao",
        icon: <FaShippingFast />,
        color: "bg-purple-100 text-purple-800",
      },
      DELIVERED: {
        label: "Đã giao",
        icon: <FaCheckCircle />,
        color: "bg-green-100 text-green-800",
      },
      CANCELLED: {
        label: "Đã hủy",
        icon: <FaTimesCircle />,
        color: "bg-red-100 text-red-800",
      },
      default: {
        label: "Không rõ",
        icon: <FaBox />,
        color: "bg-gray-100 text-gray-800",
      },
    };

    const s = statusMap[status] || statusMap.default;



    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded ${s.color}`}>
        {s.icon} {s.label}
      </span>
    );
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar user={user} isOpen={sidebarOpen} />
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
              <div
                key={order.id}
                className="border rounded-lg p-5 bg-white shadow-sm flex justify-between"
              >
                {/* LEFT: Info + Detail */}
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Mã đơn: #{order.id}</div>
                  <div className="text-sm text-gray-700">
                    {`${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`}
                  </div>
                  <div className="text-sm text-gray-700">
                    Tổng tiền: <span className="text-red-600 font-semibold">{order.totalAmount.toLocaleString()}₫</span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>

                {/* RIGHT: Status + Action */}
                <div className="flex flex-col items-end justify-between space-y-2">
                  {renderOrderStatus(order.status)}

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="mt-2 px-4 py-2 bg-red-50 text-red-600 border border-red-300 rounded hover:bg-red-100 text-sm flex items-center gap-1"
                    >
                      <FaTrashAlt className="text-red-500" />
                      Hủy đơn hàng
                    </button>
                  )}

                  {order.status === 'SHIPPING' && (
                    <button
                      onClick={() => handleMarkAsDelivered(order.id)}
                      className="mt-2 px-4 py-2 bg-green-50 text-green-600 border border-green-300 rounded hover:bg-green-100 text-sm flex items-center gap-1"
                    >
                      <FaCheckCircle className="text-green-500" />
                      Đã nhận hàng
                    </button>
                  )}
                </div>
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
                      <div className="flex items-center gap-4">
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
        <ChatBox />

        <Footer />
      </main>
    </div>
  );
};

export default UserOrdersPage;
