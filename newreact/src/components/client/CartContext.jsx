import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems);
const user = JSON.parse(localStorage.getItem("user"));
  const userId = user? user.id : null;
  // Tải giỏ hàng từ backend
  useEffect(() => {
     

    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/get`,{
          params: {
        userId: userId
        }
        });
        console.log("abcc"+res.data);
        setCartItems(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [userId]);
console.log(cartItems);
  const addToCart = async(product) =>{
    if (!userId || !product?.id) return;
    console.log(product.id);
    console.log(userId);
    try{
      await axios.get(`http://localhost:8080/api/cart/add`,{
        params: {
        userId: userId,
        productId: product.id,
        quantity: 1
        }
      });

      const existing= cartItems.find((item) => item.id === product.id);
      if(existing){
        setCartItems((prev) =>
        prev.map((item) => item.id === product.id ? {...prev, quantity: item.quantity+1} : item));
      }
      else{
        setCartItems((prev) => [...prev, {...product, quantity:1}]);
      }
    }
    catch(err){
      console.error("Lỗi khi thêm sản phẩm:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${userId}/remove/${productId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await axios.post(`/api/cart/${userId}/increase/${productId}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (err) {
      console.error("Lỗi khi tăng số lượng:", err);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await axios.post(`/api/cart/${userId}/decrease/${productId}`);
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (err) {
      console.error("Lỗi khi giảm số lượng:", err);
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
