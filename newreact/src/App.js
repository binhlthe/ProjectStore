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
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from "./components/client/CartContext"; // đường dẫn phù hợp
import ProductPage from "./components/admin/ProductPage";
import TopPageAdmin from './components/admin/TopPage';
import BottomPageAdmin from './components/admin/BottomPage';
import AccessoryPageAdmin from './components/admin/AccessoryPage'

function App() {
  return (
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
          <Route element={<ProtectedRoute />}>
          </Route>

        </Routes>
      </BrowserRouter>
    </CartProvider>

  );
}

export default App;
