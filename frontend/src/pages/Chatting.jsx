import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Send, Paperclip } from 'lucide-react';

const Chatting = () => {
  const { id: chatUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fallback receiver name (temporary)
  const receiverUsername = `User ${chatUserId?.slice(-4) || 'Unknown'}`; // e.g. "User 9a7b"

  useEffect(() => {
    if (!chatUserId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://zero-waste-2xxf.onrender.com/api/message/get/${chatUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatUserId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const optimisticMessage = {
      _id: Date.now().toString(),
      message: newMessage,
      senderId: 'currentUser',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      const res = await axios.post(
        `https://zero-waste-2xxf.onrender.com/api/message/send/${chatUserId}`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === optimisticMessage._id ? res.data : msg
        )
      );
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-center p-4 bg-gray-800 border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-bold">{receiverUsername}</h2>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">👋 Say hello! No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.senderId !== chatUserId;

            return (
              <div key={msg._id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md lg:max-w-lg px-4 py-2 rounded-2xl break-words ${
                    isMyMessage
                      ? 'bg-blue-600 rounded-br-lg'
                      : 'bg-gray-700 rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <div className="text-xs text-gray-300 mt-1 text-right opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-4"
      >
        <button type="button" className="p-2 text-gray-400 hover:text-white">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatting;
