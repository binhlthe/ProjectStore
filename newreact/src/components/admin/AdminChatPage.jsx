import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const AdminChatPage = () => {
  const [messagesByUser, setMessagesByUser] = useState({}); // { userId: [msg, msg] }
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");

  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Admin WebSocket connected");

        client.subscribe("/user/queue/messages", (msg) => {
          const message = JSON.parse(msg.body);
          const userId = message.senderId;

          setMessagesByUser((prev) => ({
            ...prev,
            [userId]: [...(prev[userId] || []), message],
          }));
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (!selectedUser || !input.trim()) return;

    const message = {
      senderId: "admin",
      receiverId: selectedUser,
      content: input,
      chatRoomId: "room-1"
    };

    stompClient.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    setMessagesByUser((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), message],
    }));

    setInput("");
  };

  return (
    <div className="flex h-screen p-6 gap-6">
      {/* Sidebar user */}
      <div className="w-1/4 border rounded p-4 overflow-y-auto">
        <h2 className="font-bold mb-2">User Đang Chat</h2>
        <ul className="space-y-2">
          {Object.keys(messagesByUser).map((userId) => (
            <li
              key={userId}
              className={`p-2 rounded cursor-pointer ${
                selectedUser === userId ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUser(userId)}
            >
              👤 {userId}
            </li>
          ))}
        </ul>
      </div>

      {/* Khung chat */}
      <div className="flex-1 border rounded p-4 flex flex-col">
        <h2 className="font-bold mb-2">Chat với: {selectedUser || "Chọn user"}</h2>

        <div className="flex-1 overflow-y-auto border p-2 mb-2">
          {selectedUser &&
            (messagesByUser[selectedUser] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`mb-1 ${
                  msg.senderId === "admin" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    msg.senderId === "admin" ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
        </div>

        {selectedUser && (
          <div className="flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-1 bg-green-500 text-white rounded"
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
