// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaLeaf,
  FaCopy,
  FaCheck,
  FaTrashAlt,
  FaRegCommentDots,
  FaBolt,
  FaShieldAlt,
  FaSeedling,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playSuccessSound } from "../utils/audio";

const QUICK_PROMPTS = [
  { icon: FaBolt, label: "Active Surplus Items", prompt: "⚡ Active Surplus Items" },
  { icon: FaSeedling, label: "Food Preservation", prompt: "🌱 Food Preservation Tips" },
  { icon: FaShieldAlt, label: "OTP Handoff", prompt: "🔒 How does OTP handoff work?" },
  { icon: FaLeaf, label: "Volunteer Delivery", prompt: "🚴 How to volunteer for delivery?" },
];

const INITIAL_MESSAGE = {
  role: "bot",
  text: "Hi! I'm your ZeroWaste Eco Assistant. 🌱\n\nI can help you discover surplus food, reduce waste, and learn how our community works. What would you like to explore today?",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = async (customPrompt) => {
    const textToSend = (customPrompt ?? input).trim();

    if (!textToSend || requestInProgress.current) return;

    playClickSound();

    const history = messages.map(({ role, text }) => ({
      role,
      text,
    }));

    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    setInput("");
    setLoading(true);
    requestInProgress.current = true;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chatbot`,
        {
          message: textToSend,
          history,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply =
        response.data.response || "Sorry, I couldn't find an answer to that.";

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botReply },
      ]);

      playSuccessSound();
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm having trouble connecting right now. Please check your connection and try again. 🌱",
        },
      ]);
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      playClickSound();
      toast.success("Copied to clipboard!");

      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      toast.error("Unable to copy. Please try again.");
    }
  };

  const handleClear = () => {
    playClickSound();
    setMessages([INITIAL_MESSAGE]);
    setCopiedIdx(null);
    toast.success("Chat history cleared");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="chat-launcher"
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              playClickSound();
              setIsOpen(true);
            }}
            aria-label="Open ZeroWaste AI Assistant"
            title="Chat with ZeroWaste AI"
            className="group relative flex h-16 w-16 items-center justify-center rounded-[22px] border border-emerald-300/30 bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 text-white shadow-[0_12px_40px_rgba(16,185,129,0.3)] transition-shadow hover:shadow-[0_16px_50px_rgba(16,185,129,0.4)]"
          >
            <span className="absolute inset-[3px] rounded-[19px] border border-white/15" />

            <FaRobot
              size={27}
              className="relative transition-transform duration-300 group-hover:rotate-6"
            />

            <span className="absolute -right-1 -top-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative h-4 w-4 rounded-full border-[3px] border-[#07130f] bg-emerald-300" />
            </span>

            <span className="absolute bottom-[72px] right-0 w-max rounded-xl border border-white/10 bg-[#0b1515] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
              Need a hand? Ask our AI
            </span>
          </motion.button>
        ) : (
          <motion.section
            key="chat-window"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-label="ZeroWaste AI Assistant"
            aria-modal="false"
            className="flex h-[min(680px,calc(100dvh-32px))] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#080f12]/[0.98] text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] backdrop-blur-2xl sm:h-[620px] sm:w-[400px]"
          >
            {/* Header */}
            <header className="relative shrink-0 overflow-hidden border-b border-white/[0.07] bg-gradient-to-br from-[#103c2b] via-[#0b3029] to-[#10201e] px-5 pb-5 pt-5">
              <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-emerald-400/15 blur-[60px]" />
              <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-40 rounded-full bg-teal-400/[0.08] blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/20 bg-white/[0.09] shadow-inner shadow-white/5">
                    <FaLeaf size={21} className="text-emerald-300" />
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#103c2b] bg-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-extrabold tracking-tight text-white">
                        ZeroWaste AI
                      </h3>
                      <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                        RAG
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <p className="text-[11px] font-medium text-emerald-100/70">
                        Your sustainable living companion
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                    className="rounded-xl p-2.5 text-white/60 transition-all hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaTrashAlt size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsOpen(false);
                    }}
                    title="Minimize assistant"
                    aria-label="Minimize assistant"
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <FaTimes size={15} />
                  </button>
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/[0.12] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <FaRegCommentDots className="text-emerald-300" size={14} />
                  <span className="text-[11px] font-medium text-white/80">
                    Here to help you make a difference
                  </span>
                </div>
                <FaSeedling className="shrink-0 text-emerald-300/60" size={15} />
              </div>
            </header>

            {/* Quick prompts */}
            <div className="shrink-0 border-b border-white/[0.06] bg-[#0b1315] px-4 py-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Suggested questions
                </span>
                <FaBolt size={11} className="text-emerald-400/70" />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition-all duration-200 hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon size={11} className="text-emerald-400" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 space-y-5 overflow-y-auto overscroll-contain bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.045),transparent_55%)] px-4 py-5 [scrollbar-color:#244c3d_transparent] [scrollbar-width:thin]"
              aria-live="polite"
              aria-relevant="additions text"
            >
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Your eco conversation
                </span>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";

                return (
                  <motion.div
                    key={`${idx}-${msg.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex items-end gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                        <FaLeaf size={13} />
                      </div>
                    )}

                    <div className={`relative max-w-[84%] ${isUser ? "order-first" : ""}`}>
                      {!isUser && (
                        <p className="mb-1.5 ml-1 text-[10px] font-bold text-emerald-300/80">
                          Eco Assistant
                        </p>
                      )}

                      <div
                        className={`whitespace-pre-wrap break-words rounded-[20px] px-4 py-3.5 text-[12px] leading-[1.85] shadow-sm ${
                          isUser
                            ? "rounded-br-md border border-emerald-300/20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                            : "rounded-bl-md border border-white/[0.07] bg-[#111c1e] text-slate-200"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {!isUser && (
                        <div className="mt-1.5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, idx)}
                            title="Copy response"
                            aria-label="Copy response"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] text-slate-500 opacity-100 transition-colors hover:bg-white/[0.05] hover:text-emerald-300 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <FaCheck size={10} className="text-emerald-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <FaCopy size={10} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] text-[10px] font-extrabold text-slate-300">
                        You
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                    <FaLeaf size={13} />
                  </div>

                  <div className="rounded-[18px] rounded-bl-md border border-white/[0.07] bg-[#111c1e] px-4 py-3.5">
                    <div className="mb-2 text-[10px] font-semibold text-slate-400">
                      Thinking of greener solutions
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: dot * 0.15,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Composer */}
            <footer className="shrink-0 border-t border-white/[0.07] bg-[#0b1315] p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center gap-2 rounded-2xl border border-white/[0.09] bg-[#101a1c] p-1.5 transition-all duration-200 focus-within:border-emerald-400/40 focus-within:ring-2 focus-within:ring-emerald-400/[0.07]"
              >
                <div className="flex h-10 w-9 shrink-0 items-center justify-center text-emerald-400/70">
                  <FaRegCommentDots size={16} />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  maxLength={2000}
                  aria-label="Message the ZeroWaste AI Assistant"
                  placeholder="Ask something eco-friendly..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-[12px] text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[#062018] shadow-lg shadow-emerald-950/30 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>

              <div className="mt-3 flex items-center justify-between gap-2 px-1">
                <p className="text-[9px] text-slate-600">
                  Powered by your ZeroWaste AI assistant
                </p>
                <p className="flex shrink-0 items-center gap-1 text-[9px] font-medium text-emerald-400/60">
                  <FaLeaf size={9} />
                  Think green
                </p>
              </div>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
