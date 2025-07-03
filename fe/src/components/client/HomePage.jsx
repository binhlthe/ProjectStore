// HomePage.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from "./ChatBox";

function HomePage() {
  const  [setShowUserDropdown] = useState(false);
  const [user] = useState(() => {
    // Lấy từ localStorage khi load lại trang
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;

  });
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  

  // Refs for click-outside detection
  const dropdownContainerRef = useRef(null); // Ref for the div wrapping user icon and dropdown

  useEffect(() => {


    const fetchProducts = async () => {
      try {
        const res1 = await axios.get('http://localhost:8080/api/products/tops');
        const res2 = await axios.get('http://localhost:8080/api/products/bottoms');
        const res3 = await axios.get('http://localhost:8080/api/products/accessories');
        const res4 = await axios.get('http://localhost:8080/api/products/new-arrivals');
        console.log(res1.data);



        setTops(res1.data); // Lưu vào state đã có price
        console.log(tops);
        setBottoms(res2.data);
        setAccessories(res3.data);
        setNewArrivals(res4.data);

      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };


    fetchProducts();
  }, []);

  // Effect to close dropdown when clicking outside its container (icon or dropdown itself)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleViewTop() {
    navigate("/product/top");
  }

  function handleViewBottom() {
    navigate("/product/bottom");
  }

  function handleViewNewArrival() {
    navigate("/product/new-arrival");
  }

  function handleViewAccessory() {
    navigate("/product/accessory");
  }

  useEffect(() => {
    document.title = "Levents";
  }, []);

  const ProductDetail = ({ product, isNew }) => {
    const navigate = useNavigate(); // Hook điều hướng

    const handleClick = () => {
      navigate(`/product/${product.id}`); // Điều hướng sang trang chi tiết
    };

    return (
      <div
        className="relative border rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all bg-white p-3 flex flex-col cursor-pointer"
        onClick={handleClick}
      >

        <div className="relative w-full aspect-[3/4] mb-2">
          <img
            src={product.thumbnailImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          {isNew && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="text-red-500 font-medium">{Number(product.price).toLocaleString('vi-VN')} ₫</p>
      </div>

    );
  };



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Bar */}

      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar user={user} isOpen={sidebarOpen} />


      {/* Main Content */}
      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
        <div>
          <img
            src="/images/banner.png"
            alt="Banner"
            className="rounded-xl w-full h-[70vh] object-cover shadow-md"
          />
        </div>

        {/* New arrival */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-900 uppercase">NEW ARRIVAL</h2>
            <button
              onClick={handleViewNewArrival}
              className="relative overflow-hidden bg-black text-white text-sm font-semibold uppercase px-6 py-2 rounded shadow-lg transition-all duration-300 ease-in-out 
             hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 border border-transparent hover:border-black"
            >
              Xem tất cả
            </button>



          </div>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {newArrivals.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} isNew={true} />
              </SwiperSlide>
            ))}

          </Swiper>
        </section>

        {/* Top */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-900 uppercase">TOP</h2>
            <button
              onClick={handleViewTop}
              className="relative overflow-hidden bg-black text-white text-sm font-semibold uppercase px-6 py-2 rounded shadow-lg transition-all duration-300 ease-in-out 
             hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 border border-transparent hover:border-black"
            >
              Xem tất cả
            </button>

          </div>

          <Swiper
            modules={[Navigation]}
            navigation
            loop
            grabCursor
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >

            {tops.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Bottom */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-900 uppercase">BOTTOM</h2>
            <button
              onClick={handleViewBottom}
              className="relative overflow-hidden bg-black text-white text-sm font-semibold uppercase px-6 py-2 rounded shadow-lg transition-all duration-300 ease-in-out 
             hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 border border-transparent hover:border-black"
            >
              Xem tất cả
            </button>

          </div>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {bottoms.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>


        {/* Accessory */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-900 uppercase">ACCESSORY</h2>
            <button
              onClick={handleViewAccessory}
              className="relative overflow-hidden bg-black text-white text-sm font-semibold uppercase px-6 py-2 rounded shadow-lg transition-all duration-300 ease-in-out 
             hover:bg-white hover:text-black hover:shadow-xl hover:scale-105 border border-transparent hover:border-black"
            >
              Xem tất cả
            </button>

          </div>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {accessories.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <ChatBox />
        <Footer />
      </main>
    </div>
  );
}

export default HomePage;