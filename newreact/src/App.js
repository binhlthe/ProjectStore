import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/client/HomePage';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import ProductDetail from './components/client/ProductDetail';
import TopPage from './components/client/TopPage';
import BottomPage from './components/client/BottomPage';
import AccessoryPage from './components/client/AccessoryPage';
import AdminDashboard from './components/admin/AdminDashboard';
import NewArrivalPage from './components/client/NewArrivalPage';
import { CartProvider } from "./components/client/CartContext";
import ProductPage from "./components/admin/ProductPage";
import TopPageAdmin from './components/admin/TopPage';
import BottomPageAdmin from './components/admin/BottomPage';
import AccessoryPageAdmin from './components/admin/AccessoryPage'
import ProductDetailAdmin from './components/admin/ProductDetail';
import AddTopPage from './components/admin/AddTopPage';
import AddBottomPage from './components/admin/AddBottomPage';
import AddAccessoryPage from './components/admin/AddAccessoryPage';
import CheckoutPage from './components/client/CheckoutPage';
import AdminOrderPage from './components/admin/AdminOrderPage';
import OrderDetailPage from './components/admin/OrderDetailPage';
import OrderPage from './components/client/OrderPage';
import DepositPage from './components/client/DepositPage';
import OrderSuccessPage from './components/client/OrderSuccessPage';
import ChatBox from './components/client/ChatBox';
import AdminChatPage from './components/admin/AdminChatPage';
import AboutPage from './components/client/AboutPage';
import AdminChatBox from './components/admin/AdminChatBox';
import RevenuePage from './components/admin/RevenuePage';
import TopSellerPage from './components/client/TopSellerPage';
import { AuthProvider } from "./components/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product/top" element={<TopPage />} />
            <Route path="/product/bottom" element={<BottomPage />} />
            <Route path="/product/accessory" element={<AccessoryPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/new-arrival" element={<NewArrivalPage />} />
            <Route path="/admin/product" element={<ProductPage />} />
            <Route path="/admin/product/top" element={<TopPageAdmin />} />
            <Route path="/admin/product/bottom" element={<BottomPageAdmin />} />
            <Route path="/admin/product/accessory" element={<AccessoryPageAdmin />} />
            <Route path="/admin/product/:id" element={<ProductDetailAdmin />} />
            <Route path="/admin/product/top/add" element={<AddTopPage />} />
            <Route path="/admin/product/bottom/add" element={<AddBottomPage />} />
            <Route path="/admin/product/accessory/add" element={<AddAccessoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin/order" element={<AdminOrderPage />} />
            <Route path="/admin/order/detail/:id" element={<OrderDetailPage />} />
            <Route path="/my-orders" element={<OrderPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/success-order" element={<OrderSuccessPage />} />
            <Route path="/chat" element={<ChatBox />} />
            <Route path="/chatAdmin" element={<AdminChatPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/chat" element={<AdminChatBox />} />
            <Route path="/admin/revenue" element={<RevenuePage />} />
            <Route path="/product/top-seller" element={<TopSellerPage />} />

            <Route element={<ProtectedRoute />}>
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
