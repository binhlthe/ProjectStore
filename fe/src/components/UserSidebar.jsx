import React, { useState } from 'react'; // Keep useState if you need local state, though for logout it's often not needed directly here
import { FaUserCircle, FaKey, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import 
import Swal from 'sweetalert2';

const UserDropdown = ({ user, isOpen, onClose }) => {
  // Moved React Hooks inside the functional component
  // const [message, setMessage] = useState(''); // Not strictly needed for logout here, HomePage could handle notifications
  const navigate = useNavigate();

  function handleUserPofile() {
    navigate("/user/profile");
  }

  function handleChangePassword(){
    navigate("/change-password");
  }

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });

      if (res.status === 200) {
        localStorage.removeItem("user");

        await Swal.fire({
          icon: 'success',
          title: 'Đăng xuất thành công!',
          timer: 1500,
          showConfirmButton: false
        });

        onClose(); // Đóng dropdown

        navigate("/home");


        window.location.reload(); // Làm mới trang để reset lại UI
      } else {
        await Swal.fire({
          icon: 'info',
          title: 'Thông báo',
          text: res.data || 'Có vấn đề khi đăng xuất.',
        });
      }

    } catch (err) {
      console.error("Error logging out:", err);

      await Swal.fire({
        icon: 'error',
        title: 'Đăng xuất thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại sau.',
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    isOpen && (
      <div
        className={`absolute right-0 mt-2 w-max bg-white rounded-md shadow-lg py-1 z-50
                  animate-slide-fade-in transition-all duration-300`}
      >
        {user?.username ? (
          <>

            {user.role === "USER" && (
              <>
                <button
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={handleUserPofile}
                >
                  <FaUserCircle className="mr-2 text-lg" />
                  Thông tin cá nhân
                </button>
                <button
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    onClose();
                    navigate("/my-orders");
                  }}
                >
                  <FaClipboardList className="mr-2 text-lg" />
                  Đơn hàng của tôi
                </button>
              </>
            )}

            <button
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              onClick={

                handleChangePassword
              }
            >

              <FaKey className="mr-2 text-lg" />
              Đổi mật khẩu
            </button>
            <button
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2 text-lg" />
              Đăng xuất
            </button>
          </>
        ) : (
          <button
            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            <FaSignOutAlt className="mr-2 text-lg" />
            Đăng nhập
          </button>
        )}
      </div>
    )
  );
};

export default UserDropdown;