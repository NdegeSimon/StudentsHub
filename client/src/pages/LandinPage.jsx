import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
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
  Play
} from 'lucide-react';

const LandingPage = () => {
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
      text: "Studex connected me with my dream job at Safaricom. The platform made applying so easy, and I got my offer within 3 weeks!"
    },
    {
      name: "James Odhiambo",
      role: "Data Analyst at Equity Bank",
      image: "👨🏿‍💼",
      text: "As a fresh graduate, finding opportunities was tough. Studex changed that completely. Highly recommend!"
    },
    {
      name: "Grace Njeri",
      role: "UI/UX Designer at Andela",
      image: "👩🏽‍🎨",
      text: "The internship I found through Studex turned into a full-time role. This platform is a game-changer for students!"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "2,500+", label: "Partner Companies" },
    { number: "15,000+", label: "Jobs Posted" },
    { number: "92%", label: "Success Rate" }
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
  "/logos/google.png",
  "/logos/microsoft.png",
  "/logos/amazon.png",
  "/logos/meta.png",
  "/logos/netflix.png",
  "/logos/safaricom.png",
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
              
              <h1 className=" font-Backsteal text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Land Your Dream
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Student Job or Internship
                </span>
              </h1>
              
              <p className=" font-TimesNewRoman font-bold text-xl text-gray-400 mb-8 leading-relaxed">
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
              <div className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-gray-700">
                <div className="space-y-4">
                  {/* Mock Job Cards */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        🚀
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">Software Engineer Intern</h3>
                        <p className="text-sm text-gray-400">Safaricom PLC • Nairobi</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">React</span>
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">Node.js</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                        💼
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">Data Analyst</h3>
                        <p className="text-sm text-gray-400">Equity Bank • Remote</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs">Python</span>
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs">SQL</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
                        🎨
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">UI/UX Designer</h3>
                        <p className="text-sm text-gray-400">Andela • Hybrid</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-1 bg-pink-600/20 text-pink-300 rounded text-xs">Figma</span>
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">UI/UX</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
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
            <p className=" font-TimesNewRoman text-xl text-gray-400 max-w-2xl mx-auto">
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
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-900/20 to-transparent rounded-full animate-float"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full animate-float animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0, 0, 0, 0) 70%) animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-24 relative z-10" data-aos="fade-up">
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

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {[
              {
                step: "01",
                icon: <GraduationCap className="h-7 w-7" />,
                title: "Create Your Profile",
                description: "Sign up in seconds and build your professional profile with your skills, education, and experience.",
                gradient: "from-purple-600 via-indigo-600 to-blue-600",
                accent: "from-fuchsia-500 to-purple-600"
              },
              {
                step: "02",
                icon: <Search className="h-7 w-7" />,
                title: "Browse Opportunities",
                description: "Explore thousands of student jobs and internships from verified companies across Kenya.",
                gradient: "from-blue-600 via-cyan-500 to-sky-500",
                accent: "from-blue-400 to-cyan-500"
              },
              {
                step: "03",
                icon: <Briefcase className="h-7 w-7" />,
                title: "Apply & Get Hired",
                description: "Apply with one click, track your applications, and land your dream opportunity.",
                gradient: "from-indigo-600 via-purple-600 to-fuchsia-600",
                accent: "from-violet-500 to-purple-600"
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                {/* Connection Arrow */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <ChevronRight className="relative z-10 h-10 w-10 text-white/90 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                )}

                <div className="h-full bg-gradient-to-br from-gray-800/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-purple-500/10 relative overflow-hidden">
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                  
                  {/* Step Number */}
                  <div className="relative z-10">
                    <div className="text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-900 group-hover:opacity-20 group-hover:scale-110 transform transition-all duration-500">
                      {step.step}
                    </div>
                    
                    {/* Animated highlight */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
                      <div className={`absolute -inset-1 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Icon Container */}
                  <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br ${step.gradient} rounded-2xl shadow-xl group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500`}>
                    <div className="absolute inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    {React.cloneElement(step.icon, {
                      className: `${step.icon.props.className} text-white/90 group-hover:text-white transition-colors duration-300 relative z-10`
                    })}
                    <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-bold text-white/90 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
                      {step.title}
                    </h3>
                    <p className="text-gray-300/80 group-hover:text-gray-200 leading-relaxed transition-colors duration-500">
                      {step.description}
                    </p>
                    
                    {/* Animated Button */}
                    <div className="pt-4">
                      <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors duration-300 cursor-pointer">
                        <span>Learn more</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500 delay-100"></div>
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-500 -z-10">
                    <div className="w-full h-full bg-gray-800/80 rounded-3xl"></div>
                  </div>
                </div>
                
                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-5 -z-20 transition-opacity duration-700 blur-xl`}></div>
              </div>
            ))}
          </div>
        </div>
        
          {/* CTA Section */}
          <div className="mt-20 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%) animate-pulse-slow"></div>
            </div>
            
            <div className="text-center" data-aos="fade-up" data-aos-delay="450">
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
                    {/* Animated border */}
                    <span className="absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Trusted by text */}
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
      </section>

```
     {/* Companies Section */}
<section id="companies" className="py-20 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Trusted by Leading Companies
      </h2>
      <p className="text-gray-400">
        Join thousands of students working with top employers
      </p>
    </div>

    <div className="relative">
      <div className="flex gap-12 animate-marquee">
        {[...companies, ...companies].map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center min-w-[180px]"
          >
            <img
              src={logo}
              alt="Company logo"
              className="h-12 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400">Hear from students who landed their dream jobs</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12">
              <div className="text-6xl mb-6">💬</div>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{testimonials[activeTestimonial].image}</div>
                <div>
                  <div className="font-semibold text-white">{testimonials[activeTestimonial].name}</div>
                  <div className="text-gray-400">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'w-8 bg-purple-600' : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
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
      <footer className="bg-gray-800/50 border-t border-gray-700 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Studex
              </h3>
              <p className="text-gray-400 text-sm">
                Connecting Kenyan students with career opportunities since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">For Companies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Studex. All rights reserved. Made with ❤️ in Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;