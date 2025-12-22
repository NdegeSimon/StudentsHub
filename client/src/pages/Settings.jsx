import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, User, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext.jsx';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="group flex items-center justify-between py-6 border-b border-opacity-10 transition-all hover:bg-opacity-5 hover:bg-white px-4 -mx-4 rounded-lg">
      <div className="flex-1">
        <h3 className={`text-lg font-semibold transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {label}
        </h3>
        {description && (
          <p className={`text-sm mt-1.5 transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-inner transform hover:scale-105 ${
          enabled 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 focus:ring-purple-500' 
            : darkMode ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
            enabled ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Header component
  const Header = () => (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-600 hover:text-purple-800">
              Studex
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link to="/jobs" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Jobs</Link>
              <Link to="#" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Internships</Link>
              <Link to="/myapplications" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">My Applications</Link>
              <Link to="#" className="text-purple-900 hover:text-purple-700 px-3 py-2 text-sm font-medium">Messages</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search jobs..."
              />
            </div>
            
            <button className="p-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none">
              <HelpCircle className="h-6 w-6" />
            </button>
            <button 
              className="p-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>
            <button className="p-2 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            <div 
              className="ml-2 cursor-pointer hover:bg-purple-50 rounded-full p-1 transition-colors"
              onClick={() => navigate('/settings')}
            >
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div 
              className="ml-2 cursor-pointer hover:bg-purple-50 rounded-full p-1 transition-colors"
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      <style>{`
        body {
          background-color: ${darkMode ? '#111827' : '#f9fafb'};
          transition: background-color 0.3s ease;
        }
      `}</style>
      <Header />
      <div className={`py-12 px-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-3xl mx-auto">
        {/* Header with glassmorphism effect */}
        <div className={`mb-8 p-8 rounded-2xl backdrop-blur-xl shadow-2xl border transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-800 bg-opacity-50 border-gray-700 border-opacity-50' 
            : 'bg-white bg-opacity-70 border-gray-200 border-opacity-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              darkMode ? 'bg-purple-500' : 'bg-blue-500'
            }`}></div>
            <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              darkMode 
                ? 'from-white to-gray-300' 
                : 'from-gray-900 to-gray-600'
            }`}>
              Settings
            </h1>
          </div>
          <p className={`text-sm ml-5 transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Customize your experience with precision controls
          </p>
        </div>

        {/* Settings card */}
        <div className={`rounded-2xl backdrop-blur-xl shadow-2xl border overflow-hidden transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-800 bg-opacity-50 border-gray-700 border-opacity-50' 
            : 'bg-white bg-opacity-70 border-gray-200 border-opacity-50'
        }`}>
          <div className="p-8">
            <ToggleSwitch
              enabled={notifications}
              onToggle={() => setNotifications(!notifications)}
              label="Push Notifications"
              description="Real-time alerts for updates and important activity"
            />

            <ToggleSwitch
              enabled={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
              label="Dark Mode"
              description="Elegant dark theme optimized for low-light environments"
            />

            <ToggleSwitch
              enabled={autoSave}
              onToggle={() => setAutoSave(!autoSave)}
              label="Auto Save"
              description="Intelligent background saving with zero interruptions"
            />

            <ToggleSwitch
              enabled={emailUpdates}
              onToggle={() => setEmailUpdates(!emailUpdates)}
              label="Email Updates"
              description="Curated weekly insights and feature highlights"
            />
          </div>

          {/* Premium save button */}
          <div className={`p-8 border-t transition-all duration-500 ${
            darkMode 
              ? 'bg-gray-900 bg-opacity-30 border-gray-700 border-opacity-50' 
              : 'bg-gray-50 bg-opacity-50 border-gray-200 border-opacity-50'
          }`}>
            <button className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-3.5 px-6 rounded-xl transition-all duration-500 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-[1.02] overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Save Changes
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
            </button>
          </div>
        </div>

        {/* Premium badge */}
        <div className="mt-6 text-center">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            darkMode 
              ? 'bg-purple-900 bg-opacity-30 text-purple-300' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Experience
          </span>
        </div>
      </div>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
      `}</style>
      </div>
    </div>
  );
}