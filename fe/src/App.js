import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import VerifyResetOtp from "./components/VerifyResetOtp";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";


import { CartProvider } from "./components/client/CartContext";
import { AuthProvider } from "./components/AuthContext";
import RoleRedirectWrapper from "./components/RoleRedirectWrapper";
import { userRoutes, adminRoutes } from "./routesConfig";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            

            {/* User routes */}
            {userRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <RoleRedirectWrapper allowedRoles={["USER"]}>
                    <Component />
                  </RoleRedirectWrapper>
                }
              />
            ))}

            {/* Admin routes */}
            {adminRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <RoleRedirectWrapper allowedRoles={["ADMIN"]}>
                    <Component />
                  </RoleRedirectWrapper>
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
