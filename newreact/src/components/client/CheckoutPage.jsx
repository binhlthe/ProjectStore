import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const selectedProducts = Array.isArray(location.state?.selectedProducts)
    ? location.state.selectedProducts
    : [];

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const selected = selectedProducts.map(item => item.productVariantId);
      setSelectedItems(selected);
    }
  }, [selectedProducts]);

  const itemsToCheckout =
    selectedItems.length > 0
      ? cartItems.filter(item => selectedItems.includes(item.productVariantId))
      : cartItems;

  const totalAmount = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQuantity = itemsToCheckout.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setWards([]);
      setSelectedWard('');
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards));
    }
  }, [selectedDistrict]);

  const getNameByCode = (list, code) => {
    const found = list.find(item => item.code === parseInt(code));
    return found?.name || '';
  };

  const handlePlaceOrder = async () => {
    if (!fullName || !phone || !selectedProvince || !selectedDistrict || !selectedWard || !addressDetail) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng và chọn phương thức thanh toán.');
      return;
    }

    const orderData = {
      userId: user?.id,
      items: itemsToCheckout.map(item => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.price
      })),
      address: {
        fullName,
        phone,
        province: getNameByCode(provinces, selectedProvince),
        district: getNameByCode(districts, selectedDistrict),
        ward: getNameByCode(wards, selectedWard),
        addressDetail,
      },
      paymentMethod,
      orderDate: new Date().toISOString(), 
      totalPrice: totalAmount

    };

    console.log(orderData);

    if (paymentMethod === 'cod') {
      try {
        const response = await axios.post('http://localhost:8080/api/order/handle', orderData);

        if (response.status === 200 || response.status === 201) {
          alert('Đặt hàng thành công!');
          setSelectedItems([]);
          navigate('/order-confirmation');
        } else {
          alert('Lỗi khi đặt hàng');
        }
      } catch (error) {
        console.error('Lỗi đặt hàng:', error);
        alert('Đã xảy ra lỗi khi gửi đơn hàng.');
      }
    } else if (paymentMethod === 'bank') {
      navigate('/bank-transfer', { state: { orderData } });
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar user={user} />
      <Sidebar user={user} />

      <div className="flex-1 mt-[80px] px-6 pb-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Xác Nhận Đơn Hàng</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sản phẩm */}
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Sản phẩm đã chọn</h3>
            <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {itemsToCheckout.map((item, index) => (
                <li key={index} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <div className="text-lg font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">Màu: {item.color} - Size: {item.size}</div>
                    <div className="text-sm text-gray-600">Số lượng: {item.quantity}</div>
                  </div>
                  <div className="text-red-600 font-semibold text-right min-w-[100px]">
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin giao hàng */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Thông tin giao hàng</h3>

            <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded-lg p-3 text-sm" />
            <input type="tel" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-3 text-sm" />

            <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className="w-full border rounded-lg p-3 text-sm">
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>

            <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!districts.length} className="w-full border rounded-lg p-3 text-sm">
              <option value="">Chọn Quận/Huyện</option>
              {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>

            <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)} disabled={!wards.length} className="w-full border rounded-lg p-3 text-sm">
              <option value="">Chọn Phường/Xã</option>
              {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
            </select>

            <textarea rows={2} placeholder="Mô tả thêm (số nhà, ngõ...)" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} className="w-full border rounded-lg p-3 text-sm" />

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between"><span>Tổng số sản phẩm:</span><span className="font-medium">{totalQuantity}</span></div>
              <div className="flex justify-between"><span>Tạm tính:</span><span>{totalAmount.toLocaleString()} ₫</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{totalAmount.toLocaleString()} ₫</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Phương thức thanh toán</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  Thanh toán khi nhận hàng
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  Chuyển khoản ngân hàng
                </label>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-all duration-200">
              Xác nhận đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
