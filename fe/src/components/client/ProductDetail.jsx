import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useCart } from "./CartContext";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from './ChatBox';
import Swal from 'sweetalert2';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const colorOptions = [
    'Trắng', 'Đen', 'Xám', 'Xanh navy', 'Xanh dương', 'Xanh lá',
    'Hồng', 'Đỏ', 'Nâu', 'Cam', 'Vàng', 'Be', 'Tím'
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  console.log(variants);

  const allColors = [...new Set(variants.map(v => v.color))].sort(
    (a, b) => colorOptions.indexOf(a) - colorOptions.indexOf(b)
  );
  const allSizes = [...new Set(variants.map(v => v.size))].sort((a, b) => {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return order.indexOf(a) - order.indexOf(b);
  });

  console.log(allColors);
  // Những size có thể chọn theo selectedColor

  const isColorAvailable = (color) => {
    if (!selectedSize) return true; // Nếu chưa chọn size thì mọi color đều có thể chọn

    // Nếu có ít nhất 1 variant khớp với selectedSize và color này → hợp lệ
    return variants.some(v => v.color === color && v.size === selectedSize);
  };
  const isSizeAvailable = (size) => {
    if (!selectedColor) return true; // Nếu chưa chọn color thì mọi size đều có thể chọn

    // Nếu có ít nhất 1 variant khớp với selectedColor và size này → hợp lệ
    return variants.some(v => v.size === size && v.color === selectedColor);
  };


  const selectedVariant = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );


  const imagesToDisplay =
    selectedVariant?.images ||
    variants.find(v => v.color === selectedColor)?.images ||
    [];


  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin sản phẩm
        const productRes = await axios.get(`http://localhost:8080/api/products/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        document.title = productData.name;

        // Lấy danh sách biến thể
        const variantRes = await axios.get(`http://localhost:8080/api/productVariant/product/${id}`);
        const variantList = (variantRes.data || []).sort((a, b) => {
          const colorDiff = colorOptions.indexOf(a.color) - colorOptions.indexOf(b.color);
          if (colorDiff !== 0) return colorDiff;
          return sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size);
        });


        console.log(variantList);

        if (variantList.length > 0) {
          const allImages = variantList.flatMap(v => v.images || []);
          if (allImages.length > 0) {
            setCurrentImage(allImages[0]);
          }
        }

        console.log(variantList);
        setVariants(variantList);
        // Tìm giá thấp nhất
        const lowestPrice = variantList.length > 0
          ? Math.min(...variantList.map(v => v.price))
          : null;

        console.log(lowestPrice);

        // Gán giá thấp nhất vào object product mới (không ảnh hưởng entity)
        const productWithPrice = {
          ...productData,
          price: lowestPrice
        };
        console.log(productWithPrice);
        setProduct(productWithPrice);

      } catch (err) {
        console.error("Error fetching variants:", err);
        return {
          ...product,
          price: null
        };
      }

    };



    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedColor) {
      const variant = variants.find(v => v.color === selectedColor);
      if (variant && variant.images?.length > 0) {
        setCurrentImage(variant.images[0]);
      }
    }
  }, [selectedColor]);

  const handleAddToCart = () => {
    if (!user || user.role !== 'USER') {
      Swal.fire({
        icon: 'warning',
        title: 'Bạn phải đăng nhập!',
        text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        confirmButtonText: 'OK'
      });
      return;
    }
    const selectedVariant = variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );

    if (!selectedVariant) {
      alert("Không tìm thấy biến thể phù hợp.");
      return;
    }

    const itemToCart = {
      userId: user.id,
      productVariantId: selectedVariant.id,
      quantity: 1
    };

    console.log(itemToCart);

    addToCart(itemToCart);
  };

  if (!product) return <div>Đang tải...</div>;

  const colors = [...new Set(variants.map(v => v.color))];
  const sizes = [...new Set(variants.map(v => v.size))];

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar user={user} isOpen={sidebarOpen} />
      <main className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-6 gap-6">
            {/* Danh sách ảnh nhỏ bên trái */}
            <div className="flex flex-col col-span-1 gap-3">
              {imagesToDisplay.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`variant image ${index}`}
                  className={`w-full h-24 object-cover rounded cursor-pointer border 
          ${currentImage === img ? 'border-black' : 'border-gray-200'}`}
                  onClick={() => setCurrentImage(img)}
                />
              ))}
            </div>

            {/* Ảnh lớn chính */}
            <div className="col-span-5 flex items-center justify-center">
              <img
                src={currentImage || product?.thumbnailImage}
                alt="main product"
                className="w-full h-[600px] object-contain rounded-lg"
              />
            </div>
          </div>


          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              {selectedVariant ? (
                <p className="text-2xl text-red-600 font-semibold mt-2">
                  {Number(selectedVariant.price).toLocaleString('vi-VN')} ₫
                </p>
              ) : (
                <p className="text-2xl text-red-600 font-semibold mt-2">{Number(product.price).toLocaleString('vi-VN')} ₫</p>
              )}

              {/* Chọn màu */}
              <div className="mt-4">
                <p className="font-semibold mb-2">Màu sắc:</p>
                <div className="flex gap-2 flex-wrap">
                  {allColors.map(color => {
                    const isSelected = selectedColor === color;
                    const isAvailable = isColorAvailable(color);

                    return (
                      <button
                        key={color}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedColor('');
                          } else if (isAvailable) {
                            setSelectedColor(color);
                          }
                        }}
                        className={`px-4 py-2 m-1 border rounded
        ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}
        ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}
      `}
                        disabled={!isAvailable}
                      >
                        {color}
                      </button>
                    );
                  })}

                </div>
              </div>


              {/* Chọn size */}
              <div className="mt-4">
                <p className="font-semibold mb-2">Kích thước:</p>
                <div className="flex gap-2 flex-wrap">
                  {allSizes.map(size => {
                    const isSelected = selectedSize === size;
                    const isAvailable = isSizeAvailable(size);

                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSize('');
                          } else if (isAvailable) {
                            setSelectedSize(size);
                          }
                        }}
                        className={`px-4 py-2 m-1 border rounded
        ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}
        ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}
      `}
                        disabled={!isAvailable}
                      >
                        {size}
                      </button>
                    );
                  })}

                </div>
              </div>


            </div>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white py-3 mt-6 rounded hover:bg-gray-800 transition"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <ChatBox />
        <Footer />
      </main>
    </div>
  );
}

export default ProductDetail;
