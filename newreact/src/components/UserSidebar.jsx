// UserDropdown.jsx
import React, { useState } from 'react'; // Keep useState if you need local state, though for logout it's often not needed directly here
import { FaUserCircle, FaKey, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
// Removed 'Link' import as it's not used for a button click leading to API call
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserDropdown = ({ user, isOpen, onClose }) => {
  // Moved React Hooks inside the functional component
  // const [message, setMessage] = useState(''); // Not strictly needed for logout here, HomePage could handle notifications
  const navigate = useNavigate();

  function handleUserPofile(){
    navigate("/profile");
  }

  const handleLogout = async () => { // Removed 'e' parameter as it's not passed from the button directly
    try {
      const res = await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
      if (res.status === 200) {
        localStorage.removeItem("user");
        alert("Đăng xuất thành công!"); // For quick testing, you can use alert
        onClose(); // Close the dropdown after successful logout
        console.log(user.role);
        if(user && user.role==="ADMIN"){
          navigate("/home");
        }
       window.location.reload(); // Navigate to the home page or login page
      } else {
        // setMessage(res.data); // Handle other success statuses if needed
        alert(res.data); // Show backend message if status is not 200 but not an error
      }
    } catch (err) {
      // setMessage(err.response?.data || 'Lỗi server');
      console.error("Error logging out:", err);
      alert(err.response?.data?.message || 'Đăng xuất thất bại. Vui lòng thử lại.'); // Show error message
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
  isOpen && (
    <div
      className={`absolute right-0 mt-2 w-max bg-white rounded-md shadow-lg py-1 z-50
                  transform transition-all duration-200 ease-out`}
    >
      {user?.username ? (
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
            onClick={
              
             handleUserPofile
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