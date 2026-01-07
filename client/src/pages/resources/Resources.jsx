import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, TrendingUp, ChevronRight } from 'lucide-react';

const resources = [
  {
    id: 'interview',
    title: 'Interview Prep',
    description: 'Practice common questions and improve your interview skills',
    icon: Mic,
    iconColor: 'purple',
    path: '/interview-prep'
  },
  {
    id: 'resume',
    title: 'Resume Builder',
    description: 'Create an ATS-friendly resume that stands out',
    icon: FileText,
    iconColor: 'blue',
    path: '/resume-builder'
  },
  {
    id: 'career',
    title: 'Career Tips',
    description: 'Get expert advice to boost your job search',
    icon: TrendingUp,
    iconColor: 'green',
    path: '/career-tips'
  }
];

const Resources = () => {
  const colorVariants = {
    purple: 'bg-purple-900/30 text-purple-400',
    blue: 'bg-blue-900/30 text-blue-400',
    green: 'bg-green-900/30 text-green-400'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resources</h1>
          <p className="text-gray-400">
            Access tools and guides to help you in your job search journey
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              to={resource.path}
              className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors group"
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-full ${colorVariants[resource.iconColor]} mb-4`}>
                  <resource.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              <p className="text-gray-400 mb-4">{resource.description}</p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span>Get started</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
