import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaQuestionCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function MessagingSystem() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [userType, setUserType] = useState('jobseeker'); // 'jobseeker' or 'employer'

  // Sample conversations
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
      messages: [
        { id: 1, sender: 'employer', text: 'Hi! We reviewed your application for the Senior Developer role.', time: '10:30 AM' },
        { id: 2, sender: 'jobseeker', text: 'Thank you! I\'m very interested in this opportunity.', time: '10:35 AM' },
        { id: 3, sender: 'employer', text: 'Great! When are you available for an interview?', time: '10:40 AM' },
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Applied for Marketing Manager',
      avatar: '👩',
      lastMessage: 'I have 5 years of experience in digital marketing',
      time: '1h ago',
      unread: 0,
      type: 'jobseeker',
      messages: [
        { id: 1, sender: 'employer', text: 'Hello Sarah, thank you for applying to our Marketing Manager position.', time: '9:00 AM' },
        { id: 2, sender: 'jobseeker', text: 'Hi! Thank you for reaching out. I\'m excited about this role.', time: '9:15 AM' },
        { id: 3, sender: 'employer', text: 'Can you tell me about your experience?', time: '9:20 AM' },
        { id: 4, sender: 'jobseeker', text: 'I have 5 years of experience in digital marketing', time: '9:25 AM' },
      ]
    },
    {
      id: 3,
      name: 'StartupHub',
      role: 'Product Designer Opening',
      avatar: '🚀',
      lastMessage: 'Your portfolio looks impressive!',
      time: '3h ago',
      unread: 1,
      type: 'employer',
      messages: [
        { id: 1, sender: 'employer', text: 'Your portfolio looks impressive!', time: '8:00 AM' },
      ]
    },
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: userType,
              text: messageInput,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          lastMessage: messageInput,
          time: 'Just now'
        };
      }
      return conv;
    });

    setMessageInput('');

    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold ${
                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
              } transition-colors`}>
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <Link 
                  to="/jobs" 
                  className={`${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Jobs
                </Link>
                <Link 
                  to="#" 
                  className={`${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Internships
                </Link>
                <NavLink 
                  to="/messages"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? darkMode 
                          ? 'bg-blue-900 text-white' 
                          : 'bg-blue-100 text-blue-700'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Messages
                </NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                  } rounded-md leading-5 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="Search messages..."
                />
              </div>
              
              <button 
                className={`p-2 rounded-full ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
              >
                <FaQuestionCircle className="h-5 w-5" />
              </button>
              <button 
                className={`p-2 rounded-full ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
              >
                <FaBell className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none transition-colors`}
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
      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden bg-opacity-70 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }">
        {/* Conversations List */}
        <div className={`w-80 border-r overflow-y-auto transition-all duration-500 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`w-full p-4 flex items-start gap-3 border-b transition-all hover:bg-opacity-50 ${
                selectedChat && selectedChat.id === conv.id
                  ? darkMode 
                    ? 'bg-purple-900 bg-opacity-30' 
                    : 'bg-blue-50'
                  : darkMode 
                    ? 'border-gray-700 hover:bg-gray-800' 
                    : 'border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex-shrink-0 text-2xl">
                {conv.avatar}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {conv.name}
                  </h3>
                  {conv.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {conv.role}
                </p>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {conv.lastMessage}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {conv.time}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center gap-3 transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800 bg-opacity-30 border-gray-700' 
                  : 'bg-white bg-opacity-50 border-gray-200'
              }`}>
                <div className="text-3xl">{selectedChat.avatar}</div>
                <div>
                  <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedChat.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedChat.role}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender === userType
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                        : darkMode
                          ? 'bg-gray-700 text-white rounded-bl-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === userType ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t transition-all duration-500 ${
                darkMode 
                  ? 'bg-gray-800 bg-opacity-30 border-gray-700' 
                  : 'bg-white bg-opacity-50 border-gray-200'
              }`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                        : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Select a conversation
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}