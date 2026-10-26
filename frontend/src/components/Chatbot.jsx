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
  FaCamera,
  FaChartBar,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playSuccessSound } from "../utils/audio";

const QUICK_PROMPTS = [
  { icon: FaShieldAlt, label: "Food Safety Audit", prompt: "🛡️ Is my cooked food safe to donate after 3 hours at room temperature?" },
  { icon: FaCamera, label: "Auto-List from Photo", prompt: "📸 How does Auto-Listing from Photo work?" },
  { icon: FaChartBar, label: "Monthly Impact Report", prompt: "📊 Generate my monthly ecological impact report" },
  { icon: FaBolt, label: "Active Surplus Items", prompt: "⚡ Show active surplus items ready for claim" },
];

const INITIAL_MESSAGE = {
  role: "bot",
  text: "Hi! I'm your ZeroWaste Agentic AI Assistant. 🌱\n\nI can run statutory **FSSAI Food Safety Audits**, **Auto-List Surplus from Photos**, and generate **UNEP-Verified Monthly Carbon Reports**. What would you like to explore today?",
  agentType: "PLATFORM_ASSISTANT",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file must be under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result);
      setImagePreview(reader.result);
      playClickSound();
      toast.success("Photo attached! Ask a safety question or send to auto-list.");
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (customPrompt) => {
    const textToSend = (customPrompt ?? input).trim();

    if ((!textToSend && !attachedImage) || requestInProgress.current) return;

    playClickSound();

    const history = messages.map(({ role, text }) => ({
      role,
      text,
    }));

    const userMsg = {
      role: "user",
      text: textToSend || (attachedImage ? "Please analyze this attached surplus food photo." : ""),
      image: imagePreview,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const sentImage = attachedImage;
    removeAttachedImage();

    setLoading(true);
    requestInProgress.current = true;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chatbot`,
        {
          message: userMsg.text,
          history,
          image: sentImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botReply =
        response.data.response || "Sorry, I couldn't find an answer to that.";
      const agentType = response.data.agentType || "GENERAL_ASSISTANT";
      const safetyData = response.data.safetyData;
      const listingData = response.data.listingData;
      const reportData = response.data.reportData;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReply,
          agentType,
          safetyData,
          listingData,
          reportData,
        },
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
    removeAttachedImage();
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
            title="Chat with ZeroWaste Agentic AI"
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
              Agentic AI Assistant 🌱
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
            aria-label="ZeroWaste Agentic AI Assistant"
            aria-modal="false"
            className="flex h-[min(700px,calc(100dvh-32px))] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#080f12]/[0.98] text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] backdrop-blur-2xl sm:h-[640px] sm:w-[420px]"
          >
            {/* Header */}
            <header className="relative shrink-0 overflow-hidden border-b border-white/[0.07] bg-gradient-to-br from-[#103c2b] via-[#0b3029] to-[#10201e] px-5 pb-4 pt-4">
              <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-emerald-400/15 blur-[60px]" />
              <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-40 rounded-full bg-teal-400/[0.08] blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/20 bg-white/[0.09] shadow-inner shadow-white/5">
                    <FaLeaf size={20} className="text-emerald-300" />
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#103c2b] bg-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-[14px] font-extrabold tracking-tight text-white">
                        ZeroWaste Agentic AI
                      </h3>
                      <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-emerald-200">
                        LangGraph
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <p className="text-[10.5px] font-medium text-emerald-100/70">
                        Food Safety • Vision • Carbon Audits
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
                    className="rounded-xl p-2 text-white/60 transition-all hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaTrashAlt size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsOpen(false);
                    }}
                    title="Minimize assistant"
                    aria-label="Minimize assistant"
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            </header>

            {/* Quick Prompts */}
            <div className="shrink-0 border-b border-white/[0.06] bg-[#0b1315] px-4 py-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Agentic Workflows
                </span>
                <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <FaBolt size={9} /> Multi-Agent
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[10.5px] font-semibold text-slate-300 transition-all duration-200 hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon size={10} className="text-emerald-400" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.045),transparent_55%)] px-4 py-4 [scrollbar-color:#244c3d_transparent] [scrollbar-width:thin]"
              aria-live="polite"
              aria-relevant="additions text"
            >
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
                      <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                        <FaLeaf size={11} />
                      </div>
                    )}

                    <div className={`relative max-w-[86%] ${isUser ? "order-first" : ""}`}>
                      {!isUser && (
                        <div className="mb-1 ml-1 flex items-center gap-2">
                          <p className="text-[10px] font-bold text-emerald-300/80">
                            {msg.agentType === "FOOD_SAFETY"
                              ? "🛡️ Food Safety Inspector"
                              : msg.agentType === "AUTO_LIST"
                              ? "📸 Vision Listing Agent"
                              : msg.agentType === "IMPACT_REPORT"
                              ? "📊 ESG Impact Auditor"
                              : "Eco Assistant"}
                          </p>
                        </div>
                      )}

                      {/* Attached user thumbnail if present */}
                      {msg.image && (
                        <div className="mb-2 overflow-hidden rounded-xl border border-white/10 max-w-[200px] shadow-md">
                          <img src={msg.image} alt="User upload" className="w-full h-28 object-cover" />
                        </div>
                      )}

                      <div
                        className={`whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-[11.5px] leading-[1.8] shadow-sm ${
                          isUser
                            ? "rounded-br-md border border-emerald-300/20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                            : "rounded-bl-md border border-white/[0.07] bg-[#111c1e] text-slate-200"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {!isUser && (
                        <div className="mt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, idx)}
                            title="Copy response"
                            aria-label="Copy response"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[9.5px] text-slate-500 opacity-100 transition-colors hover:bg-white/[0.05] hover:text-emerald-300 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <FaCheck size={9} className="text-emerald-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <FaCopy size={9} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] text-[9px] font-extrabold text-slate-300">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                    <FaLeaf size={11} />
                  </div>

                  <div className="rounded-[18px] rounded-bl-md border border-white/[0.07] bg-[#111c1e] px-4 py-3">
                    <div className="mb-1.5 text-[10px] font-semibold text-emerald-300/90 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LangGraph Agents Reasoning...
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
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

            {/* Composer Footer */}
            <footer className="shrink-0 border-t border-white/[0.07] bg-[#0b1315] p-3.5 space-y-2">
              {/* Image Preview Banner */}
              {imagePreview && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-2">
                  <div className="flex items-center gap-2">
                    <img src={imagePreview} alt="Attached" className="h-10 w-10 rounded-lg object-cover border border-emerald-400/20" />
                    <div>
                      <p className="text-[10px] font-bold text-emerald-300">Photo Attached</p>
                      <p className="text-[9px] text-slate-400">Ready for Vision inspection</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachedImage}
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                    title="Remove photo"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center gap-1.5 rounded-2xl border border-white/[0.09] bg-[#101a1c] p-1.5 transition-all duration-200 focus-within:border-emerald-400/40 focus-within:ring-2 focus-within:ring-emerald-400/[0.07]"
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Photo Attach Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach food photo for AI inspection"
                  aria-label="Attach food photo"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-white/[0.06] transition"
                >
                  <FaCamera size={14} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  maxLength={2000}
                  aria-label="Message the ZeroWaste Agentic Assistant"
                  placeholder={attachedImage ? "Ask safety question or send to auto-list..." : "Ask FSSAI safety, monthly impact, or surplus..."}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-[11.5px] text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !attachedImage)}
                  aria-label="Send message"
                  title="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[#062018] shadow-lg shadow-emerald-950/30 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
                >
                  <FaPaperPlane size={13} />
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 px-1 text-[8.5px] text-slate-600">
                <span>FSSAI 2019 • UNEP 2024 Standards</span>
                <span className="flex items-center gap-1 text-emerald-400/60 font-semibold">
                  <FaLeaf size={8} /> Think green
                </span>
              </div>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
