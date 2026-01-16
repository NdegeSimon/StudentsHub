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
    "Safaricom", "Equity Bank", "KCB", "Andela", "M-KOPA", "Twiga Foods", "Flutterwave", "NCBA"
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
              { name: "Procurement", href: "#jobs" },
              { name: "Engineering", href: "#jobs" },
              { name: "Marketing", href: "#jobs" },
              { name: "Sales", href: "#jobs" },
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
              <div className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-gray-700">
                <div className="space-y-4">
                  {/* Mock Job Cards */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        🚀
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">Software Engineer Intern</h3>
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
                        <h3 className="font-semibold text-white">Data Analyst</h3>
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
                        <h3 className="font-semibold text-white">UI/UX Designer</h3>
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
      <section id="how-it-works" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Create Your Profile",
                description: "Sign up in seconds and build your professional profile with your skills, education, and experience."
              },
              {
                step: "02",
                icon: <Search className="h-8 w-8" />,
                title: "Browse Opportunities",
                description: "Explore thousands of student jobs and internships from verified companies across Kenya."
              },
              {
                step: "03",
                icon: <Briefcase className="h-8 w-8" />,
                title: "Apply & Get Hired",
                description: "Apply with one click, track your applications, and land your dream opportunity."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition">
                  <div className="text-6xl font-bold text-purple-600/20 mb-4">{step.step}</div>
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 text-white">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-purple-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-400">Join thousands of students working with top employers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companies.map((company, index) => (
              <div 
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center justify-center hover:border-purple-500/50 transition cursor-pointer"
              >
                <span className="text-lg font-semibold text-gray-300">{company}</span>
              </div>
            ))}
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