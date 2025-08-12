import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, X } from 'lucide-react';
import api from '../util/api';

const Chatting = () => {
  const { id: chatUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const receiverUsername = `User ${chatUserId?.slice(-4) || 'Unknown'}`;

  useEffect(() => {
    if (!chatUserId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/message/get/${chatUserId}`,
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    const formData = new FormData();
    formData.append("message", newMessage);
    if (imageFile) formData.append("photo", imageFile);

    const optimisticMessage = {
      _id: Date.now().toString(),
      message: newMessage,
      senderId: 'currentUser',
      createdAt: new Date().toISOString(),
      photo: imageFile ? { url: URL.createObjectURL(imageFile) } : null,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
    setImageFile(null);

    try {
      const res = await api.post(
        `/api/message/send/${chatUserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
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
      <header className="flex items-center justify-center p-4 bg-gray-800 border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-bold">{receiverUsername}</h2>
      </header>

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
                  className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl break-words ${
                    isMyMessage
                      ? 'bg-blue-600 rounded-br-lg'
                      : 'bg-gray-700 rounded-bl-lg'
                  }`}
                >
                  {msg.photo?.url && (
                    <img
                      src={msg.photo.url}
                      alt="Sent"
                      className="mb-2 max-w-xs max-h-60 rounded-lg object-cover"
                    />
                  )}
                  {msg.message && (
                    <p className="text-sm">{msg.message}</p>
                  )}
                  <div className="text-xs text-gray-300 mt-1 text-right opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-2"
      >
        <label className="p-2 text-gray-400 hover:text-white cursor-pointer">
          <Paperclip size={20} />
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </label>

        {imageFile && (
          <div className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1 rounded-full">
            <span>{imageFile.name}</span>
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

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
          disabled={!newMessage.trim() && !imageFile}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatting;
