import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from "./ChatBox";
import { FaCheckCircle, FaTshirt, FaHeadset } from "react-icons/fa";

const AboutPage = () => {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "ABOUT - Levents";

    return (
        <div className="flex h-screen bg-gray-50">

            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar user={user} isOpen={sidebarOpen} />

            <main className="flex-1 mt-[36px] p-8 overflow-y-auto">
                {/* Giới thiệu */}
                <section className="py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-10 max-w-6xl mx-auto">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 inline-block">
                            Giới thiệu
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            Chúng tôi là một cửa hàng thời trang tiên phong trong việc cung cấp các sản phẩm hiện đại, chất lượng và hợp thời trang. Với đội ngũ thiết kế sáng tạo và quy trình sản xuất chuyên nghiệp, chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg border">
                        <img
                            src="/images/banner.png"
                            alt="Giới thiệu"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </section>

                {/* Sứ mệnh */}
                <section className="bg-gray-50 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto py-12">
                    <div className="rounded-xl overflow-hidden shadow border border-gray-200">
                        <img
                            src="/images/mission.png"
                            alt="Mission"
                            className="w-full h-64 object-cover md:h-80 transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 inline-block">
                            Sứ mệnh
                        </h2>

                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            Sứ mệnh của chúng tôi là truyền cảm hứng cho giới trẻ thông qua thời trang.
                            Chúng tôi luôn đổi mới và cập nhật xu hướng để tạo ra những bộ sưu tập phản ánh
                            phong cách cá nhân và sự tự tin của mỗi người.
                        </p>
                    </div>
                </section>


                {/* --- LÝ DO CHỌN CHÚNG TÔI --- */}
                <section className="bg-indigo-50 py-12 max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 inline-block pb-1">
                        Lý do chọn chúng tôi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Chất lượng cao */}
                        <div className="p-6 bg-sky-50 rounded-xl shadow hover:shadow-md transform hover:-translate-y-1 transition-all duration-200">
                            <div className="text-indigo-600 mb-3 text-3xl">
                                <FaCheckCircle />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chất lượng cao</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Sản phẩm được chọn lọc kỹ lưỡng từ chất liệu đến quy trình sản xuất, đảm bảo chất lượng vượt trội.
                            </p>
                        </div>


                        {/* Mẫu mã đa dạng */}
                        <div className="p-6 bg-yellow-50 rounded-xl shadow hover:shadow-md transform hover:-translate-y-1 transition-all duration-200">
                            <div className="text-yellow-600 mb-3 text-3xl">
                                <FaTshirt />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mẫu mã đa dạng</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Cập nhật xu hướng liên tục với nhiều kiểu dáng phù hợp mọi cá tính và phong cách sống.
                            </p>
                        </div>

                        {/* Hỗ trợ tận tâm */}
                        <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-md transform hover:-translate-y-1 transition-all duration-200">
                            <div className="text-green-600 mb-3 text-3xl">
                                <FaHeadset />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ tận tâm</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ trước và sau khi mua hàng một cách chuyên nghiệp.
                            </p>
                        </div>
                    </div>
                </section>



                <ChatBox />
                <Footer />
            </main>
        </div>
    );
};

export default AboutPage;
