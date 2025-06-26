import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { FaComments, FaTimes } from "react-icons/fa";
import { type } from "@testing-library/user-event/dist/type";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const stompClient = useRef(null);
  const messagesContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatVisibleRef = useRef(chatVisible);




  useEffect(() => {
    if (user?.id) {
      loadMessages(0, true);
    }
  }, [user]);

  useEffect(() => {
    chatVisibleRef.current = chatVisible;
  }, [chatVisible]);


  const loadMessages = async (pageToLoad, reset = false) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/chat/clientMessages/${user.id}?page=${pageToLoad}&size=10`);
      const newMessages = res.data.reverse();

      if (reset) {
        setMessages(newMessages);
        setPage(1);
        setHasMore(newMessages.length === 10);
        setTimeout(() => scrollToBottom(), 50);
      } else {
        const container = messagesContainerRef.current;
        const oldScrollHeight = container.scrollHeight;

        setMessages((prev) => [...newMessages, ...prev]);

        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - oldScrollHeight;
        }, 50);

        setHasMore(newMessages.length === 10);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Lỗi lấy tin nhắn:", err);
    }
  };

  useEffect(() => {
    let socket = '';
    if (user) {
      socket = new SockJS(`http://localhost:8080/ws?userId=${user.id}`);
    } else {
      socket = new SockJS(`http://localhost:8080/ws?userId=null`);
    }

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected");
        console.log(chatVisible);
        client.subscribe("/user/queue/messages", (message) => {
          console.log("Hihi");
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);

          if (!chatVisibleRef.current) {
            setUnreadCount((prev) => prev + 1);
            setHasNewMessage(true);
          }
          setTimeout(() => scrollToBottom(), 50);
        });
      },
    });
    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, []);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    console.log("scrollHeight:", container.scrollHeight);
    console.log("clientHeight:", container.clientHeight);
    if (container.scrollTop === 0 && hasMore) {
      loadMessages(page);
    }
  };

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected && input.trim()) {
      const chatMessage = {
        senderId: user.id,
        receiverId: "admin",
        content: input,
        chatRoomId: user.id + "-" + "admin",
        sentAt: new Date().toISOString(),
      };

      stompClient.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(chatMessage),
      });

      setMessages((prev) => [...prev, chatMessage]);
      setInput("");
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatVisible) {
      // Delay một chút để React render xong
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [chatVisible, messages]);

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  

  const lastReadMessageId = [...messages]
    .reverse()
    .find((m) => m.senderId == user.id && m.status === "READ")?.id;
    



  return (
    <>
      {user && (
        <>


          <button
            onClick={() => {
              setChatVisible(true);
              setUnreadCount(0); // reset khi mở
            }}
            className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all"
          >
            <div className="relative">
              <FaComments size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </button>




          {chatVisible && (
            <div className="fixed bottom-20 right-6 w-[400px] h-[500px] bg-white border rounded-lg shadow-lg flex flex-col z-50">
              <div className="bg-red-500 text-white px-4 py-2 rounded-t-lg font-bold flex justify-between items-center">
                <span>Chat với Admin</span>
                <button
                  onClick={() => setChatVisible(false)}
                  className="text-white hover:text-gray-200 text-lg"
                  title="Đóng"
                >
                  <FaTimes />
                </button>
              </div>


              <div
                className="h-full overflow-y-auto px-3 py-2 space-y-2 bg-gray-50"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {messages.map((msg, idx) => {
                  const isCurrentUser = msg.senderId == user.id;
                  console.log(idx === messages.length-1);
                  
                  const isLastInGroup =
                    idx === messages.length - 1 ||
                   String(messages[idx + 1].senderId) !== String(msg.senderId);

                  const isLastReadMessage = msg.id && (msg.id === lastReadMessageId);


                  return (
                    <div
                      key={idx}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-end  `}
                      style={{
                        marginBottom: isLastReadMessage ? "24px" : undefined, // 👈 Cách ra 24px nếu là tin cuối đã đọc
                      }}
                    >
                      {/* Nếu là tin nhắn admin gửi (bên trái) */}
                      {!isCurrentUser && (
                        <div className="w-8 mr-1 flex-shrink-0">
                          {isLastInGroup ? (
                            <img
                              src="/images/logo-admin.png"
                              alt="avatar"
                              className="w-6 h-6 rounded-full object-cover mb-5"
                            />
                          ) : (
                            <div className="w-6 h-6" /> // giữ chỗ
                          )}
                        </div>
                      )}

                      <div className="flex flex-col max-w-[70%] relative">
                        <div
                          className={`px-3 py-2 rounded-lg break-words ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                            }`}
                          title={formatTime(msg.sentAt)}
                        >
                          {msg.content}
                        </div>

                        {/* Thời gian gửi */}
                        {isLastInGroup && (
                          <div
                            className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? "text-right self-end" : "text-left"
                              }`}
                          >
                            {formatTime(msg.sentAt || msg.timestamp)}
                          </div>
                        )}

                        {/* ✅ Avatar admin chỉ hiển thị nếu là tin nhắn cuối cùng đã đọc */}
                        {isCurrentUser && isLastReadMessage && (
                          <img
                            src="/images/logo-admin.png"
                            alt="Đã đọc"
                            title="Đã đọc"
                            className="w-4 h-4 rounded-full absolute -bottom-5 right-0 border border-white "
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
              <div className="flex border-t p-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border rounded-l px-2 py-1 focus:outline-none"
                  placeholder="Nhập tin nhắn..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600"
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </>

  );
};

export default ChatBox;