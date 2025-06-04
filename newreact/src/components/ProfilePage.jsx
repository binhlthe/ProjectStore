import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    console.log(cached);
    return cached ? JSON.parse(cached) : null;
  });




  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user} />
      <Sidebar user={user} />

      <main className="flex-1 mt-[72px] p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
          <h1 className="text-3xl font-bold mb-4">Thông tin cá nhân</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500">Tên người dùng</label>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-gray-500">Avatar</label>
              <img className="text-lg font-medium" src={user.avatar}></img>
            </div>
            <div>
              <label className="text-gray-500">Số điện thoại</label>
              <p className="text-lg font-medium">{user.phone || "Chưa cập nhật"}</p>
            </div>

            <div>
              <label className="text-gray-500">Địa chỉ</label>
              <p className="text-lg font-medium">{user.name || "Chưa cập nhật"}</p>
            </div>



          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default ProfilePage;
