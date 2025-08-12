// src/components/Chatbot.jsx
import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import api from '../util/api'
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/chat/chatbot",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply = response.data.response || "Sorry, I didn't understand that.";

      console.log(response.data.response);



      setMessages(prev => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div className="w-80 h-[480px] bg-gray-900 text-white shadow-2xl rounded-xl flex flex-col border border-blue-600">
          <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2 rounded-t-xl">
            <h3 className="text-lg font-semibold">Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-300">
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-3 rounded-xl max-w-[80%] break-words ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-700 text-white mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm p-2 rounded-md bg-gray-700 w-fit text-gray-300">
                Typing...
              </div>
            )}
          </div>

          <div className="flex p-2 border-t border-gray-700 bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-gray-700 text-white rounded-l px-3 py-2 outline-none text-sm"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r text-sm"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
