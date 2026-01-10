import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaBell, FaQuestionCircle, FaSun, FaMoon, 
  FaSmile, FaPaperclip, FaMicrophone, FaCheck, FaCheckDouble,
  FaPlay, FaPause, FaStop, FaReply, FaCog, FaLock, FaTimes,
  FaFilter, FaShieldAlt
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import CryptoJS from 'crypto-js';
import EmojiPicker from 'emoji-picker-react';

export default function MessagingSystem() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [userType, setUserType] = useState('jobseeker');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterSender, setFilterSender] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showThread, setShowThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingIndicatorRef = useRef(null);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'TechCorp Inc.',
      role: 'Senior Developer Position',
      avatar: '🏢',
      lastMessage: 'When are you available for an interview?',
      time: '2m ago',
      unread: 2,
      type: 'employer',
      isTyping: false,
      encryptionKey: 'techcorp-key-123',
      messages: [
        { 
          id: 1, 
          sender: 'employer', 
          text: 'Hi! We reviewed your application for the Senior Developer role.', 
          time: '10:30 AM',
          status: 'read',
          reactions: [{ emoji: '👍', users: ['employer'] }],
          threadReplies: 2,
          files: [],
          isEncrypted: true
        },
        { 
          id: 2, 
          sender: 'jobseeker', 
          text: 'Thank you! I\'m very interested in this opportunity.', 
          time: '10:35 AM',
          status: 'delivered',
          reactions: [],
          threadReplies: 0,
          files: [],
          isEncrypted: true
        },
        { 
          id: 3, 
          sender: 'employer', 
          text: 'Great! When are you available for an interview?', 
          time: '10:40 AM',
          status: 'read',
          reactions: [{ emoji: '👋', users: ['jobseeker', 'employer'] }],
          threadReplies: 1,
          files: [],
          isEncrypted: true
        },
      ]
    },
  ]);

  useEffect(() => {
    const key = localStorage.getItem('encryptionKey') || CryptoJS.lib.WordArray.random(128/8).toString();
    localStorage.setItem('encryptionKey', key);
    setEncryptionKey(key);
    
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const encryptMessage = (text) => {
    if (!encryptionKey) return text;
    return CryptoJS.AES.encrypt(text, encryptionKey).toString();
  };

  const decryptMessage = (ciphertext) => {
    if (!encryptionKey || !ciphertext.startsWith('U2FsdGVkX1')) return ciphertext;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return ciphertext;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSender = filterSender === '' || conv.type === filterSender;
    const matchesDate = filterDate === '' || true;
    
    return matchesSearch && matchesSender && matchesDate;
  });

  const handleTyping = useCallback(() => {
    setIsTyping(true);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    setTypingTimeout(timeout);
  }, [typingTimeout]);

  const handleAddReaction = (messageId, emoji) => {
    if (!selectedChat) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        const updatedMessages = conv.messages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
            let updatedReactions;
            
            if (existingReaction) {
              if (existingReaction.users.includes(userType)) {
                updatedReactions = msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: r.users.filter(u => u !== userType) }
                    : r
                ).filter(r => r.users.length > 0);
              } else {
                updatedReactions = msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, users: [...r.users, userType] }
                    : r
                );
              }
            } else {
              updatedReactions = [
                ...(msg.reactions || []),
                { emoji, users: [userType] }
              ];
            }
            
            return { ...msg, reactions: updatedReactions };
          }
          return msg;
        });
        
        const updatedConv = { ...conv, messages: updatedMessages };
        if (conv.id === selectedChat.id) {
          setSelectedChat(updatedConv);
        }
        return updatedConv;
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendVoiceMessage(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = (audioBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result;
      
      const voiceMessage = {
        id: Date.now(),
        sender: userType,
        type: 'voice',
        audioUrl: base64Audio,
        duration: '0:15',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        reactions: [],
        isEncrypted: true
      };
      
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedChat.id) {
          const newMessages = [...conv.messages, voiceMessage];
          return {
            ...conv,
            messages: newMessages,
            lastMessage: 'Voice message',
            time: 'Just now'
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      updateSelectedChat(voiceMessage);
    };
    reader.readAsDataURL(audioBlob);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const fileData = {
          id: Date.now(),
          sender: userType,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(2) + ' KB',
          fileUrl: reader.result,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          reactions: [],
          isEncrypted: true
        };
        
        sendMessage(fileData);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setMessageInput(`@${message.sender} `);
  };

  const openThread = (message) => {
    setSelectedThread(message);
    setShowThread(true);
  };

  const updateMessageStatus = (messageId, status) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        const updatedMessages = conv.messages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        );
        return { ...conv, messages: updatedMessages };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };

  const sendMessage = (customMessage = null) => {
    const messageToSend = customMessage || {
      id: Date.now(),
      sender: userType,
      text: encryptMessage(messageInput),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      reactions: [],
      threadReplies: 0,
      files: [],
      replyTo: replyTo?.id || null,
      isEncrypted: true
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        const newMessages = [...conv.messages, messageToSend];
        
        return {
          ...conv,
          messages: newMessages,
          lastMessage: customMessage ? 
            (customMessage.type === 'voice' ? 'Voice message' : `File: ${customMessage.fileName}`) 
            : messageInput,
          time: 'Just now',
          unread: conv.type === userType ? 0 : conv.unread + 1
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    
    const updatedSelectedChat = updatedConversations.find(c => c.id === selectedChat.id);
    setSelectedChat(updatedSelectedChat);
    
    if (!customMessage) {
      setMessageInput('');
      setReplyTo(null);
    }

    setTimeout(() => updateMessageStatus(messageToSend.id, 'delivered'), 1000);
    setTimeout(() => updateMessageStatus(messageToSend.id, 'read'), 3000);

    if (selectedChat.type !== userType && Notification.permission === 'granted') {
      new Notification(`New message from ${selectedChat.name}`, {
        body: customMessage ? 
          (customMessage.type === 'voice' ? 'Sent a voice message' : `Sent a file: ${customMessage.fileName}`)
          : decryptMessage(messageToSend.text),
        icon: selectedChat.avatar
      });
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    sendMessage();
  };

  const updateSelectedChat = (newMessage) => {
    const updatedConv = conversations.find(c => c.id === selectedChat.id);
    if (updatedConv) {
      setSelectedChat({
        ...updatedConv,
        messages: [...updatedConv.messages, newMessage]
      });
    }
  };

  const ReactionDisplay = ({ reactions }) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        {reactions.map((reaction, idx) => (
          <button
            key={idx}
            className="text-xs bg-gray-800/80 backdrop-blur-sm px-2 py-0.5 rounded-full hover:bg-gray-700/80 transition-all border border-gray-700/50"
            title={reaction.users.join(', ')}
          >
            {reaction.emoji} {reaction.users.length}
          </button>
        ))}
      </div>
    );
  };

  const MessageStatus = ({ status }) => {
    return (
      <span className="ml-1">
        {status === 'sent' && <FaCheck className="text-gray-400 text-xs" />}
        {status === 'delivered' && <FaCheckDouble className="text-gray-400 text-xs" />}
        {status === 'read' && <FaCheckDouble className="text-blue-400 text-xs" />}
      </span>
    );
  };

  const AudioPlayer = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(audioUrl));
    
    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };
    
    return (
      <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
        <button 
          onClick={togglePlay}
          className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
        </button>
        <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-1/3"></div>
        </div>
        <span className="text-sm text-gray-400">0:15</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-50 bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all">
                  <FaShieldAlt className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Studex
                </span>
              </Link>
              
              <nav className="hidden md:flex space-x-1">
                <Link to="/jobs" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Jobs
                </Link>
                <Link to="#" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  Internships
                </Link>
                <NavLink 
                  to="/messages"
                  className="relative flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30"
                >
                  Messages
                  {notifications.length > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {notifications.length}
                    </span>
                  )}
                </NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative hidden lg:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-lg leading-5 focus:outline-none text-sm transition-all"
                  placeholder="Search messages..."
                />
              </div>
              
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
                <FaQuestionCircle className="h-5 w-5" />
              </button>
              
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all relative">
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-yellow-400 hover:text-yellow-300 hover:bg-gray-800/50 transition-all"
              >
                {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-800/50 overflow-y-auto bg-gray-900/50 backdrop-blur-xl">
          <div className="p-4 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-all"
              >
                <FaFilter className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <FaLock className="text-green-400" />
                <span className="text-green-300">End-to-End Encrypted</span>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 space-y-2">
                <select 
                  value={filterSender}
                  onChange={(e) => setFilterSender(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="">All Senders</option>
                  <option value="employer">Employers</option>
                  <option value="jobseeker">Job Seekers</option>
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            )}
          </div>

          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`w-full p-4 flex items-start gap-3 border-b border-gray-800/50 transition-all hover:bg-gray-800/30 group ${
                selectedChat && selectedChat.id === conv.id
                  ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-l-4 border-l-purple-500' 
                  : ''
              }`}
            >
              <div className="flex-shrink-0 text-2xl relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700/50 group-hover:border-purple-500/50 transition-all">
                  {conv.avatar}
                </div>
                {conv.isTyping && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></div>
                  </div>
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium truncate text-white">
                    {conv.name}
                  </h3>
                  {conv.unread > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 shadow-lg">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs mb-1 text-gray-400">
                  {conv.role}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-sm truncate text-gray-400 flex-1">
                    {conv.lastMessage}
                  </p>
                  {conv.messages[conv.messages.length - 1]?.status && (
                    <MessageStatus status={conv.messages[conv.messages.length - 1].status} />
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  {conv.time}
                  {conv.isTyping && (
                    <span className="ml-2 text-blue-400 italic">typing...</span>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900/30 backdrop-blur-sm">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-2xl border border-gray-700/50">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-white flex items-center gap-2">
                      {selectedChat.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">
                        {selectedChat.role}
                      </p>
                      <span className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
                        <FaLock className="text-xs" /> Encrypted
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isTyping && (
                    <div className="text-sm text-blue-400 italic flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      typing
                    </div>
                  )}
                  <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
                    <FaCog className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className="space-y-1 group">
                    {msg.replyTo && (
                      <div className="ml-12 mb-1 p-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-400">Replying to message</p>
                      </div>
                    )}
                    
                    <div className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-md">
                        <div className={`px-4 py-3 rounded-2xl backdrop-blur-xl border transition-all ${
                          msg.sender === userType
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-500/20 border-purple-500/50'
                            : 'bg-gray-800/80 text-white rounded-bl-none border-gray-700/50'
                        }`}>
                          {msg.type === 'voice' ? (
                            <AudioPlayer audioUrl={msg.audioUrl} />
                          ) : msg.type === 'image' ? (
                            <div className="space-y-2">
                              <img 
                                src={msg.fileUrl} 
                                alt={msg.fileName}
                                className="max-w-full rounded-lg"
                              />
                              <p className="text-sm">{msg.fileName}</p>
                            </div>
                          ) : msg.type === 'document' ? (
                            <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                              <div className="text-lg">📄</div>
                              <div>
                                <p className="text-sm font-medium">{msg.fileName}</p>
                                <p className="text-xs text-gray-400">{msg.fileSize}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{decryptMessage(msg.text)}</p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              msg.sender === userType ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {msg.time}
                              {msg.sender === userType && (
                                <MessageStatus status={msg.status} />
                              )}
                            </p>
                            
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleReply(msg)}
                                className="text-xs hover:text-white transition-colors"
                              >
                                <FaReply />
                              </button>
                              {msg.threadReplies > 0 && (
                                <button
                                  onClick={() => openThread(msg)}
                                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  {msg.threadReplies} replies
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ReactionDisplay reactions={msg.reactions} />
                        
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(msg.id, emoji)}
                              className="text-xs hover:bg-gray-700/80 px-1.5 py-0.5 rounded-full backdrop-blur-sm transition-all"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {selectedChat.isTyping && (
                  <div ref={typingIndicatorRef} className="flex justify-start">
                    <div className="bg-gray-800/80 backdrop-blur-xl px-4 py-3 rounded-2xl rounded-bl-none border border-gray-700/50">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Reply preview */}
              {replyTo && (
                <div className="px-4 pt-2 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
                  <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50">
                    <div className="text-sm text-gray-400">
                      Replying to <span className="font-medium">{replyTo.sender}</span>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
                <div className="flex gap-2">
                  {/* Attachment button */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all"
                  >
                    <FaPaperclip className="h-5 w-5" />
                  </button>
                  
                  {/* Emoji button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all"
                    >
                      <FaSmile className="h-5 w-5" />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setMessageInput(prev => prev + emojiData.emoji);
                          }}
                          theme={'dark'}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Voice recording button */}
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`px-3 py-3 rounded-xl transition-all ${
                      isRecording 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {isRecording ? <FaStop className="h-5 w-5" /> : <FaMicrophone className="h-5 w-5" />}
                  </button>
                  
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Send
                  </button>
                </div>
                
                {/* File input (hidden) */}
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl">
                <div className="text-8xl mb-6 animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  💬
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Select a conversation
                </h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  Choose a chat from the list to start secure, encrypted messaging
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <FaLock className="text-green-400" />
                    <span>End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <FaPaperclip className="text-blue-400" />
                    <span>File Sharing</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <FaMicrophone className="text-purple-400" />
                    <span>Voice Messages</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <FaSmile className="text-yellow-400" />
                    <span>Message Reactions</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thread Sidebar */}
        {showThread && selectedThread && (
          <div className="w-96 border-l border-gray-800/50 bg-gray-900/80 backdrop-blur-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/80">
              <h3 className="font-semibold text-white">Thread</h3>
              <button
                onClick={() => setShowThread(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 mb-4">
                <p className="text-sm text-white">{decryptMessage(selectedThread.text)}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedThread.time} by {selectedThread.sender}
                </p>
              </div>
              <div className="text-center text-gray-500 text-sm p-8">
                <div className="text-4xl mb-3">💭</div>
                <p>No replies yet</p>
                <p className="text-xs text-gray-600 mt-1">Be the first to reply to this thread</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}