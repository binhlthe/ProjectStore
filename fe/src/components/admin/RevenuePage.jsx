import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RevenuePage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  document.title = "REVENUE - Levents";

  const [filter, setFilter] = useState({
    year: "",
    month: "",
    day: ""
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/revenue/get", {
        params: {
          year: filter.year || undefined,
          month: filter.month || undefined,
          day: filter.day || undefined
        }
      });
      setTotalRevenue(res.data.totalRevenue);
      setDailyRevenue(res.data.dailyRevenue);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar user={user} isOpen={sidebarOpen} />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden mt-6">
        {/* Navbar */}


        {/* Page content */}
        <div className="p-6 mt-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-4 mt-6">Thống kê doanh thu</h2>
          <div className="flex gap-4 mb-6">
            <select
              className="border px-2 py-1 rounded"
              value={filter.year}
              onChange={(e) => setFilter({ ...filter, year: e.target.value })}
            >
              <option value="">Chọn năm</option>
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              className="border px-2 py-1 rounded"
              value={filter.month}
              onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            >
              <option value="">Chọn tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="border px-2 py-1 rounded"
              value={filter.day}
              onChange={(e) => setFilter({ ...filter, day: e.target.value })}
            >
              <option value="">Chọn ngày</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <button
              onClick={fetchRevenue}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lọc
            </button>
          </div>

          {/* Tổng doanh thu */}
          <div className="bg-green-100 border border-green-300 p-4 rounded shadow mb-6 w-full">

            <h3 className="text-xl font-semibold text-green-700">
              Tổng doanh thu: {totalRevenue.toLocaleString()} VND
            </h3>
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="w-full h-96 bg-white border rounded shadow mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenue}
                margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="orderDay"
                  tick={{ fontSize: 12, dy: 10 }} // đẩy chữ X xuống
                  padding={{ left: 20, right: 20 }}
                />

                <YAxis
                  tickFormatter={(val) => `${val / 1000}k`}
                  tick={{ fontSize: 12, dx: -5 }} // đẩy chữ Y ra xa trục
                />

                <Tooltip formatter={(val) => `${val.toLocaleString()} VND`} />

                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }} // điểm bo tròn đẹp
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Bảng thống kê */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm bg-white rounded shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-6 py-3 text-left font-semibold text-gray-600">Ngày</th>
                  <th className="border px-6 py-3 text-right font-semibold text-gray-600">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailyRevenue.map((item) => (
                  <tr key={item.orderDay} className="hover:bg-gray-50 transition-all">
                    <td className="border px-6 py-3">{item.orderDay}</td>
                    <td className="border px-6 py-3 text-right font-medium">
                      {item.totalRevenue.toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Chatbox admin (nếu cần) */}
        <AdminChatBox />
      </div>
    </div>
  );
};

export default RevenuePage;
