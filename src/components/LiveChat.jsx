import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, X, Send, AlertCircle, RefreshCw } from "lucide-react";

// Helper to reliably read stored JWT
function getAuthToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

// Normalize backend origin and API endpoints regardless of trailing slashes or /api
const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
const SOCKET_SERVER_URL = rawBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
const API_BASE_URL = `${SOCKET_SERVER_URL}/api`;

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [socketStatus, setSocketStatus] = useState("connecting"); // "connecting" | "connected" | "error" | "disconnected"
  const [chatError, setChatError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [room, setRoom] = useState("general");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const roomRef = useRef(room);

  const { user } = useAuth();
  const token = getAuthToken();

  // Keep roomRef updated for socket callbacks
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Fetch message history for the active room
  const fetchHistory = useCallback(
    async (targetRoom = room) => {
      const currentToken = getAuthToken();
      if (!currentToken) {
        console.warn("[Chat] Cannot fetch history: missing authentication token");
        return;
      }

      setIsLoadingHistory(true);
      setChatError("");

      try {
        const url = `${API_BASE_URL}/chat/messages?room=${encodeURIComponent(targetRoom)}&limit=100`;
        console.log(`[Chat] Fetching history from: ${url}`);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch history`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formatted = result.data.map((msg) => ({
            _id: msg._id,
            sender: msg.senderName || msg.sender || "Unknown",
            role: msg.senderRole || msg.role || "member",
            text: msg.message || msg.text || "",
            room: msg.room || targetRoom,
            timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
          }));

          console.log(`[Chat] Loaded ${formatted.length} messages for room '${targetRoom}'`);
          setMessages(formatted);
        }
      } catch (error) {
        console.error("[Chat] Failed to load chat history:", error.message);
        setChatError("Could not load message history. Click retry below.");
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [room]
  );

  // Load history whenever the widget is opened
  useEffect(() => {
    if (isOpen && user && token) {
      fetchHistory(room);
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("joinRoom", room);
      }
    }
  }, [isOpen, user, token, fetchHistory, room]);

  // Manage WebSocket connection lifecycle
  useEffect(() => {
    const currentToken = getAuthToken();
    if (!user || !currentToken) {
      setMessages([]);
      setSocketStatus("disconnected");
      return;
    }

    let isSubscribed = true;
    console.log("[Chat] Connecting Socket.IO to server origin:", SOCKET_SERVER_URL);

    const socket = io(SOCKET_SERVER_URL, {
      path: "/socket.io",
      auth: { token: currentToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      timeout: 10000,
    });

    socketRef.current = socket;
    setSocketStatus("connecting");

    socket.on("connect", () => {
      if (!isSubscribed) return;
      setSocketStatus("connected");
      setChatError("");
      console.log(`[Chat] Socket connected: ${socket.id} to ${SOCKET_SERVER_URL}`);

      // Join active room
      socket.emit("joinRoom", roomRef.current);
    });

    socket.on("disconnect", (reason) => {
      if (!isSubscribed) return;
      setSocketStatus("disconnected");
      console.log("[Chat] Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      if (!isSubscribed) return;
      setSocketStatus("error");
      const errMessage = error.message || "Connection failed";
      console.error("[Chat] Socket connect error:", errMessage);
      setChatError(
        errMessage.includes("Authentication")
          ? "Chat authentication required. Please re-login."
          : "Connecting to chat server..."
      );
    });

    socket.on("chatError", (err) => {
      if (!isSubscribed) return;
      console.error("[Chat] Server returned chatError:", err?.message);
      setChatError(err?.message || "Failed to process chat action");
    });

    socket.on("receiveMessage", (messageData) => {
      if (!isSubscribed) return;

      const incoming = {
        _id: messageData._id,
        sender: messageData.senderName || messageData.sender || "Unknown",
        role: messageData.senderRole || messageData.role || "member",
        text: messageData.message || messageData.text || "",
        room: messageData.room || "general",
        timestamp: messageData.createdAt || messageData.timestamp || new Date().toISOString(),
      };

      console.log(`[Chat] Received message in room '${incoming.room}':`, incoming._id);

      // Only display message if it matches active room
      if (incoming.room && incoming.room !== roomRef.current) {
        return;
      }

      setMessages((prev) => {
        if (incoming._id && prev.some((m) => m._id === incoming._id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    });

    return () => {
      isSubscribed = false;
      socket.off();
      socket.disconnect();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle sending a new message
  const handleSendMessage = (event) => {
    event.preventDefault();

    const text = inputMessage.trim();
    const socket = socketRef.current;

    if (!text) return;

    if (!socket || !socket.connected) {
      setChatError("Cannot send: chat server is connecting or offline.");
      console.error("[Chat] Cannot send: socket is not connected");
      return;
    }

    setIsSending(true);
    setChatError("");

    socket.emit(
      "sendMessage",
      {
        room,
        text,
      },
      (ack) => {
        setIsSending(false);
        if (ack && !ack.success) {
          setChatError(ack.error || "Failed to send message");
          console.error("[Chat] Ack error:", ack.error);
        } else {
          setInputMessage("");
        }
      }
    );

    // Clear input optimistically after emission
    setInputMessage("");

    // Fallback timer to release sending state if ack is delayed
    setTimeout(() => {
      setIsSending(false);
    }, 1500);
  };

  const handleRoomChange = (event) => {
    const newRoom = event.target.value;
    setRoom(newRoom);
    setMessages([]);
    setChatError("");

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("joinRoom", newRoom);
    }

    fetchHistory(newRoom);
  };

  if (!user) return null;

  const currentUser = user.name || user.email || user.role;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="relative bg-[#D7FF3B] text-[#0D0D0D] p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
          {socketStatus === "connected" && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 border-2 border-[#0D0D0D] rounded-full" />
          )}
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[28rem] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#0D0D0D] p-4 flex justify-between items-center border-b border-[#333]">
            <div className="flex items-center gap-2 flex-1">
              <MessageSquare className="w-5 h-5 text-[#D7FF3B]" />

              <select
                value={room}
                onChange={handleRoomChange}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer text-sm"
              >
                <option value="general" className="bg-[#1A1A1A]">
                  General Chat
                </option>

                {(user.role === "admin" || user.role === "staff") && (
                  <option value="staff" className="bg-[#1A1A1A]">
                    Staff Room
                  </option>
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchHistory(room)}
                title="Refresh chat history"
                aria-label="Refresh chat history"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? "animate-spin text-[#D7FF3B]" : ""}`} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Connection Status Bar */}
          <div className="bg-[#101010] px-3 py-1 text-xs border-b border-[#222] flex items-center justify-between">
            <span
              className={
                socketStatus === "connected"
                  ? "text-green-400"
                  : socketStatus === "error"
                  ? "text-red-400"
                  : socketStatus === "connecting"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }
            >
              {socketStatus === "connected"
                ? "● Connected"
                : socketStatus === "error"
                ? "● Connection issue"
                : socketStatus === "connecting"
                ? "● Connecting..."
                : "● Disconnected"}
            </span>

            <span className="text-gray-500 text-[10px] uppercase tracking-wider">
              {room === "staff" ? "Staff Only" : "Public"}
            </span>
          </div>

          {/* Error Banner */}
          {chatError && (
            <div className="bg-red-950/70 border-b border-red-800/50 px-3 py-1.5 text-xs text-red-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span className="truncate">{chatError}</span>
              </div>
              <button
                onClick={() => setChatError("")}
                className="text-red-400 hover:text-white text-xs ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141414]">
            {isLoadingHistory && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#D7FF3B]" />
                <span>Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-1">
                <p>No messages yet in this room.</p>
                <p className="text-xs text-gray-600">Say hi to start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isMe = message.sender === currentUser;

                return (
                  <div
                    key={message._id || `${message.timestamp}-${index}`}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5">
                      {isMe ? (
                        <>
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="font-semibold text-white/80">
                            {message.sender} ({message.role})
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-[#D7FF3B]/90">
                            {message.sender} ({message.role})
                          </span>
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </span>

                    <div
                      className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-sm break-words leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-[#D7FF3B] text-[#0D0D0D] rounded-tr-none font-medium"
                          : "bg-[#242424] text-white rounded-tl-none border border-white/5"
                      }`}
                    >
                      {message.text}
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
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder={
                  socketStatus === "connected"
                    ? `Message ${room === "staff" ? "Staff Room" : "General"}...`
                    : "Connecting to chat..."
                }
                aria-label="Type a chat message"
                disabled={socketStatus !== "connected"}
                className="flex-1 bg-[#1A1A1A] text-white px-3 py-2 border border-[#333] rounded-md focus:outline-none focus:border-[#D7FF3B] focus:ring-1 focus:ring-[#D7FF3B] text-sm disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || socketStatus !== "connected" || isSending}
                aria-label="Send message"
                className="bg-[#D7FF3B] text-[#0D0D0D] p-2 rounded-md hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
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
