import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, User, Settings, Sparkles, Shield, Zap, Mail, Save, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description, icon: Icon, accentColor }) => (
    <div className="group relative">
      <div className="flex items-start justify-between p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${accentColor} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1.5">
              {label}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-inner transform hover:scale-105 flex-shrink-0 ml-4 ${
            enabled 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
              enabled ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const SettingCategory = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-transparent"></div>
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-all">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Studex
              </span>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-1">
              <Link to="/jobs" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">Jobs</Link>
              <Link to="#" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">Internships</Link>
              <Link to="/myapplications" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">My Applications</Link>
              <Link to="#" className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all">Messages</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Search jobs..."
              />
            </div>
            
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all">
              <HelpCircle className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
            </button>
            <div 
              className="cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-all group"
              onClick={() => navigate('/settings')}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:border-purple-500/50 transition-all">
                <Settings className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <div 
              className="cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-all group"
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                <User className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <Header />
      
      <div className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Premium Settings</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Customize Your Experience
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tailor every aspect of your workspace with intelligent controls designed for power users
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Main Settings Panel */}
            <div className="lg:col-span-2 space-y-8">
              <SettingCategory title="Preferences">
                <ToggleSwitch
                  enabled={notifications}
                  onToggle={() => setNotifications(!notifications)}
                  label="Push Notifications"
                  description="Stay informed with real-time alerts for applications, messages, and important updates"
                  icon={Bell}
                  accentColor="from-blue-500 to-cyan-500"
                />

                <ToggleSwitch
                  enabled={autoSave}
                  onToggle={() => setAutoSave(!autoSave)}
                  label="Auto Save"
                  description="Never lose your work with intelligent background saving and version control"
                  icon={Save}
                  accentColor="from-green-500 to-emerald-500"
                />

                <ToggleSwitch
                  enabled={emailUpdates}
                  onToggle={() => setEmailUpdates(!emailUpdates)}
                  label="Email Digest"
                  description="Weekly curated insights, job recommendations, and platform feature highlights"
                  icon={Mail}
                  accentColor="from-orange-500 to-red-500"
                />
              </SettingCategory>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Account Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Profile Strength</span>
                    <span className="text-green-400 font-semibold">92%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-gray-400">Applications</span>
                    <span className="text-white font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Saved Jobs</span>
                    <span className="text-white font-semibold">12</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-semibold text-white">Pro Tip</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Enable notifications to never miss important application updates and interview invitations
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-6 z-40">
            <div className="p-6 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Settings</div>
                    <div className="text-xs text-gray-400">
                      {saved ? 'Changes saved successfully!' : 'Customize your preferences'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 hover:bg-pos-100 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-500 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {saved ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                      </>
                    ) : (
                      <>
                        Save Changes
                        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}