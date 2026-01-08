import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, BookOpen, TrendingUp, Users, FileText, Target, Award, Briefcase, Search, Filter, ChevronRight, Clock, Star, ThumbsUp, ArrowLeft } from 'lucide-react';

export default function CareerTipsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Tips', icon: Lightbulb },
    { id: 'resume', name: 'Resume & CV', icon: FileText },
    { id: 'interview', name: 'Interview Prep', icon: Users },
    { id: 'jobsearch', name: 'Job Search', icon: Search },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'skills', name: 'Skills Development', icon: Award },
    { id: 'career', name: 'Career Growth', icon: TrendingUp }
  ];

  const tips = [
    {
      id: 1,
      category: 'resume',
      title: 'Tailor Your Resume for Each Application',
      description: 'Customize your resume to match the job description. Use keywords from the posting and highlight relevant experience that aligns with the role requirements.',
      readTime: '5 min',
      difficulty: 'Beginner',
      likes: 234,
      tags: ['Resume Writing', 'Job Application', 'ATS'],
      detailedContent: [
        'Read the job description carefully and identify key requirements',
        'Mirror the language and keywords used in the posting',
        'Quantify your achievements with specific numbers and results',
        'Remove irrelevant experience that doesn\'t support your application',
        'Use action verbs to describe your responsibilities'
      ]
    },
    {
      id: 2,
      category: 'interview',
      title: 'Master the STAR Method for Behavioral Questions',
      description: 'Structure your interview answers using Situation, Task, Action, and Result. This framework helps you provide clear, compelling examples of your experience.',
      readTime: '7 min',
      difficulty: 'Intermediate',
      likes: 567,
      tags: ['Interview Skills', 'Communication', 'Behavioral Questions'],
      detailedContent: [
        'Situation: Set the context for your story',
        'Task: Describe the challenge or responsibility',
        'Action: Explain the specific steps you took',
        'Result: Share the outcomes and what you learned',
        'Practice 5-7 stories that demonstrate different competencies'
      ]
    },
    {
      id: 3,
      category: 'jobsearch',
      title: 'Leverage Job Boards Beyond the Basics',
      description: 'Don\'t just apply on mainstream platforms. Explore niche job boards, company career pages, and industry-specific sites to find hidden opportunities.',
      readTime: '6 min',
      difficulty: 'Beginner',
      likes: 189,
      tags: ['Job Search', 'Strategy', 'Career Planning'],
      detailedContent: [
        'Research industry-specific job boards in your field',
        'Set up job alerts with specific criteria',
        'Check company websites directly for unlisted positions',
        'Use LinkedIn\'s "Easy Apply" feature strategically',
        'Track your applications in a spreadsheet'
      ]
    },
    {
      id: 4,
      category: 'networking',
      title: 'Build Meaningful Professional Relationships',
      description: 'Networking isn\'t about collecting contacts. Focus on building genuine relationships by offering value, staying in touch, and being authentic.',
      readTime: '8 min',
      difficulty: 'Intermediate',
      likes: 421,
      tags: ['Networking', 'Professional Growth', 'Career Development'],
      detailedContent: [
        'Attend industry events and conferences regularly',
        'Follow up within 24-48 hours after meeting someone',
        'Offer help before asking for favors',
        'Share relevant articles or opportunities with your network',
        'Schedule regular coffee chats with key contacts'
      ]
    },
    {
      id: 5,
      category: 'skills',
      title: 'Develop In-Demand Technical Skills',
      description: 'Stay competitive by continuously learning new skills. Focus on both technical abilities and soft skills that employers value most.',
      readTime: '10 min',
      difficulty: 'Advanced',
      likes: 712,
      tags: ['Skill Development', 'Learning', 'Professional Growth'],
      detailedContent: [
        'Identify skills gaps in your target role',
        'Use online platforms like Coursera, Udemy, or LinkedIn Learning',
        'Work on real projects to apply new knowledge',
        'Earn certifications to validate your expertise',
        'Share your learning journey on LinkedIn'
      ]
    },
    {
      id: 6,
      category: 'career',
      title: 'Negotiate Your Salary with Confidence',
      description: 'Research market rates, know your worth, and practice negotiation strategies. Most employers expect candidates to negotiate and respect those who do.',
      readTime: '9 min',
      difficulty: 'Advanced',
      likes: 893,
      tags: ['Salary Negotiation', 'Career Advancement', 'Compensation'],
      detailedContent: [
        'Research salary ranges using Glassdoor, Payscale, and LinkedIn',
        'Consider the total compensation package, not just base salary',
        'Wait for the offer before discussing specific numbers',
        'Practice your negotiation pitch with a friend',
        'Be prepared to walk away if the offer doesn\'t meet your needs'
      ]
    },
    {
      id: 7,
      category: 'resume',
      title: 'Optimize Your Resume for ATS Systems',
      description: 'Many companies use Applicant Tracking Systems to filter resumes. Learn how to format and keyword-optimize your resume to pass these automated screenings.',
      readTime: '6 min',
      difficulty: 'Intermediate',
      likes: 445,
      tags: ['ATS', 'Resume', 'Job Application'],
      detailedContent: [
        'Use standard section headings (Experience, Education, Skills)',
        'Avoid tables, text boxes, and complex formatting',
        'Include relevant keywords from the job description',
        'Save your resume as a .docx or PDF file',
        'Use a simple, clean font like Arial or Calibri'
      ]
    },
    {
      id: 8,
      category: 'interview',
      title: 'Prepare Thoughtful Questions for Interviewers',
      description: 'Asking intelligent questions shows genuine interest and helps you evaluate if the role is right for you. Prepare 5-7 questions in advance.',
      readTime: '5 min',
      difficulty: 'Beginner',
      likes: 312,
      tags: ['Interview', 'Questions', 'Job Fit'],
      detailedContent: [
        'Ask about day-to-day responsibilities and expectations',
        'Inquire about team dynamics and company culture',
        'Discuss growth opportunities and career progression',
        'Learn about challenges the team is currently facing',
        'Ask what success looks like in the first 90 days'
      ]
    },
    {
      id: 9,
      category: 'networking',
      title: 'Master LinkedIn for Professional Networking',
      description: 'LinkedIn is a powerful tool for career growth. Learn how to optimize your profile, engage with content, and build meaningful connections.',
      readTime: '8 min',
      difficulty: 'Beginner',
      likes: 678,
      tags: ['LinkedIn', 'Social Media', 'Personal Branding'],
      detailedContent: [
        'Write a compelling headline that goes beyond your job title',
        'Craft a summary that tells your professional story',
        'Request recommendations from colleagues and managers',
        'Share industry insights and engage with others\' posts',
        'Join relevant groups and participate in discussions'
      ]
    },
    {
      id: 10,
      category: 'career',
      title: 'Create a Personal Development Plan',
      description: 'Take control of your career trajectory by setting clear goals and creating a roadmap for achieving them. Review and adjust quarterly.',
      readTime: '10 min',
      difficulty: 'Intermediate',
      likes: 534,
      tags: ['Career Planning', 'Goal Setting', 'Professional Development'],
      detailedContent: [
        'Define your 1, 3, and 5-year career goals',
        'Identify skills and experiences needed to reach your goals',
        'Set specific, measurable milestones',
        'Schedule regular check-ins with yourself or a mentor',
        'Celebrate small wins along the way'
      ]
    },
    {
      id: 11,
      category: 'jobsearch',
      title: 'Follow Up Effectively After Applications',
      description: 'Strategic follow-ups can help your application stand out. Learn when and how to reach out without being pushy or annoying.',
      readTime: '5 min',
      difficulty: 'Beginner',
      likes: 267,
      tags: ['Follow-up', 'Communication', 'Job Search'],
      detailedContent: [
        'Wait 1-2 weeks after applying before following up',
        'Find the hiring manager on LinkedIn and send a personalized message',
        'Keep your follow-up brief and professional',
        'Reiterate your interest and highlight 1-2 key qualifications',
        'Ask about next steps and timeline'
      ]
    },
    {
      id: 12,
      category: 'skills',
      title: 'Build a Portfolio to Showcase Your Work',
      description: 'Whether you\'re in design, development, writing, or marketing, a portfolio demonstrates your capabilities better than any resume can.',
      readTime: '12 min',
      difficulty: 'Intermediate',
      likes: 821,
      tags: ['Portfolio', 'Personal Branding', 'Career Assets'],
      detailedContent: [
        'Choose 5-8 of your best projects to feature',
        'For each project, explain the problem, your approach, and results',
        'Use visuals, screenshots, or demos when possible',
        'Keep your portfolio updated with recent work',
        'Make it easy to navigate and mobile-friendly'
      ]
    }
  ];

  const [selectedTip, setSelectedTip] = useState(null);

  const filteredTips = tips.filter(tip => {
    const matchesCategory = activeCategory === 'all' || tip.category === activeCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-900 text-green-300';
      case 'Intermediate': return 'bg-yellow-900 text-yellow-300';
      case 'Advanced': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  if (selectedTip) {
    const tip = tips.find(t => t.id === selectedTip);
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => setSelectedTip(null)}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
            Back to all tips
          </button>

          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                    {tip.difficulty}
                  </span>
                  <span className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {tip.readTime}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">{tip.title}</h1>
                <p className="text-lg text-gray-300 mb-6">{tip.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-700">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400">
                <ThumbsUp className="w-5 h-5" />
                <span>{tip.likes} likes</span>
              </button>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-white mb-4">Key Points</h2>
              <ul className="space-y-3">
                {tip.detailedContent.map((point, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <ChevronRight className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                Pro Tip
              </h3>
              <p className="text-gray-300">
                Practice makes perfect! Try implementing these strategies immediately and track your progress. 
                Even small improvements can make a significant difference in your career journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <Link 
        to="/resources" 
        className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Resources
      </Link>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Career Tips & Advice</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Expert guidance to help you navigate your career journey, from landing your first job to advancing in your field.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search career tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredTips.length}</span> tips
          </p>
        </div>

        {/* Tips Grid */}
        {filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all cursor-pointer group"
                onClick={() => setSelectedTip(tip.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                      {tip.difficulty}
                    </span>
                    <span className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {tip.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {tip.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {tip.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tip.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {tip.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        +{tip.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{tip.likes}</span>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                      <span>Read More</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tips found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Featured Resources */}
        <div className="mt-12 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <Target className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Career Coaching</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get personalized guidance from experienced career coaches.
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Learn More →
              </button>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <BookOpen className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Resume Templates</h3>
              <p className="text-gray-300 text-sm mb-4">
                Download professionally designed resume templates.
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Browse Templates →
              </button>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <Users className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Mentorship Program</h3>
              <p className="text-gray-300 text-sm mb-4">
                Connect with industry professionals for guidance.
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Find a Mentor →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}