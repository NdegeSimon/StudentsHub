import { useState } from 'react';

export default function MessagingSystem() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
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

    setConversations(updatedConversations);
    setSelectedChat(updatedConversations.find(c => c.id === selectedChat.id));
    setMessageInput('');
  };

  return (
    <div className={`h-screen flex flex-col transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b backdrop-blur-xl transition-all duration-500 ${
        darkMode 
          ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
          : 'bg-white bg-opacity-70 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              darkMode ? 'bg-purple-500' : 'bg-blue-500'
            }`}></div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Messages
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* User Type Selector */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
        {/* Conversations List */}
        <div className={`w-80 border-r overflow-y-auto transition-all duration-500 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`w-full p-4 flex items-start gap-3 border-b transition-all hover:bg-opacity-50 ${
                selectedChat?.id === conv.id
                  ? darkMode 
                    ? 'bg-purple-900 bg-opacity-30' 
                    : 'bg-blue-50'
                  : darkMode
                    ? 'border-gray-700 hover:bg-gray-800'
                    : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl">{conv.avatar}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {conv.name}
                  </h3>
                  {conv.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
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