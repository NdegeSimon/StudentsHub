import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaBell, FaQuestionCircle, FaSun, FaMoon, 
  FaSmile, FaPaperclip, FaMicrophone, FaCheck, FaCheckDouble,
  FaPlay, FaPause, FaStop, FaReply, FaCog, FaLock
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import CryptoJS from 'crypto-js'; // For encryption

// Emoji picker component
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

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingIndicatorRef = useRef(null);

  // Sample conversations with enhanced data
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
    // ... other conversations
  ]);

  // Initialize encryption
  useEffect(() => {
    // Generate or load encryption key
    const key = localStorage.getItem('encryptionKey') || CryptoJS.lib.WordArray.random(128/8).toString();
    localStorage.setItem('encryptionKey', key);
    setEncryptionKey(key);
    
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Encryption functions
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

  // Search functionality
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSender = filterSender === '' || conv.type === filterSender;
    
    const matchesDate = filterDate === '' || true; // Implement date filtering logic
    
    return matchesSearch && matchesSender && matchesDate;
  });

  // Typing indicator with debounce
  const handleTyping = useCallback(() => {
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  }, [typingTimeout]);

  // Message search within chat
  const searchInMessages = (query) => {
    if (!selectedChat || !query) return [];
    
    return selectedChat.messages.filter(msg => 
      decryptMessage(msg.text).toLowerCase().includes(query.toLowerCase()) ||
      msg.sender.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Emoji reactions
  const handleAddReaction = (messageId, emoji) => {
    if (!selectedChat) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        const updatedMessages = conv.messages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
            let updatedReactions;
            
            if (existingReaction) {
              // Toggle user reaction
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
            
            return {
              ...msg,
              reactions: updatedReactions
            };
          }
          return msg;
        });
        
        const updatedConv = {
          ...conv,
          messages: updatedMessages
        };
        
        if (conv.id === selectedChat.id) {
          setSelectedChat(updatedConv);
        }
        
        return updatedConv;
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };

  // Voice recording
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
    // Convert to base64 for storage (in real app, upload to server)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result;
      
      const voiceMessage = {
        id: Date.now(),
        sender: userType,
        type: 'voice',
        audioUrl: base64Audio,
        duration: '0:15', // Calculate actual duration
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        reactions: [],
        isEncrypted: true
      };
      
      // Add to messages
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

  // File sharing
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

  // Threaded conversations
  const handleReply = (message) => {
    setReplyTo(message);
    setMessageInput(`@${message.sender} `);
  };

  const openThread = (message) => {
    setSelectedThread(message);
    setShowThread(true);
  };

  // Message status updates
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

  // Send message with all features
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
    
    // Update selected chat
    const updatedSelectedChat = updatedConversations.find(c => c.id === selectedChat.id);
    setSelectedChat(updatedSelectedChat);
    
    // Reset states
    if (!customMessage) {
      setMessageInput('');
      setReplyTo(null);
    }

    // Simulate message delivery and read
    setTimeout(() => updateMessageStatus(messageToSend.id, 'delivered'), 1000);
    setTimeout(() => updateMessageStatus(messageToSend.id, 'read'), 3000);

    // Send desktop notification
    if (selectedChat.type !== userType && Notification.permission === 'granted') {
      new Notification(`New message from ${selectedChat.name}`, {
        body: customMessage ? 
          (customMessage.type === 'voice' ? 'Sent a voice message' : `Sent a file: ${customMessage.fileName}`)
          : decryptMessage(messageToSend.text),
        icon: selectedChat.avatar
      });
    }

    // Scroll to bottom
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

  // UI components for features
  const ReactionDisplay = ({ reactions }) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        {reactions.map((reaction, idx) => (
          <button
            key={idx}
            className="text-xs bg-gray-700 px-1 rounded hover:bg-gray-600 transition-colors"
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
        {status === 'sent' && <FaCheck className="text-gray-400" />}
        {status === 'delivered' && <FaCheckDouble className="text-gray-400" />}
        {status === 'read' && <FaCheckDouble className="text-blue-400" />}
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
      <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
        <button 
          onClick={togglePlay}
          className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 w-1/3"></div>
        </div>
        <span className="text-sm text-gray-400">0:15</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Navigation Bar with search filters */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                Studex <FaLock className="inline ml-1 text-sm" />
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link to="/jobs" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Jobs
                </Link>
                <Link to="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Internships
                </Link>
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Messages
                  {notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Enhanced search with filters */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 rounded-md leading-5 focus:outline-none sm:text-sm transition-colors"
                  placeholder="Search messages..."
                />
                {/* Filter dropdown */}
                <div className="absolute hidden group-hover:block mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 space-y-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Filter by Sender</label>
                      <select 
                        value={filterSender}
                        onChange={(e) => setFilterSender(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="">All Senders</option>
                        <option value="employer">Employers</option>
                        <option value="jobseeker">Job Seekers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Filter by Date</label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors">
                <FaQuestionCircle className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none transition-colors relative">
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-yellow-300 hover:text-yellow-200 focus:outline-none transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <FaSun className="h-5 w-5" />
                ) : (
                  <FaMoon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-700 overflow-y-auto bg-gray-800">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <div className="mt-2 text-xs text-gray-400">
              <span className="text-green-400">●</span> End-to-End Encrypted
            </div>
          </div>
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`w-full p-4 flex items-start gap-3 border-b border-gray-700 transition-all hover:bg-gray-700 ${
                selectedChat && selectedChat.id === conv.id
                  ? 'bg-purple-900/30' 
                  : ''
              }`}
            >
              <div className="flex-shrink-0 text-2xl relative">
                {conv.avatar}
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
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
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
        <div className="flex-1 flex flex-col bg-gray-900">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedChat.avatar}</div>
                  <div>
                    <h2 className="font-semibold text-white">
                      {selectedChat.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">
                        {selectedChat.role}
                      </p>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <FaLock /> Encrypted
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isTyping && (
                    <div className="text-sm text-blue-400 italic">
                      You are typing...
                    </div>
                  )}
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <FaCog className="h-5 w-5 text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map(msg => (
                  <div key={msg.id} className="space-y-1">
                    {msg.replyTo && (
                      <div className="ml-12 mb-1 p-2 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-400">Replying to message</p>
                      </div>
                    )}
                    
                    <div className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-md">
                        <div className={`px-4 py-3 rounded-2xl ${
                          msg.sender === userType
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                            : 'bg-gray-700 text-white rounded-bl-none'
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
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleReply(msg)}
                                className="text-xs opacity-0 hover:opacity-100 transition-opacity"
                              >
                                <FaReply />
                              </button>
                              {msg.threadReplies > 0 && (
                                <button
                                  onClick={() => openThread(msg)}
                                  className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                  {msg.threadReplies} replies
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ReactionDisplay reactions={msg.reactions} />
                        
                        <div className="flex gap-1 mt-1">
                          {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(msg.id, emoji)}
                              className="text-xs opacity-0 hover:opacity-100 transition-opacity hover:bg-gray-700 px-1 rounded"
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
                    <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
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
                <div className="px-4 pt-2 border-t border-gray-700 bg-gray-800">
                  <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                    <div className="text-sm text-gray-400">
                      Replying to <span className="font-medium">{replyTo.sender}</span>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex gap-2">
                  {/* Attachment button */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <FaPaperclip className="h-5 w-5" />
                  </button>
                  
                  {/* Emoji button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <FaSmile className="h-5 w-5" />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setMessageInput(prev => prev + emojiData.emoji);
                          }}
                          theme={darkMode ? 'dark' : 'light'}
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
                    className={`px-3 py-3 rounded-xl transition-colors ${
                      isRecording 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a chat from the list to start messaging
                </p>
                <div className="mt-6 text-sm text-gray-500 space-y-1">
                  <p>✓ End-to-End Encryption</p>
                  <p>✓ File Sharing</p>
                  <p>✓ Voice Messages</p>
                  <p>✓ Message Reactions</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thread Sidebar */}
        {showThread && selectedThread && (
          <div className="w-96 border-l border-gray-700 bg-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Thread</h3>
              <button
                onClick={() => setShowThread(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-700 p-3 rounded-lg mb-4">
                <p className="text-sm">{decryptMessage(selectedThread.text)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedThread.time} by {selectedThread.sender}
                </p>
              </div>
              {/* Thread replies would go here */}
              <div className="text-center text-gray-500 text-sm">
                No replies yet
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}