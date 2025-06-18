import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  // Tải giỏ hàng từ backend
  useEffect(() => {


    const fetchCart = async () => {
      console.log(userId);
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/get`, {
          params: {
            userId: userId
          }
        });
        console.log(res.data);
        setCartItems(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [userId]);
  console.log(cartItems);

  const addToCart = async (product) => {
    console.log(userId);
    try {
      await axios.post(`http://localhost:8080/api/cart/add`, {

        userId: userId,
        productVariantId: product.productVariantId,
        quantity: 1

      });

      const response = await axios.get(`http://localhost:8080/api/cart/get`, {
        params: { userId: userId }
      });

      // Cập nhật lại giỏ hàng từ backend
      setCartItems(response.data);
    }
    catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
    }
  };

  const removeFromCart = async (productId) => {
    const confirmResult = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove`, {
          params: {
            userId: userId,
            productVariantId: productId
          }
        });

        const response = await axios.get(`http://localhost:8080/api/cart/get`, {
          params: { userId: userId }
        });

        setCartItems(response.data);

        Swal.fire({
          title: 'Đã xóa!',
          text: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
          icon: 'error'
        });
      }
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await axios.post(`http://localhost:8080/api/cart/add`, {

        userId: userId,
        productVariantId: productId,
        quantity: 1

      });
      const response = await axios.get(`http://localhost:8080/api/cart/get`, {
        params: { userId: userId }
      });

      // Cập nhật lại giỏ hàng từ backend
      setCartItems(response.data);
    } catch (err) {
      console.error("Lỗi khi tăng số lượng:", err);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(item => item.productVariantId === productId);

    if (!item) return; // Không tìm thấy sản phẩm

    if (item.quantity === 1) {
      const result = await Swal.fire({
        title: 'Số lượng là 1',
        text: 'Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`http://localhost:8080/api/cart/remove`, {
          params: {
            userId: userId,
            productVariantId: productId,
          },
        });

        const response = await axios.get(`http://localhost:8080/api/cart/get`, {
          params: { userId: userId }
        });
        setCartItems(response.data);

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa sản phẩm khỏi giỏ hàng',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
        });
      }
    } else {
      try {
        await axios.post(`http://localhost:8080/api/cart/decrease`, {
          userId: userId,
          productVariantId: productId,
          quantity: 1
        });

        const response = await axios.get(`http://localhost:8080/api/cart/get`, {
          params: { userId: userId }
        });
        setCartItems(response.data);
      } catch (err) {
        console.error("Lỗi khi giảm số lượng:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể giảm số lượng. Vui lòng thử lại.',
        });
      }
    }
  };


  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
