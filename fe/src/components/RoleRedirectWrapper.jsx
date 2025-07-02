import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RoleRedirectWrapper = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // "checking" | "allowed" | "redirect"
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // Chưa login thì cho vào tất cả trang client (tuỳ bạn cấu hình)
      setStatus("allowed");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Không có quyền
      const redirect = user.role === "ADMIN" ? "/admin" : "/home";
      setRedirectPath(redirect);
      setStatus("redirect");
      return;
    }

    setStatus("allowed");
  }, [location.pathname, allowedRoles]);

  // ⚠️ Trạng thái loading, chưa xác định role
  if (status === "checking") return null;

  // ⚠️ Không có quyền => điều hướng
  if (status === "redirect" && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Có quyền => render bình thường
  return children;
};

export default RoleRedirectWrapper;
