import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import UserDropdown from '../UserSidebar';
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext"; // ✅ dùng context giỏ hàng
import Footer from "../Footer";
import Navbar from "../Navbar";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sizes, setSizes] = useState([]);

  const { addToCart } = useCart(); // ✅ lấy hàm thêm giỏ hàng từ context

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(res.data);
        document.title = res.data.name;
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };

    const fetchSizes = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}/sizes`);
        setSizes(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy size:", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.post('http://localhost:8080/api/user/profile', {}, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchProduct();
    fetchProfile();
    fetchSizes();
  }, [id]);

  // ✅ Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    console.log(product);
    addToCart(product);
  };

  if (!product) return <div>Đang tải...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user}/>
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main content */}
      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md">
          <img src={product.image} alt={product.name} className="rounded-lg w-full h-[590px] object-cover" />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl text-red-600 font-semibold">
                {Number(product.price).toLocaleString('vi-VN')} ₫
              </p>
            </div>

            {sizes.length > 0 && (
              <div className="mt-4">
                <h2 className="font-semibold mb-2">Size</h2>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 border rounded hover:bg-black hover:text-white transition"
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Nút thêm vào giỏ hàng */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white py-3 mt-6 rounded hover:bg-gray-800 transition"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t pt-4 mt-8 text-sm text-center text-gray-500">
          <p>Liên hệ: support@levents.vn | Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
          <p>&copy; 2025 Levents. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default ProductDetail;
