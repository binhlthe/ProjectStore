// AdminChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { FaTimes, FaComments } from "react-icons/fa";

const AdminChatBox = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesRef = useRef(null);
    const stompClient = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [user, setUser] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [allUsers, setAllUsers] = useState([]);


    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/admin/chat/chat-users");
            setUsers(res.data);
        } catch (e) {
            console.error("Lỗi lấy danh sách user:", e);
        }
    };




    const fetchMessages = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/admin/chat/adminMessages/${userId}`);
            console.log(res.data);
            setMessages(res.data);
            console.log("abc");
            setTimeout(() => scrollToBottom(), 0);
        } catch (e) {
            console.error("Lỗi lấy tin nhắn:", e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Admin connected");
                console.log(selectedUser.userId);
                client.subscribe("/topic/admin-messages", (message) => {
                    const msg = JSON.parse(message.body);

                    // Nếu đang mở khung chat với đúng người gửi hoặc người nhận
                    if (
                        selectedUser &&
                        (msg.senderId === selectedUser.userId || msg.receiverId === selectedUser.userId)
                    ) {
                        setMessages((prev) => [...prev, msg]);
                        console.log(messages);

                        // Scroll xuống đáy khung chat
                        setTimeout(() => scrollToBottom(), 0);
                    }

                    // Update lại danh sách user (nếu có preview tin nhắn mới)
                    fetchUsers(); // hoặc cập nhật state `users` tương ứng
                });
                
                client.subscribe(`/topic/message-read/${selectedUser.userId}`, (message) => {
                    const updatedMsg = JSON.parse(message.body);
                    console.log("📬 Tin nhắn đã được đọc:", updatedMsg);

                    setMessages((prevMessages) =>
                        prevMessages.map((msg) => {
                            const normalizeTime = (dateStr) => Math.floor(new Date(dateStr).getTime() / 1000);
                            const isSameSecond = normalizeTime(msg.sentAt) === normalizeTime(updatedMsg.sentAt);
                            return (
                                msg.senderId === updatedMsg.senderId &&
                                msg.content === updatedMsg.content &&
                                isSameSecond
                            )
                                ? { ...msg, id: updatedMsg.id, status: "READ" }
                                : msg;
                        })
                    );
                });

            },
        });

        client.activate();
        stompClient.current = client;

        return () => client.deactivate();
    }, [selectedUser]);

    const handleSearch = async (text) => {
        setSearchText(text);
        if (!text.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/admin/chat/search-users?keyword=${text}`);
            setSearchResults(res.data);
        } catch (e) {
            console.error("Lỗi tìm kiếm:", e);
        }
    };


    const handleSend = () => {
        if (!selectedUser || !input.trim()) return;
        console.log(selectedUser);
        const msg = {
            senderId: "admin",
            receiverId: selectedUser.userId,
            content: input,
            chatRoomId: selectedUser.userId < "admin" ? `${selectedUser.userId}-admin` : `admin-${selectedUser.userId}`,
            sentAt: new Date().toISOString(),
        };

        stompClient.current.publish({
            destination: "/app/chat",
            body: JSON.stringify(msg),
        });

        setInput("");
        scrollToBottom();
        fetchUsers(); // ✅ Gọi lại để cập nhật preview
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messagesRef.current) {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }
        }, 0);
    };

    const formatTime = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        return d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleToggleChat = async () => {
        setChatVisible((prev) => {
            const nextState = !prev;

            // Nếu mở chatbox và chưa có user nào được chọn thì tự động chọn
            if (nextState && users.length > 0 && !selectedUser) {
                const mostRecentUser = [...users]
                    .filter(u => u.lastSentAt) // đảm bảo có dữ liệu
                    .sort((a, b) => new Date(b.lastSentAt) - new Date(a.lastSentAt))[0];

                if (mostRecentUser) {
                    setSelectedUser(mostRecentUser);
                    fetchMessages(mostRecentUser.userId);
                }
            }

            return nextState;
        });

        setTimeout(() => {
            if (selectedUser) scrollToBottom();
        }, 0);
    };
    console.log(messages);

    const lastReadMessageId = [...messages]
        .reverse()
        .find((m) => m.senderId == "admin" && m.status === "READ")?.id;


    useEffect(() => {
        if (!chatVisible || messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];
        console.log(typeof "READ");
        console.log(typeof lastMsg.status);
        console.log(lastMsg.status +" "+ (lastMsg.status !== "READ"));
        console.log(lastMsg.status !== "READ");
        if (
            lastMsg.senderId !== "admin" &&  // Là tin nhắn của admin
            lastMsg.status !== "READ"        // Và chưa được đọc
        ) {
            axios.post("http://localhost:8080/api/admin/chat/markAsRead", {
                messageId: lastMsg.id,
                userId: user.id,
            }).then(() => {
                // Cập nhật lại tin nhắn trong state
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === lastMsg.id ? { ...msg, status: "READ" } : msg
                    )
                );
                console.log(messages);
            });
        }
    }, [chatVisible, messages]);

    return (
        <>
            <button
                onClick={handleToggleChat}
                className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600"
            >
                <FaComments size={24} />
            </button>

            {chatVisible && (
                <div className="fixed bottom-20 right-6 w-[700px] h-[500px] bg-white border rounded-lg shadow-lg flex z-50">
                    {/* Sidebar User List */}

                    <div className="w-1/3 bg-gray-100 border-r overflow-y-auto">
                        {/* Thanh tìm kiếm */}
                        <div className="p-3 border-b bg-white shadow-sm">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm người dùng..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                                    value={searchText}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <svg
                                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                                    />
                                </svg>
                            </div>
                        </div>


                        {/* Hiển thị kết quả tìm kiếm (nếu có) */}
                        {searchResults.length > 0 && (
                            <div className="absolute bg-white border-tl border-b shadow-md w-[230px] max-h-60 overflow-y-auto z-50 ml-2 mt-1 rounded">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.userId}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            fetchMessages(user.userId);
                                            setSearchResults([]);
                                            setSearchText("");
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        <img
                                            src={user.avatar || "https://via.placeholder.com/40"}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{user.userName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {users.map((user) => (
                            <div
                                key={user.userId}
                                onClick={() => {
                                    setSelectedUser(user);
                                    fetchMessages(user.userId);
                                }}
                                className={`flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-200 ${selectedUser?.userId === user.userId ? "bg-gray-300 font-semibold" : ""
                                    }`}
                            >
                                <img
                                    src={user.avatar || "https://via.placeholder.com/40"}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.userName}</p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user.lastMessage || "Chưa có tin nhắn"}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user.lastSentAt && formatTime(user.lastSentAt)}
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Chat Area */}
                    <div className="w-2/3 flex flex-col">
                        {/* Header */}
                        <div className="bg-red-500 text-white px-4 py-2 rounded-tr flex justify-between items-center">
                            <span>{selectedUser ? `Chat với ${selectedUser.userName}` : "Chọn người dùng"}</span>
                            <button onClick={() => setChatVisible(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50 space-y-2" ref={messagesRef}>
                            {messages.map((msg, idx) => {
                                const isAdmin = msg.senderId === "admin";



                                const isLastReadMessage = msg.id && (msg.id === lastReadMessageId);
                                const isLast =
                                    idx === messages.length - 1 || messages[idx + 1].senderId !== msg.senderId;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex items-end ${isAdmin ? "justify-end" : "justify-start"}`}
                                        style={{
                                            marginBottom: isLastReadMessage ? "24px" : undefined, // 👈 Cách ra 24px nếu là tin cuối đã đọc
                                        }}
                                    >
                                        {!isAdmin && (
                                            <div className="w-8 mr-1 flex-shrink-0">
                                                {isLast ? (
                                                    <img
                                                        src={selectedUser?.avatar || "https://via.placeholder.com/24"}
                                                        alt="avatar"
                                                        className="w-6 h-6 rounded-full object-cover mb-5"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6" /> // giữ chỗ để canh hàng
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-col max-w-[70%] relative">
                                            <div
                                                className={`px-3 py-2 rounded-lg ${isAdmin
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 text-black"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>

                                            {isLast && (
                                                <div className={`text-xs text-gray-500 mt-1 ${isAdmin ? "text-right" : ""}`}>
                                                    {formatTime(msg.sentAt)}
                                                </div>
                                            )}
                                            {/* ✅ Avatar admin chỉ hiển thị nếu là tin nhắn cuối cùng đã đọc */}
                                            {isAdmin && isLastReadMessage && (
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


                        {/* Input */}
                        <div className="flex border-t p-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 px-2 py-1 border rounded-l"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminChatBox;