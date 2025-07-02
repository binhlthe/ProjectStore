import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user || !user.id || user.role === "ADMIN") {
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/cart/get", {
          params: { userId: user.id },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [user?.id]);

  const refreshCart = async () => {
    if (!user?.id) return;
    const res = await axios.get("http://localhost:8080/api/cart/get", {
      params: { userId: user.id },
    });
    setCartItems(res.data);
  };

  const addToCart = async (product) => {
    if (!user?.id) return;
    await axios.post("http://localhost:8080/api/cart/add", {
      userId: user.id,
      productVariantId: product.productVariantId,
      quantity: 1,
    });
    await refreshCart();
  };

  const removeFromCart = async (productId) => {
    if (!user?.id) return;
    const confirm = await Swal.fire({
      title: "Bạn có chắc?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });
    if (!confirm.isConfirmed) return;

    await axios.delete("http://localhost:8080/api/cart/remove", {
      params: { userId: user.id, productVariantId: productId },
    });
    await refreshCart();
    Swal.fire("Đã xoá!", "", "success");
  };

  const increaseQuantity = async (productId) => {
    if (!user?.id) return;
    await axios.post("http://localhost:8080/api/cart/add", {
      userId: user.id,
      productVariantId: productId,
      quantity: 1,
    });
    await refreshCart();
  };

  const decreaseQuantity = async (productId) => {
    if (!user?.id) return;
    const item = cartItems.find(i => i.productVariantId === productId);
    if (!item) return;

    if (item.quantity === 1) {
      const confirm = await Swal.fire({
        title: "Xóa sản phẩm?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xoá",
        cancelButtonText: "Hủy",
      });
      if (!confirm.isConfirmed) return;

      await axios.delete("http://localhost:8080/api/cart/remove", {
        params: { userId: user.id, productVariantId: productId },
      });
    } else {
      await axios.post("http://localhost:8080/api/cart/decrease", {
        userId: user.id,
        productVariantId: productId,
        quantity: 1,
      });
    }
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
