import { Link } from 'react-router-dom';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MyApplications() {
  const { darkMode } = useTheme();
  
  const applications = [
    // ... your applications data ...
  ];

  const statusStyles = {
    "Under Review": darkMode 
      ? "bg-blue-900 text-blue-100 border-blue-700" 
      : "bg-purple-50 text-purple-700 border-purple-200",
    "Shortlisted": darkMode 
      ? "bg-green-900 text-green-100 border-green-700" 
      : "bg-purple-100 text-purple-800 border-purple-300",
    "Rejected": darkMode 
      ? "bg-red-900 text-red-100 border-red-700" 
      : "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    }`}>
      {/* Navigation Bar */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold ${
                darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
              } transition-colors`}>
                Studex
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-1">
                <NavLink to="/jobs" darkMode={darkMode}>Jobs</NavLink>
                <NavLink to="/internships" darkMode={darkMode}>Internships</NavLink>
                <NavLink to="/myapplications" darkMode={darkMode} active>My Applications</NavLink>
                <NavLink to="/messages" darkMode={darkMode}>Messages</NavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                  } rounded-md leading-5 focus:outline-none sm:text-sm transition-colors`}
                  placeholder="Search jobs..."
                />
              </div>
              
              <button className={`p-2 rounded-full ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              } focus:outline-none transition-colors`}>
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className={`p-2 rounded-full ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              } focus:outline-none transition-colors`}>
                <Bell className="h-6 w-6" />
              </button>
              <button className={`p-2 rounded-full ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              } focus:outline-none transition-colors`}>
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Applications
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Monitor your job applications and follow their progress
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-6 md:mt-0">
              <div className={`border rounded-xl px-5 py-3 text-center ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {applications.length}
                </p>
              </div>
              <div className={`border rounded-xl px-5 py-3 text-center ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shortlisted</p>
                <p className="text-2xl font-bold text-green-500">
                  {applications.filter(app => app.status === 'Shortlisted').length}
                </p>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`border rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-600' 
                    : 'bg-white border-purple-100 hover:border-purple-200'
                } hover:shadow-lg`}
              >
                {/* Left */}
                <div className="flex gap-4">
                  {/* Company Logo Placeholder */}
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold ${
                    darkMode 
                      ? 'bg-gray-700 text-purple-400' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {app.company.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <h2 className={`text-lg font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {app.title}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {app.company}
                    </p>
                    <div className={`flex gap-3 text-xs mt-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      <span>{app.type}</span>
                      <span>•</span>
                      <span>Applied on {app.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 mt-5 lg:mt-0">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                      statusStyles[app.status]
                    }`}
                  >
                    {app.status}
                  </span>

                  <button className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    darkMode
                      ? 'border-purple-600 text-purple-400 hover:bg-purple-900'
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                  }`}>
                    View Job
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {applications.length === 0 && (
            <div className={`border rounded-2xl p-16 text-center ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                No applications yet
              </h2>
              <p className={`mt-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Start applying for jobs and track them here.
              </p>
              <button className={`mt-6 px-6 py-3 rounded-full font-medium transition-colors ${
                darkMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}>
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// NavLink component for consistent styling
function NavLink({ to, children, darkMode, active = false }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? darkMode
            ? 'bg-blue-900 text-white'
            : 'bg-blue-100 text-blue-700'
          : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}