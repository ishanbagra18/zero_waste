// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaLeaf } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "🌱 Hi! I'm your ZeroWaste Eco Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chatbot`,
        { message: input, history: messages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply = response.data.response || "Sorry, I didn't understand that.";

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
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-emerald-900/30 transition-all duration-300 transform hover:scale-105 ring-2 ring-emerald-400/30"
          onClick={() => setIsOpen(true)}
          title="Open AI Assistant"
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div className="w-84 sm:w-96 h-[500px] bg-gray-900/95 backdrop-blur-md text-white shadow-2xl rounded-2xl flex flex-col border border-emerald-500/40 overflow-hidden ring-1 ring-emerald-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex justify-between items-center px-4 py-3 shadow-md border-b border-emerald-500/30">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
                <FaLeaf className="text-emerald-200" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">ZeroWaste AI Assistant</h3>
                <span className="text-[10px] text-emerald-100/80 font-medium block">Powered by LangChain</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-gray-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-3.5 max-w-[85%] break-words whitespace-pre-line leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ml-auto rounded-2xl rounded-tr-none font-medium"
                    : "bg-gray-800/90 text-emerald-50 border border-emerald-900/40 mr-auto rounded-2xl rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs p-2.5 rounded-xl bg-gray-800 text-emerald-400 border border-emerald-900/40 w-fit flex items-center space-x-2 animate-pulse">
                <FaRobot className="animate-spin text-emerald-400" />
                <span>Thinking green thoughts...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-gray-800 bg-gray-900/80 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-gray-800 text-white border border-emerald-900/50 rounded-xl px-3.5 py-2.5 outline-none text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-400"
              placeholder="Ask about ZeroWaste or items..."
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

