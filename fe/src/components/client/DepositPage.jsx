import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from "./ChatBox";


const DepositPage = ({ }) => {
    const bankCode = "TPB"; // mã ngân hàng (ví dụ: MB = MB Bank)
    const accountNumber = "06159974001"; // số tài khoản nhận tiền
    const accountName = "Le Tien Binh"; // tên tài khoản nhận tiền
    const [timestamp, setTimestamp] = useState(Date.now()); // để làm QR thay đổi
    const [transactionCode, setTransactionCode] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const userId = user.id;

    document.title = "DEPOSIT - Levents";

    const [amount, setAmount] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const fetchTransactions = async () => {
        console.log(userId);
        try {
            const res = await axios.get(`http://localhost:8080/api/wallet/user/${userId}`, {
                withCredentials: true
            });
            setTransactions(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử nạp:", error);
        }
    };

    useEffect(() => {

        if (userId) {
            fetchTransactions();
        }
    }, [userId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ.");
            return;
        }

        const code = `NAP_UID${userId}_${Date.now()}`;
        setTransactionCode(code);
        setTimestamp(Date.now()); // reset QR lần đầu
        setSubmitted(true);


        try {
            await axios.post("http://localhost:8080/api/wallet/handle", {
                userId,
                amount: parseInt(amount),
                transactionCode: code
            }, {
                withCredentials: true // nếu đang dùng cookie auth
            });

            fetchTransactions();
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu nạp tiền:", error);
            alert("Không thể gửi yêu cầu nạp tiền. Vui lòng thử lại.");
        }
    };

    const qrLink = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${transactionCode}&accountName=${accountName}&t=${timestamp}`;

    useEffect(() => {
        if (!submitted) return;

        const interval = setInterval(() => {
            setTimestamp(Date.now()); // cập nhật timestamp để QR đổi
        }, 60000); // 1 phút

        return () => clearInterval(interval); // cleanup
    }, [submitted]);

    return (
        <div className="flex h-screen bg-gray-100">

            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar user={user} isOpen={sidebarOpen} />
            <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
                <h1 className="text-xl font-bold mb-4">Nạp tiền vào ví</h1>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-left font-medium">
                            Nhập số tiền muốn nạp (VNĐ):
                        </label>
                        <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Tạo mã QR
                        </button>
                    </form>
                ) : (
                    <div>
                        <div className="bg-gray-100 p-4 rounded mb-4 text-left">
                            <p><strong>Ngân hàng:</strong> TP Bank</p>
                            <p><strong>Số tài khoản:</strong> {accountNumber}</p>
                            <p><strong>Chủ tài khoản:</strong> {accountName}</p>
                            <p><strong>Số tiền:</strong> {parseInt(amount).toLocaleString()} VNĐ</p>
                            <p><strong>Nội dung chuyển khoản:</strong> <span className="text-blue-600">{transactionCode}</span></p>
                        </div>

                        <p className="mb-2">Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản:</p>
                        <img key={timestamp} src={qrLink} alt="QR Code" className="mx-auto w-64 h-64 border" />

                        <p className="text-sm text-gray-500 mt-4">
                            Sau khi chuyển khoản, hệ thống sẽ tự động ghi nhận nếu bạn nhập đúng nội dung.
                        </p>

                        <button
                            className="mt-4 text-blue-600 hover:underline"
                            onClick={() => setSubmitted(false)}
                        >
                            Quay lại
                        </button>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Lịch sử nạp tiền</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 border">Giao dịch</th>
                                    <th className="px-4 py-2 border">Mã nạp</th>
                                    <th className="px-4 py-2 border">Trạng thái</th>
                                    <th className="px-4 py-2 border">Số tiền</th>
                                    <th className="px-4 py-2 border">Ngày nạp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((item) => (
                                        <tr key={item.id} className="text-center">
                                            <td className="px-4 py-2 border text-red-600 font-medium">{item.id}</td>
                                            <td className="px-4 py-2 border">{item.transactionCode}</td>
                                            <td className="px-4 py-2 border">{item.status === 'PENDING' ? 'Chờ chuyển khoản' : 'Đã chuyển khoản'}</td>
                                            <td className="px-4 py-2 border">{item.amount.toLocaleString()}đ</td>
                                            <td className="px-4 py-2 border">{new Date(item.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2 border text-center" colSpan="6">Chưa có giao dịch nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ChatBox />
                <Footer />
            </main>

        </div>
    );
};

export default DepositPage;
