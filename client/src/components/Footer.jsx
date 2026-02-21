import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Award,
  Shield,
  Heart
} from 'lucide-react';


import safaricom from '../assets/safaricom.png';
import equity from '../assets/Equity.png';  // Make sure this file exists
import kcb from '../assets/Kcb.jpg';        // Make sure this file exists
import andela from '../assets/Andela.png';
import mkopa from '../assets/Mkopa.png';
import twiga from '../assets/twiga.png';
import flutterwave from '../assets/flutterwave.png';
import ncba from '../assets/Ncba.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Internships', href: '/internships' },
      { name: 'Companies', href: '/companies' },
      { name: 'Career Advice', href: '/advice' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Mobile App', href: '/app' }
    ],
    forJobSeekers: [
      { name: 'Create Profile', href: '/signup' },
      { name: 'Upload Resume', href: '/resume' },
      { name: 'Job Alerts', href: '/alerts' },
      { name: 'Career Resources', href: '/resources' },
      { name: 'Interview Prep', href: '/interview-prep' },
      { name: 'Salary Guide', href: '/salary' }
    ],
    forEmployers: [
      { name: 'Post a Job', href: '/post-job' },
      { name: 'Pricing Plans', href: '/pricing' },
      { name: 'Employer Dashboard', href: '/employer/dashboard' },
      { name: 'Recruitment Tips', href: '/recruitment' },
      { name: 'Campus Hiring', href: '/campus' },
      { name: 'Advertise', href: '/advertise' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
      { name: 'Partner With Us', href: '/partner' },
      { name: 'Blog', href: '/blog' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Data Protection', href: '/data-protection' },
      { name: 'Accessibility', href: '/accessibility' }
    ]
  };

  const partners = [
    { 
      name: 'Safaricom', 
      logo: safaricom  // Use imported variable, not string path
    },
    { 
      name: 'Equity Bank', 
      logo: equity  // Make sure this file exists in assets
    },
    { 
      name: 'KCB Group', 
      logo: kcb  // Make sure this file exists in assets
    },
    { 
      name: 'Andela', 
      logo: andela
    },
    { 
      name: 'M-KOPA', 
      logo: mkopa
    },
    { 
      name: 'Twiga Foods', 
      logo: twiga
    },
    { 
      name: 'Flutterwave', 
      logo: flutterwave
    },
    { 
      name: 'NCBA', 
      logo: ncba
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 mb-12 border border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated with Latest Opportunities
            </h3>
            <p className="text-gray-400 mb-6">
              Get job alerts, career tips, and exclusive content delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-12">
          <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
            Trusted By Leading Companies
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center hover:border-purple-500/50 transition-all cursor-pointer group h-24"
              >
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    onError={(e) => {
                      console.log('Failed to load partner logo:', partner.name, partner.logo);
                      e.target.style.border = '2px solid red';
                      e.target.src = ''; // Clear src to show fallback
                    }}
                    className="h-full w-auto object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                    {partner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              {footerLinks.forJobSeekers.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2">
              {footerLinks.forEmployers.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <a href="tel:+254700000000" className="hover:text-purple-400 transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <a href="mailto:hello@studex.co.ke" className="hover:text-purple-400 transition-colors">
                  hello@studex.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5 text-green-400" />
            <span>Verified Companies</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-5 w-5 text-yellow-400" />
            <span>Award Winning Platform</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-5 w-5 text-red-400" />
            <span>50,000+ Students Trust Us</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Studex
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            © {currentYear} Studex. All rights reserved. Made with ❤️ in Kenya
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;