import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ChatBox from "./ChatBox";
import axios from "axios";
import { FaPhone, FaEnvelope, FaUserEdit, FaBoxOpen, FaMoneyBillWave, FaMars, FaVenus, FaGenderless, FaCalendarAlt } from "react-icons/fa";

function ProfilePage() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  document.title = "PROFILE - Levents";
  const userId = user?.id;

  const [errors, setErrors] = useState({});

  const [stats, setStats] = useState('');
  const [orders, setOrders] = useState('');
  const [total, setTotals] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:8080/api/user/get/${userId}`);
          setStats(res.data);

        } catch (err) {
          console.error("Failed to fetch stats", err);
        }
      }
    };

    const fetchOrder = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:8080/api/order/get/${userId}`);
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch stats", err);
        }
      }
    };

    const fetchTotal = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:8080/api/order/totalSpent/${userId}`);
          setTotals(res.data);
        } catch (err) {
          console.error("Failed to fetch stats", err);
        }
      }
    };

    fetchTotal();
    fetchOrder();
    fetchStats();


  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file); // giống như bạn đang làm

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData
      });

      const uploaded = await response.json(); // trả về mảng URL
      const newAvatarUrl = uploaded[0]; // vì chỉ upload 1 file

      const updatedUser = { ...user, avatar: newAvatarUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Nếu muốn lưu vào DB
      await axios.put(`http://localhost:8080/api/user/update/${user.id}`, updatedUser);

    } catch (err) {
      console.error("Lỗi khi upload avatar:", err);
    }
  };



  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    console.log(user);
    try {
      const res = await axios.put(`http://localhost:8080/api/user/update/${user.id}`, user);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Cập nhật thất bại", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.name.trim()) {
      newErrors.name = "Tên người dùng không được để trống.";
    }

    if (!user.dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh.";
    } else {
      const birthDate = new Date(user.dob);
      const today = new Date();

      if (birthDate > today) {
        newErrors.dob = "Ngày sinh không được lớn hơn hôm nay.";
      }
    }



    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };




  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar user={user} isOpen={sidebarOpen} />

      <main className="flex-1 mt-[72px] p-6 overflow-y-auto bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="bg-blue-500 h-32 sm:h-32 flex items-center justify-center text-white text-2xl font-bold">
            Hồ sơ cá nhân
          </div>

          <div className="p-6 sm:p-10">
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <div className="relative">
                <div className="p-[3px] rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  <img
                    src={user.avatar || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>



                <input
                  type="file"
                  accept="image/*"
                  id="avatarUpload"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                <button
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full text-xs hover:bg-blue-700"
                  onClick={() => document.getElementById("avatarUpload").click()}
                >
                  <FaUserEdit />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <FaUserEdit className="text-gray-500" /> {user.name}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone /> {user.phone || "Chưa cập nhật"}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaCalendarAlt />
                  <span>{user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope /> {user.email || "Chưa cập nhật"}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  {stats.gender === true ? (
                    <FaMars />
                  ) : stats.gender === false ? (
                    <FaVenus />
                  ) : (
                    <FaGenderless className="text-gray-500" />
                  )}
                  <span>
                    {user.gender === true
                      ? "Nam"
                      : user.gender === false
                        ? "Nữ"
                        : "Chưa cập nhật"}
                  </span>
                </div>

              </div>
            </div>

            {/* Thống kê đơn hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-100 p-5 rounded shadow flex items-center gap-4">
                <FaBoxOpen className="text-blue-600 text-3xl" />
                <div>
                  <div className="text-2xl font-bold">{orders}</div>
                  <div className="text-gray-600 text-sm">Đơn hàng đã đặt</div>
                </div>
              </div>
              <div className="bg-green-100 p-5 rounded shadow flex items-center gap-4">
                <FaMoneyBillWave className="text-green-600 text-3xl" />
                <div>
                  <div className="text-2xl font-bold">{total.toLocaleString()}₫</div>
                  <div className="text-gray-600 text-sm">Tổng đã chi tiêu</div>
                </div>
              </div>
            </div>

            {/* Nút cập nhật */}
            <div className="text-center mb-8">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsEditModalOpen(true)}
              >
                Cập nhật thông tin
              </button>
            </div>

            {/* Thông tin bổ sung */}
            <div className="border-t pt-6 text-gray-600 text-sm space-y-2">
              <p><strong>Ngày tham gia:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Không rõ"}</p>
              <p><strong>Vai trò:</strong> {user.role || "Khách hàng"}</p>
              <p><strong>Trạng thái:</strong> {user.status ? "Hoạt động" : "Đang bị khóa"}</p>
            </div>
          </div>


        </div>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-xl font-bold mb-4">Cập nhật thông tin</h2>
              <div>
                <label className="text-gray-500">Tên</label>
                <input
                  type="text"
                  placeholder="Tên"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.name && <p className="text-red-600 font-medium mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-gray-500">Ngày sinh</label>
                <input
                  type="date"
                  value={
                    user.dob
                      ? new Date(user.dob).toISOString().split("T")[0] // chuyển sang yyyy-MM-dd
                      : ""
                  }
                  onChange={(e) => setUser({ ...user, dob: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.dob && <p className="text-red-600 font-medium mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="text-gray-500">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="text-gray-500">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="text-gray-500">Giới tính</label>
                <select
                  value={user.gender === true ? "male" : user.gender === false ? "female" : ""}
                  onChange={(e) =>
                    setUser({ ...user, gender: e.target.value === "male" ? true : false })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>


              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleUpdateProfile}
                >
                  Lưu
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
}

export default ProfilePage;
