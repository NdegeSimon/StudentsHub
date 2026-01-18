import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { 
  ArrowRight, 
  ArrowUp,
  Briefcase, 
  Users, 
  TrendingUp, 
  Star,
  CheckCircle,
  Search,
  Building2,
  GraduationCap,
  Zap,
  Shield,
  Heart,
  Award,
  ChevronRight,
  Play,
  Quote,
  ArrowLeft
} from 'lucide-react';

const LandingPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sarah Mwangi",
      role: "Software Engineer at Safaricom",
      image: "👩🏾‍💻",
      text: "Studex connected me with my dream job at Safaricom. The platform made applying so easy, and I got my offer within 3 weeks!",
      rating: 5,
      stat: "3 Weeks to Hire",
      achievement: "Dream Job",
      company: "Safaricom PLC"
    },
    {
      name: "James Odhiambo",
      role: "Data Analyst at Equity Bank",
      image: "👨🏿‍💼",
      text: "As a fresh graduate, finding opportunities was tough. Studex changed that completely. Highly recommend!",
      rating: 5,
      stat: "First Job",
      achievement: "Fresh Grad Success",
      company: "Equity Bank"
    },
    {
      name: "Grace Njeri",
      role: "UI/UX Designer at Andela",
      image: "👩🏽‍🎨",
      text: "The internship I found through Studex turned into a full-time role. This platform is a game-changer for students!",
      rating: 5,
      stat: "Intern to Full-time",
      achievement: "Career Growth",
      company: "Andela"
    }
  ];

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Job Matching",
      description: "Our AI-powered algorithm matches you with opportunities that fit your skills and career goals perfectly."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Quick Applications",
      description: "Apply to multiple jobs with one click. No more repetitive form filling."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Companies",
      description: "Every company on our platform is verified. Apply with confidence knowing they're legitimate."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Career Resources",
      description: "Access resume templates, interview tips, and career guidance to boost your success."
    }
  ];

  const companies = [
    "/src/assets/google.png",
    "/src/assets/Microsoft.png",
    "/src/assets/amazon.png",
    "/src/assets/meta.png",
    "/src/assets/safaricom.png",
    "/src/assets/Equity.png",
    "/src/assets/Andela.png",
    "/src/assets/Mkopa.png",
    "/src/assets/twiga.png",
    "/src/assets/flutterwave.png",
    "/src/assets/Ncba.png"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
        <div className={`bg-gray-800 border border-gray-700 rounded-full shadow-lg px-8 py-3 flex items-center gap-6 transition-all duration-300 ${
          isScrolled ? 'shadow-2xl shadow-purple-500/20' : ''
        }`}>

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              studex
            </span>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6 text-[14px] text-gray-300">
            {[
              { name: "ICT Jobs", href: "#jobs" },
              { name: "HR & Admin", href: "#jobs" },
              { name: "Finance", href: "#jobs" },
              { name: "Internships", href: "#jobs" },
              { name: "Part-Time", href: "#jobs" },
              { name: "Remote Jobs", href: "#jobs" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
              >
                {item.name}
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </a>
            ))}
          </nav>

          {/* DIVIDER */}
          <div className="hidden lg:block h-6 w-px bg-gray-600" />

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 text-[14px]">
            <a 
              href="/login" 
              className="text-gray-300 hover:text-white transition px-4 py-1.5"
            >
              Sign In
            </a>
            <a 
              href="/signup"
              className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:opacity-90 font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
              Go Premium
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Trusted by 50,000+ students</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Land Your Dream
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Student Job or Internship
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Connect with top Kenyan companies hiring students and recent graduates. 
                Start your career journey with opportunities tailored just for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition shadow-lg shadow-purple-500/50 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <button className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 rounded-full font-medium hover:bg-gray-800 transition text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  100% free for students
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 backdrop-blur-sm border border-gray-700/50 shadow-2xl shadow-purple-500/10">
                <div className="absolute -top-3 -right-3 w-24 h-24 bg-purple-600/30 rounded-full filter blur-3xl -z-10"></div>
                <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-blue-600/30 rounded-full filter blur-3xl -z-10"></div>
                
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Latest Opportunities</span>
                  <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">New</span>
                </h3>
                
                <div className="space-y-5">
                  {/* Job Card 1 */}
                  <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-start space-x-4">
                      <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-purple-500/20">
                        🚀
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                            Software Engineer Intern
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">Featured</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Safaricom PLC • Nairobi</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-medium">React</span>
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs font-medium">Node.js</span>
                          <span className="px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full text-xs font-medium">TypeScript</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:bg-purple-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Job Card 2 */}
                  <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-start space-x-4">
                      <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-blue-500/20">
                        💼
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                            Data Analyst
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">Remote</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Equity Bank • Remote</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-xs font-medium">Python</span>
                          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-300 rounded-full text-xs font-medium">SQL</span>
                          <span className="px-3 py-1 bg-red-500/10 text-red-300 rounded-full text-xs font-medium">Tableau</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Job Card 3 */}
                  <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-start space-x-4">
                      <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-pink-500/20">
                        🎨
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-rose-400 transition-all">
                            UI/UX Designer
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-pink-500/10 text-pink-400 rounded-full">Hybrid</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Andela • Hybrid</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full text-xs font-medium">Figma</span>
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-medium">UI/UX</span>
                          <span className="px-3 py-1 bg-orange-500/10 text-orange-300 rounded-full text-xs font-medium">Prototyping</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:bg-pink-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    View All Opportunities
                    <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Animated Background with Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <span className="text-sm font-medium text-purple-300">Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join the fastest-growing student job platform in Kenya
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                number: "10,000+",
                label: "Active Students",
                gradient: "from-purple-600 to-pink-600",
              },
              {
                number: "500+",
                label: "Partner Companies",
                gradient: "from-blue-600 to-cyan-600",
              },
              {
                number: "5,000+",
                label: "Jobs Posted",
                gradient: "from-indigo-600 to-purple-600",
              },
              {
                number: "95%",
                label: "Success Rate",
                gradient: "from-green-600 to-emerald-600",
              }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-all duration-500`}></div>
                
                <div className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2`}>
                  <div className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500/90 to-emerald-500/90 rounded-full shadow-lg">
                    <ArrowUp className="h-3 w-3 text-white" />
                    <span className="text-xs font-bold text-white">+25%</span>
                  </div>

                  <div className={`inline-flex mb-6 p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>

                  <div className="mb-2">
                    <div className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.number}
                    </div>
                    <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                      <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full animate-progress`} style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="text-base md:text-lg text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>

                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                    <div className={`w-full h-full bg-gradient-to-tl ${stat.gradient} rounded-tl-full rounded-br-3xl`}></div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-3xl backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
              <CheckCircle className="h-12 w-12 text-purple-400" />
              <p className="text-lg text-gray-300 max-w-md">
                Be part of Kenya's most trusted platform for student opportunities
              </p>
              <a 
                href="#signup" 
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Join Today
                <ArrowUp className="h-5 w-5 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Launch Your Career
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help students find opportunities and companies find talent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition group"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-28 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center mb-6 relative group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></span>
              <span className="relative z-10 px-6 py-2.5 text-sm font-semibold text-purple-200 bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <span className="relative flex h-2 w-2 mr-2 inline-block">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Simple & Effective
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start your journey to career success in just <span className="text-purple-300 font-medium">3 simple steps</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: <GraduationCap className="h-7 w-7" />,
                title: "Create Your Profile",
                description: "Sign up in seconds and build your professional profile with your skills, education, and experience.",
                gradient: "from-purple-600 via-indigo-600 to-blue-600",
              },
              {
                step: "02",
                icon: <Search className="h-7 w-7" />,
                title: "Browse Opportunities",
                description: "Explore thousands of student jobs and internships from verified companies across Kenya.",
                gradient: "from-blue-600 via-cyan-500 to-sky-500",
              },
              {
                step: "03",
                icon: <Briefcase className="h-7 w-7" />,
                title: "Apply & Get Hired",
                description: "Apply with one click, track your applications, and land your dream opportunity.",
                gradient: "from-indigo-600 via-purple-600 to-fuchsia-600",
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <ChevronRight className="relative z-10 h-10 w-10 text-white/90 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                )}

                <div className="h-full bg-gradient-to-br from-gray-800/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-purple-500/10 relative overflow-hidden">
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-900 group-hover:opacity-20 group-hover:scale-110 transform transition-all duration-500">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br ${step.gradient} rounded-2xl shadow-xl group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500`}>
                    <div className="absolute inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    {React.cloneElement(step.icon, {
                      className: `${step.icon.props.className} text-white/90 group-hover:text-white transition-colors duration-300 relative z-10`
                    })}
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold text-white/90 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
                      {step.title}
                    </h3>
                    <p className="text-gray-300/80 group-hover:text-gray-200 leading-relaxed transition-colors duration-500">
                      {step.description}
                    </p>
                    
                    <div className="pt-4">
                      <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors duration-300 cursor-pointer">
                        <span>Learn more</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-8 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button className="relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center mx-auto group/button">
                    <span className="relative z-10 flex items-center">
                      Get Started Now
                      <span className="ml-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover/button:bg-white/30 transition-colors duration-300">
                        <ArrowRight className="h-4 w-4 text-white group-hover/button:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col items-center">
                <div className="flex -space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-gray-800 overflow-hidden bg-gray-700" style={{ zIndex: 5 - i }}>
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400"></div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Trusted by <span className="text-purple-300 font-medium">10,000+</span> students and <span className="text-blue-300 font-medium">500+</span> companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-24 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-300 font-bold text-lg">
              Join thousands of students working with top employers
            </p>
          </div>

          <div className="relative py-8">
            <div className="flex gap-16 animate-marquee">
              {[...companies, ...companies].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-w-[220px] px-6 py-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/70 transition-all duration-300"
                >
                  <img
                    src={logo}
                    alt="Company logo"
                    className="h-16 w-auto object-contain grayscale brightness-0 invert opacity-70 hover:opacity-100 hover:grayscale-0 hover:brightness-100 hover:invert-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3ECompany%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Join <span className="text-purple-400 font-semibold">10,000+ students</span> who landed their dream jobs
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-2xl opacity-50"></div>
              
              <div className={`relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 lg:p-16 transition-all duration-500 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                
                <div className="absolute top-8 left-8 opacity-10">
                  <Quote className="h-24 w-24 text-purple-400" />
                </div>

                <div className="flex gap-1 mb-6 justify-center md:justify-start relative z-10">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <div className="relative z-10 mb-8">
                  <Quote className="h-12 w-12 text-purple-500/30 mb-4" />
                  <p className="text-2xl md:text-3xl lg:text-4xl text-gray-100 leading-relaxed font-medium italic">
                    {testimonials[activeTestimonial].text}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-600 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl">
                      {testimonials[activeTestimonial].image}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-2xl font-bold text-white mb-2">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-lg text-purple-400 mb-4">{testimonials[activeTestimonial].role}</p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">{testimonials[activeTestimonial].stat}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">{testimonials[activeTestimonial].achievement}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                        <Award className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-300">{testimonials[activeTestimonial].company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                  setIsAnimating(false);
                }, 300);
              }}
              className="group p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveTestimonial(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeTestimonial 
                      ? 'w-12 h-3 bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
                  setIsAnimating(false);
                }, 300);
              }}
              className="group p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            {[
              { value: "10K+", label: "Students Hired" },
              { value: "500+", label: "Partner Companies" },
              { value: "95%", label: "Success Rate" },
              { value: "4.9/5", label: "Average Rating" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 50,000+ students who are already building their future with Studex
            </p>
            <a 
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-full font-medium hover:bg-gray-100 transition text-lg shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;