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
  ArrowLeft,
  Cpu,
  Code,
  Database,
  Globe,
  Rocket,
  Target,
  Sparkles,
  Lock,
  Bolt,
  TrendingUp as ChartUp,
  Cpu as CpuIcon,
  ShieldCheck
} from 'lucide-react';

const LandingPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
      icon: <Cpu className="h-6 w-6" />,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match you with opportunities that perfectly align with your skills and career goals."
    },
    {
      icon: <Bolt className="h-6 w-6" />,
      title: "Instant Applications",
      description: "One-click applications with smart autofill. Apply to multiple positions in seconds."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Verified Ecosystem",
      description: "Enterprise-grade verification for all companies. Your security is our priority."
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Career Acceleration",
      description: "Premium resources, mentorship programs, and skill development pathways."
    }
  ];

  const techStack = [
    { name: "React", color: "text-cyan-400" },
    { name: "Node.js", color: "text-green-400" },
    { name: "Python", color: "text-yellow-400" },
    { name: "AWS", color: "text-orange-400" },
    { name: "Docker", color: "text-blue-400" },
    { name: "PostgreSQL", color: "text-purple-400" },
    { name: "Redis", color: "text-red-400" },
    { name: "Kubernetes", color: "text-indigo-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-purple-500/10 via-pink-500/5 to-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, #4a5568 1px, transparent 1px),
                           linear-gradient(to bottom, #4a5568 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Navigation */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
        <div className={`relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl shadow-2xl shadow-black/50 transition-all duration-500 ${
          isScrolled ? 'shadow-cyan-500/20' : ''
        }`}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-4xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* LOGO */}
          <div className="relative flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg flex items-center justify-center">
               <img 
               src="/logo-icon.png" 
               alt="Student Hub Logo"
               className="h-6 w-6"
      />
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tighter">
              STUDENT HUB
            </span>
            
          </div>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-8 font-medium">
            {[
              { name: "AI Jobs", icon: <Cpu className="h-4 w-4 font-bold" /> },
              { name: "Tech Roles", icon: <Code className="h-4 w-4 font-bold" /> },
              { name: "Data Science", icon: <Database className="h-4 w-4" /> },
              { name: "Remote", icon: <Globe className="h-4 w-4" /> },
              { name: "Internships", icon: <GraduationCap className="h-4 w-4" /> },
            ].map((item) => (
              <a
                key={item.name}
                href="#jobs"
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </span>
                <span className="text-sm font-medium tracking-wide">{item.name}</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"></div>
              </a>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <a 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors hover:scale-105"
            >
              Sign In
            </a>
            <a 
              href="/signup"
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <button className="relative px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-bold rounded-xl border border-gray-800 group-hover:border-cyan-500/50 transition-all duration-300">
                <span className="flex items-center gap-2">
                  
                  GET STARTED
                  
                </span>
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {/* Tech Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {techStack.slice(0, 4).map((tech, index) => (
                  <span 
                    key={tech.name}
                    className={`px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full text-sm font-medium ${tech.color} transition-all duration-300 hover:scale-105 hover:border-cyan-500/50`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block text-gray-400">BUILD YOUR</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    TECH CAREER
                  </span>
                  <span className="block text-gray-300">WITH AI-POWERED MATCHING</span>
                </h1>

                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                  The next-generation platform connecting elite tech talent with cutting-edge companies. 
                  Powered by machine learning and designed for speed.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="/signup"
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <button className="relative px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl border border-gray-800 group-hover:border-cyan-500 transition-all duration-300 text-lg flex items-center justify-center gap-3">
                    <span>START BUILDING</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>

                <a 
                  href="#demo"
                  className="group px-8 py-4 border border-gray-800 rounded-xl font-medium hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                  <Play className="h-5 w-5 text-cyan-400" />
                  <span>WATCH DEMO</span>
                </a>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: "50K+", label: "Developers" },
                  { value: "95%", label: "Match Rate" },
                  { value: "3.2s", label: "Avg. Response" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visualization */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-950/80 to-black/80 rounded-3xl p-8 backdrop-blur-xl border border-gray-800 shadow-2xl">
                {/* Circuit Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0,20 Q10,0 20,20 T40,20" stroke="#06b6d4" strokeWidth="1" fill="none"/>
                        <path d="M20,0 Q30,20 20,40 T20,0" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit)"/>
                  </svg>
                </div>

                {/* 3D Card Effect */}
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-md"></div>
                        <Cpu className="relative h-6 w-6 text-cyan-400" />
                      </div>
                      <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        LIVE OPPORTUNITIES
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>

                  {/* Job Cards */}
                  {[
                    {
                      title: "Senior AI Engineer",
                      company: "OpenAI",
                      location: "Remote",
                      salary: "$180k-$250k",
                      tags: ["TensorFlow", "PyTorch", "LLM"],
                      color: "from-cyan-500 to-blue-500"
                    },
                    {
                      title: "Cloud Architect",
                      company: "AWS",
                      location: "Nairobi",
                      salary: "$150k-$200k",
                      tags: ["AWS", "Kubernetes", "Terraform"],
                      color: "from-blue-500 to-purple-500"
                    },
                    {
                      title: "Blockchain Dev",
                      company: "Coinbase",
                      location: "Remote",
                      salary: "$160k-$220k",
                      tags: ["Solidity", "EVM", "Web3"],
                      color: "from-purple-500 to-pink-500"
                    }
                  ].map((job, index) => (
                    <div 
                      key={index}
                      className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                    >
                      {/* Animated Gradient Border */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${job.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      <div className="relative flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center text-white font-bold text-lg`}>
                              {job.company.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
                                {job.title}
                              </h4>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-cyan-400">{job.company}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-400">{job.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1 bg-gray-900/80 text-gray-300 rounded-full text-xs font-medium border border-gray-800 hover:border-cyan-500/50 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs font-bold">
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        
                        <button className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* View All Button */}
                  <div className="text-center pt-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl text-cyan-400 font-medium hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group">
                      <span className="flex items-center justify-center gap-2">
                        VIEW 500+ JOBS
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <span className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Platform Metrics</span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-gray-400">BUILT FOR</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                SCALE & SPEED
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: "10K+",
                label: "Monthly Hires",
                description: "Average placements per month",
                icon: <Users className="h-8 w-8" />,
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                value: "500ms",
                label: "Match Speed",
                description: "AI matching algorithm",
                icon: <Zap className="h-8 w-8" />,
                gradient: "from-blue-500 to-purple-500"
              },
              {
                value: "99.9%",
                label: "Uptime",
                description: "Platform reliability",
                icon: <Shield className="h-8 w-8" />,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                value: "4.8/5",
                label: "Rating",
                description: "User satisfaction",
                icon: <Star className="h-8 w-8" />,
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                
                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-500/50">
                  <div className={`absolute top-4 right-4 p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-2xl`}>
                    {React.cloneElement(stat.icon, { className: "h-6 w-6 text-white" })}
                  </div>

                  <div className="space-y-4">
                    <div className={`text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">{stat.label}</h3>
                      <p className="text-sm text-gray-400">{stat.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full animate-progress`}
                      style={{ width: '100%' }}
                    ></div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Cyberpunk Style */}
      <section className="py-32 relative overflow-hidden">
        {/* Circuit Background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#06b6d4" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full mb-6">
              
              <span className="text-sm font-bold text-cyan-300">TECH-ENABLED FEATURES</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="text-gray-400">ENGINEERED FOR</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                TECH TALENT
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-500/50">
                  {/* Feature Icon */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-md opacity-20 group-hover:opacity-40"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                      {React.cloneElement(feature.icon, {
                        className: "h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                      })}
                    </div>
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Bar */}
          <div className="mt-20 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Tech Stack</h3>
              <div className="flex gap-2">
                <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {techStack.map((tech) => (
                <div 
                  key={tech.name}
                  className="px-6 py-3 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <span className={`text-lg font-bold ${tech.color} group-hover:text-white transition-colors`}>
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 lg:p-16 text-center overflow-hidden">
            {/* Animated Border */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-gradient-border"></div>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3">
                <Rocket className="h-8 w-8 text-cyan-400 animate-bounce" />
                <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Ready to Launch</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black">
                <span className="text-gray-400">BUILD YOUR</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TECH FUTURE
                </span>
                <span className="text-gray-400">TODAY</span>
              </h2>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join the platform trusted by elite tech talent and leading companies worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <a 
                  href="/signup"
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <button className="relative px-10 py-5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg rounded-2xl border border-gray-800 group-hover:border-cyan-500 transition-all duration-300">
                    <span className="flex items-center justify-center gap-3">
                      START FOR FREE
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </a>

                <a 
                  href="#enterprise"
                  className="px-10 py-5 border border-gray-800 rounded-2xl font-bold text-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300"
                >
                  ENTERPRISE PLANS
                </a>
              </div>

              <div className="pt-8">
                <div className="inline-flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-400" />
                    <span>Bank-level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bolt className="h-4 w-4 text-yellow-400" />
                    <span>Lightning Fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>No Credit Card</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-border {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-gradient-border {
          animation: gradient-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;