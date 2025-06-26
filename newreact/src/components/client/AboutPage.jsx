import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from "./ChatBox";

const AboutPage = () => {
    const [user, setUser] = useState(() => {
        // Lấy từ localStorage khi load lại trang
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;

    });
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Top Bar */}

            <Navbar user={user} />
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content */}
            <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
                {/* --- BACKGROUND INFORMATION --- */}
                <section className="flex flex-col-reverse md:flex-row items-center gap-10 font-saira mb-16">
                    <div className="w-full md:w-1/2 h-[300px] rounded-2xl overflow-hidden shadow-md border border-gray-300">
                        <img
                            src="/images/banner.png"
                            alt="Mission"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>


                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-600 mb-4 font-inter">Giới thiệu</h2>
                        <p className="text-black-700 text-xl ">
                            Chúng tôi là một cửa hàng thời trang tiên phong trong việc cung cấp
                            các sản phẩm hiện đại, chất lượng và hợp thời trang. Với đội ngũ thiết
                            kế sáng tạo và quy trình sản xuất chuyên nghiệp, chúng tôi cam kết
                            mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
                        </p>
                    </div>
                </section>

                {/* --- MISSION --- */}
                <section className="flex flex-col-reverse md:flex-row items-center gap-10 font-saira mb-16">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-600 mb-4">Sứ mệnh</h2>
                        <p className="text-black-700 text-xl">
                            Sứ mệnh của chúng tôi là truyền cảm hứng cho giới trẻ thông qua thời
                            trang. Chúng tôi luôn đổi mới và cập nhật xu hướng để tạo ra những
                            bộ sưu tập phản ánh phong cách cá nhân và sự tự tin của mỗi người.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 h-[300px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
                        <img
                            src="/images/mission.png"
                            alt="Mission"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </section>


                {/* --- CONTACT --- */}
                <section className="text-center font-saira">
                    <h2 className="text-3xl font-bold text-gray-600 mb-4">Liên hệ</h2>
                    <p className="text-black-700 text-xl">
                        Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                    </p>
                    <p className="text-black-700 text-xl">Hotline: 0123 456 789</p>
                    <p className="text-black-700 text-xl">Email: support@fashionstore.vn</p>
                </section>
                <ChatBox/>
            </main>
        </div>
    );
};

export default AboutPage;
