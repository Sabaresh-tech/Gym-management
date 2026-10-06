import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, X, Send } from "lucide-react";

// For the lab experiment, connect directly to localhost:5000 if not specified
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [room, setRoom] = useState("general");
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Only connect if the user is authenticated
    if (user && token) {
      // Fetch chat history
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const res = await fetch(`${SOCKET_SERVER_URL}/api/chat/messages?room=${room}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success && data.data) {
            const formatted = data.data.map(msg => ({
              _id: msg._id,
              sender: msg.senderName,
              role: msg.senderRole,
              text: msg.message,
              timestamp: msg.createdAt,
            }));
            setMessages(formatted);
          }
        } catch (err) {
          console.error("Failed to fetch chat history:", err);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      
      fetchHistory();

      const socket = io(SOCKET_SERVER_URL, {
        auth: { token }
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("joinRoom", room);
      });

      socketRef.current.on("receiveMessage", (messageData) => {
        setMessages((prevMessages) => {
          // Prevent duplicates by checking _id
          if (prevMessages.some(m => m._id === messageData._id)) {
            return prevMessages;
          }
          return [...prevMessages, messageData];
        });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, room, token]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socketRef.current) {
      const messageData = {
        room,
        text: inputMessage.trim(),
      };
      
      socketRef.current.emit("sendMessage", messageData);
      setInputMessage("");
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#D7FF3B] text-[#0D0D0D] p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[28rem] overflow-hidden">
          {/* Header */}
          <div className="bg-[#0D0D0D] p-4 flex justify-between items-center border-b border-[#333]">
            <div className="flex items-center gap-2 flex-1">
              <MessageSquare className="w-5 h-5 text-[#D7FF3B]" />
              <select 
                value={room} 
                onChange={(e) => {
                  setMessages([]);
                  setRoom(e.target.value);
                }}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer text-sm"
              >
                <option value="general" className="bg-[#1A1A1A]">General Chat</option>
                {(user.role === "admin" || user.role === "staff") && (
                  <option value="staff" className="bg-[#1A1A1A]">Staff Room</option>
                )}
              </select>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141414]">
            {isLoadingHistory ? (
              <p className="text-gray-500 text-center text-sm italic mt-4">
                Loading history...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm italic mt-4">
                No messages yet. Say hi!
              </p>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.sender === (user.name || user.email || user.role);
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                      {isMe ? (
                        <>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>{msg.sender} ({msg.role})</span>
                        </>
                      ) : (
                        <>
                          <span>{msg.sender} ({msg.role})</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </>
                      )}
                    </span>
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                        isMe
                          ? "bg-[#D7FF3B] text-[#0D0D0D] rounded-br-none font-medium"
                          : "bg-[#2A2A2A] text-white rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#0D0D0D] border-t border-[#333]">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#1A1A1A] text-white px-3 py-2 border border-[#333] rounded-md focus:outline-none focus:border-[#D7FF3B] focus:ring-1 focus:ring-[#D7FF3B] text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-[#D7FF3B] text-[#0D0D0D] p-2 rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
