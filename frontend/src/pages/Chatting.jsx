import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  MapPin, 
  Image as ImageIcon, 
  FileText, 
  X, 
  ExternalLink, 
  Download,
  ArrowLeft,
  Loader2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { playNotificationSound } from '../utils/notificationSound';

const Chatting = () => {
  const { id: chatUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const { socket } = useSocket();
  const { userId } = useAuth();

  // 1. Fetch Receiver Profile
  useEffect(() => {
    if (!chatUserId || !token) return;

    const fetchReceiverProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/myprofile/${chatUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.user) {
          setReceiver(res.data.user);
        }
      } catch (err) {
        console.warn("Could not fetch receiver profile:", err.message);
      }
    };

    fetchReceiverProfile();
  }, [chatUserId, token]);

  // 2. Fetch Messages
  useEffect(() => {
    if (!chatUserId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/message/get/${chatUserId}`,
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

  // 3. Real-time socket message & delete listeners
  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (incomingMsg) => {
      const senderIdStr = typeof incomingMsg.senderId === 'object' ? incomingMsg.senderId?._id?.toString() : incomingMsg.senderId?.toString();
      const receiverIdStr = typeof incomingMsg.receiverId === 'object' ? incomingMsg.receiverId?._id?.toString() : incomingMsg.receiverId?.toString();

      const isFromChatUser = senderIdStr === chatUserId;
      const isToChatUser = receiverIdStr === chatUserId;

      if (isFromChatUser || isToChatUser) {
        if (isFromChatUser) {
          playNotificationSound();
        }
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg._id === incomingMsg._id)) {
            return prevMessages;
          }
          return [...prevMessages, incomingMsg];
        });
      }
    };

    const handleDeleteMessageSocket = ({ messageId }) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("deleteMessage", handleDeleteMessageSocket);

    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("deleteMessage", handleDeleteMessageSocket);
    };
  }, [socket, chatUserId]);

  const handleConfirmDelete = async () => {
    if (!deletingMessageId) return;
    const messageId = deletingMessageId;
    setDeletingMessageId(null);

    try {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/delete/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Message deleted");
    } catch (err) {
      console.error("❌ Error deleting message:", err.message);
      toast.error("Could not delete message");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // File & Media selection handlers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image size should be less than 15MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);

        setAttachment({
          type: 'image',
          name: file.name,
          dataUrl: compressedDataUrl
        });
        setShowAttachMenu(false);
        toast.success("Image attached!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        type: 'file',
        name: file.name,
        dataUrl: reader.result
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setShowAttachMenu(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `📍 Shared Location: https://www.google.com/maps?q=${latitude},${longitude} (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})`;
        
        sendMessagePayload(locationMessage);
        setLocationLoading(false);
        toast.success("Location shared!");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve location. Please check browser permissions.");
        setLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const sendMessagePayload = async (payloadText) => {
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      message: payloadText,
      senderId: userId || 'currentUser',
      receiverId: chatUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/send/${chatUserId}`,
        { message: payloadText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === tempId ? res.data : msg
        )
      );
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    let finalMessage = newMessage.trim();

    if (attachment) {
      if (attachment.type === 'image') {
        finalMessage = `[IMAGE] ${attachment.name}|${attachment.dataUrl}` + (finalMessage ? `\n${finalMessage}` : '');
      } else if (attachment.type === 'file') {
        finalMessage = `[FILE] ${attachment.name}|${attachment.dataUrl}` + (finalMessage ? `\n${finalMessage}` : '');
      }
    }

    if (!finalMessage) return;

    setNewMessage('');
    setAttachment(null);
    setShowAttachMenu(false);

    await sendMessagePayload(finalMessage);
  };

  const renderMessageContent = (content) => {
    if (content.startsWith('[IMAGE] ')) {
      const payload = content.replace('[IMAGE] ', '');
      const firstPipe = payload.indexOf('|');
      const filename = firstPipe !== -1 ? payload.substring(0, firstPipe) : 'Shared Image';
      const rest = firstPipe !== -1 ? payload.substring(firstPipe + 1) : payload;
      
      const newlineIdx = rest.indexOf('\n');
      const dataUrl = newlineIdx !== -1 ? rest.substring(0, newlineIdx) : rest;
      const captionText = newlineIdx !== -1 ? rest.substring(newlineIdx + 1) : '';

      return (
        <div className="space-y-2">
          <div className="relative group rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
            <img 
              src={dataUrl} 
              alt={filename} 
              className="max-h-64 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" 
            />
            <a 
              href={dataUrl} 
              download={filename} 
              className="absolute bottom-2 right-2 bg-gray-900/80 hover:bg-emerald-600 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
              title="Download Image"
            >
              <Download size={14} />
            </a>
          </div>
          {captionText && <p className="text-sm font-medium text-slate-100">{captionText}</p>}
        </div>
      );
    }

    if (content.startsWith('[FILE] ')) {
      const payload = content.replace('[FILE] ', '');
      const firstPipe = payload.indexOf('|');
      const filename = firstPipe !== -1 ? payload.substring(0, firstPipe) : 'Attachment File';
      const rest = firstPipe !== -1 ? payload.substring(firstPipe + 1) : payload;
      
      const newlineIdx = rest.indexOf('\n');
      const dataUrl = newlineIdx !== -1 ? rest.substring(0, newlineIdx) : rest;
      const captionText = newlineIdx !== -1 ? rest.substring(newlineIdx + 1) : '';

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-800/90 rounded-xl border border-gray-700 shadow-sm">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileText size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{filename}</p>
              <span className="text-[10px] text-emerald-400/80 block">Document Attachment</span>
            </div>
            <a 
              href={dataUrl} 
              download={filename}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Download File"
            >
              <Download size={14} />
            </a>
          </div>
          {captionText && <p className="text-sm font-medium text-slate-100">{captionText}</p>}
        </div>
      );
    }

    if (content.includes('📍 Shared Location:') || content.includes('https://www.google.com/maps')) {
      const mapsUrlMatch = content.match(/https:\/\/[^\s]+/);
      const mapsUrl = mapsUrlMatch ? mapsUrlMatch[0] : '#';

      return (
        <div className="space-y-2">
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <MapPin size={16} className="text-emerald-400 animate-bounce" />
              <span>Live Location Shared</span>
            </div>
            <p className="text-xs text-emerald-100/90">{content}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      );
    }

    return <p className="text-sm leading-relaxed">{content}</p>;
  };

  const displayName = receiver?.name || receiver?.organisation || `User ${chatUserId?.slice(-4) || 'Unknown'}`;
  const displayPhoto = receiver?.photo?.url;
  const displayRole = receiver?.role || 'Peer';

  return (
    <div className="flex flex-col h-screen max-h-screen w-full bg-slate-950 text-white font-sans overflow-hidden relative selection:bg-emerald-500">
      {/* Hidden File Inputs */}
      <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.zip,.rar" className="hidden" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-emerald-900/40 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          
          {/* Receiver Avatar & Name */}
          <div className="flex items-center space-x-3">
            {displayPhoto ? (
              <img src={displayPhoto} alt={displayName} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">{displayName}</h2>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs text-emerald-400 font-medium capitalize">{displayRole} • Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Feed (Only this area scrolls) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-slate-900">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full space-y-3">
            <Loader2 size={32} className="text-emerald-500 animate-spin" />
            <p className="text-xs text-emerald-400 animate-pulse">Loading Chat Conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center space-y-2">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
              <Paperclip size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-300">👋 No messages yet with {displayName}!</p>
            <p className="text-xs text-slate-400 max-w-xs">Start the conversation or share documents, photos, and location details.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderIdStr = typeof msg.senderId === 'object' ? msg.senderId?._id?.toString() : msg.senderId?.toString();
            const isMyMessage = senderIdStr !== chatUserId;

            return (
              <div key={msg._id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl break-words shadow-md ${
                    isMyMessage
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {renderMessageContent(msg.message)}
                  <div className="flex items-center justify-end space-x-2 mt-1.5 opacity-80">
                    <span className="text-[10px] text-emerald-100/70 font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMyMessage && (
                      <button
                        onClick={() => setDeletingMessageId(msg._id)}
                        className="text-emerald-200/70 hover:text-rose-300 transition-colors p-0.5"
                        title="Delete Message"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Options Menu Popup */}
      {showAttachMenu && (
        <div className="px-6 py-3 bg-slate-900 border-t border-emerald-900/40 flex items-center justify-around animate-fade-in shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex flex-col items-center space-y-1 text-slate-300 hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-slate-800"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
              <ImageIcon size={20} />
            </div>
            <span className="text-xs font-medium">Media / Photos</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center space-y-1 text-slate-300 hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-slate-800"
          >
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/30">
              <FileText size={20} />
            </div>
            <span className="text-xs font-medium">Document / File</span>
          </button>

          <button
            type="button"
            onClick={handleSendLocation}
            disabled={locationLoading}
            className="flex flex-col items-center space-y-1 text-slate-300 hover:text-emerald-400 transition-colors p-2 rounded-xl hover:bg-slate-800 disabled:opacity-50"
          >
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-full border border-emerald-500/30">
              {locationLoading ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
            </div>
            <span className="text-xs font-medium">{locationLoading ? 'Locating...' : 'Send Location'}</span>
          </button>
        </div>
      )}

      {/* Attachment Preview Badge */}
      {attachment && (
        <div className="px-6 py-2 bg-slate-900 border-t border-emerald-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            {attachment.type === 'image' ? (
              <img src={attachment.dataUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-emerald-500/40" />
            ) : (
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <FileText size={20} />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-xs">{attachment.name}</p>
              <span className="text-[10px] text-emerald-400">Ready to send</span>
            </div>
          </div>
          <button 
            onClick={() => setAttachment(null)}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
            title="Remove Attachment"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-slate-900 border-t border-emerald-900/40 flex items-center gap-3 shrink-0"
      >
        <button 
          type="button" 
          onClick={() => setShowAttachMenu(prev => !prev)}
          className={`p-2.5 rounded-full transition-colors ${
            showAttachMenu ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Attachments & Actions"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message or attach files..."
          className="flex-1 bg-slate-800 border border-slate-700/60 rounded-full py-2.5 px-4 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          autoComplete="off"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full p-3 shadow-md disabled:opacity-50 transition-all"
          disabled={!newMessage.trim() && !attachment}
        >
          <Send size={18} />
        </button>
      </form>

      {/* Delete Confirmation Modal Overlay */}
      {deletingMessageId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 bg-rose-500/10 rounded-xl">
                <Trash2 size={22} />
              </div>
              <h3 className="font-bold text-lg text-white">Delete Message?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMessageId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;


