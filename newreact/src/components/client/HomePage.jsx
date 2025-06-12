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

function HomePage() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(() => {
    // Lấy từ localStorage khi load lại trang
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;

  });
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

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
        const productTops = res1.data || [];
        const productBottoms = res2.data || [];
        const productAccessories = res3.data || [];
        const productNewArrivals = res4.data || [];
        // Gọi tiếp API để lấy variants và tính giá nhỏ nhất
        const productTopsWithPrices = await Promise.all(
          productTops.map(async (product) => {
            try {
              console.log(product.id);
              const variantRes = await axios.get(`http://localhost:8080/api/productVariant/product/${product.id}`);
              const variants = variantRes.data || [];

              // Tìm giá thấp nhất
              const lowestPrice = variants.length > 0
                ? Math.min(...variants.map(v => v.price))
                : null;

              // Gán giá thấp nhất vào object product mới (không ảnh hưởng entity)
              return {
                ...product,
                price: lowestPrice
              };
            } catch (err) {
              console.error("Error fetching variants:", err);
              return {
                ...product,
                price: null
              };
            }
          })
        );

        const productBottomsWithPrices = await Promise.all(
          productBottoms.map(async (product) => {
            try {
              console.log(product.id);
              const variantRes = await axios.get(`http://localhost:8080/api/productVariant/product/${product.id}`);
              const variants = variantRes.data || [];

              // Tìm giá thấp nhất
              const lowestPrice = variants.length > 0
                ? Math.min(...variants.map(v => v.price))
                : null;

              // Gán giá thấp nhất vào object product mới (không ảnh hưởng entity)
              return {
                ...product,
                price: lowestPrice
              };
            } catch (err) {
              console.error("Error fetching variants:", err);
              return {
                ...product,
                price: null
              };
            }
          })
        );

         const productAccessoriesWithPrices = await Promise.all(
          productAccessories.map(async (product) => {
            try {
              console.log(product.id);
              const variantRes = await axios.get(`http://localhost:8080/api/productVariant/product/${product.id}`);
              const variants = variantRes.data || [];

              // Tìm giá thấp nhất
              const lowestPrice = variants.length > 0
                ? Math.min(...variants.map(v => v.price))
                : null;

              // Gán giá thấp nhất vào object product mới (không ảnh hưởng entity)
              return {
                ...product,
                price: lowestPrice
              };
            } catch (err) {
              console.error("Error fetching variants:", err);
              return {
                ...product,
                price: null
              };
            }
          })
        );

        const productNewArrivalsWithPrices = await Promise.all(
          productNewArrivals.map(async (product) => {
            try {
              console.log(product.id);
              const variantRes = await axios.get(`http://localhost:8080/api/productVariant/product/${product.id}`);
              const variants = variantRes.data || [];

              // Tìm giá thấp nhất
              const lowestPrice = variants.length > 0
                ? Math.min(...variants.map(v => v.price))
                : null;

              // Gán giá thấp nhất vào object product mới (không ảnh hưởng entity)
              return {
                ...product,
                price: lowestPrice
              };
            } catch (err) {
              console.error("Error fetching variants:", err);
              return {
                ...product,
                price: null
              };
            }
          })
        );

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

  const ProductDetail = ({ product }) => {
    const navigate = useNavigate(); // Hook điều hướng

    const handleClick = () => {
      navigate(`/product/${product.id}`); // Điều hướng sang trang chi tiết
    };

    return (
      <div
        className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-all cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={product.thumbnailImage}
          alt={product.name}
          className="w-full h-auto object-contain aspect-[3/4] rounded-md mb-2"
        />

        <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        <p className="text-red-600">{Number(product.price).toLocaleString('vi-VN')} ₫</p>
      </div>
    );
  };



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Bar */}

      <Navbar user={user} />
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8 ">
        {/* Removed the overlay div as requested */}


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
            <button onClick={handleViewNewArrival} className="bg-black text-white text-sm font-normal uppercase px-5 py-2 rounded hover:bg-gray-800 transition">
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
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Top */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wide text-gray-900 uppercase">TOP</h2>
            <button onClick={handleViewTop} className="bg-black text-white text-sm font-normal uppercase px-5 py-2 rounded hover:bg-gray-800 transition">
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
            <button onClick={handleViewBottom} className="bg-black text-white text-sm font-normal uppercase px-5 py-2 rounded hover:bg-gray-800 transition">
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
            <button onClick={handleViewAccessory} className="bg-black text-white text-sm font-normal uppercase px-5 py-2 rounded hover:bg-gray-800 transition">
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

        <Footer />
      </main>
    </div>
  );
}

export default HomePage;