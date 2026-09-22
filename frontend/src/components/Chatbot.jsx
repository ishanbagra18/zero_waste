// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaRobot, FaTimes, FaPaperPlane, FaLeaf, FaCopy, FaCheck, FaTrashAlt } from "react-icons/fa";
import { playClickSound, playSuccessSound } from "../utils/audio";

const QUICK_PROMPTS = [
  "⚡ Active Surplus Items",
  "🌱 Food Preservation Tips",
  "🔒 How does OTP handoff work?",
  "🚴 How to volunteer for delivery?",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "🌱 Hi! I'm your ZeroWaste Eco Assistant powered by LangChain. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    playClickSound();

    const userMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chatbot`,
        { message: textToSend, history: messages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply = response.data.response || "Sorry, I didn't understand that.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      playSuccessSound();
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please check your network or try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    playClickSound();
    toast.success("Copied answer to clipboard!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClear = () => {
    playClickSound();
    setMessages([
      { role: "bot", text: "🌱 Hi! I'm your ZeroWaste Eco Assistant. How can I help you today?" }
    ]);
    toast.success("Chat history cleared");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl shadow-emerald-900/40 transition-all duration-300 transform hover:scale-110 ring-2 ring-emerald-400/40 group"
          onClick={() => {
            playClickSound();
            setIsOpen(true);
          }}
          title="Open AI Eco Assistant"
        >
          <FaRobot size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
          </span>
        </button>
      ) : (
        <div className="w-84 sm:w-96 h-[530px] bg-slate-950/95 backdrop-blur-xl text-white shadow-2xl rounded-3xl flex flex-col border border-emerald-500/40 overflow-hidden ring-1 ring-emerald-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex justify-between items-center px-4 py-3.5 shadow-md border-b border-emerald-500/30">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <FaLeaf className="text-emerald-200" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide flex items-center gap-1.5">
                  ZeroWaste AI Assistant
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-bold px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                    RAG
                  </span>
                </h3>
                <span className="text-[10px] text-emerald-100/80 font-medium block">Powered by LangChain JS</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="text-white/70 hover:text-rose-300 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <FaTrashAlt size={13} />
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setIsOpen(false);
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips Header */}
          <div className="bg-slate-900/90 px-3 py-2 border-b border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] font-semibold bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 px-2.5 py-1 rounded-xl whitespace-nowrap border border-slate-700/60 transition shadow-xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-slate-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`group relative text-xs p-3.5 max-w-[88%] break-words whitespace-pre-line leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ml-auto rounded-2xl rounded-tr-none font-medium"
                    : "bg-slate-900/90 text-emerald-50 border border-emerald-900/50 mr-auto rounded-2xl rounded-tl-none"
                }`}
              >
                {msg.text}
                {msg.role === "bot" && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-800 text-slate-300 hover:text-emerald-400"
                    title="Copy response"
                  >
                    {copiedIdx === idx ? <FaCheck size={11} className="text-emerald-400" /> : <FaCopy size={11} />}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-xs p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-emerald-900/50 w-fit flex items-center space-x-2 animate-pulse">
                <FaRobot className="animate-spin text-emerald-400" />
                <span>Searching live database & querying Gemini...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-900 text-white border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-500"
              placeholder="Ask about active items, food safety..."
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              <FaPaperPlane size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
