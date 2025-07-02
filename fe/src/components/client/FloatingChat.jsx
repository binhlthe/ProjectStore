import React, { useState } from "react";
import ChatBox from "./ChatBox"; // Nhớ import đúng đường dẫn

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen(!open);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-4">
          <ChatBox />
        </div>
      )}

      {/* Nút avatar tròn để mở chat */}
      <div
        onClick={toggleChat}
        className="w-16 h-16 rounded-full border-4 border-pink-300 overflow-hidden cursor-pointer shadow-lg"
        title="Chat với Admin"
      >
       
      </div>
    </div>
  );
};

export default FloatingChat;
