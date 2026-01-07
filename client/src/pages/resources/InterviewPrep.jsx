import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Mic, Clock, BookOpen, Video, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const InterviewPrep = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('common');
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  const commonQuestions = [
    {
      id: 1,
      question: 'Tell me about yourself.',
      tips: [
        'Keep it concise (2-3 minutes)',
        'Focus on relevant experience',
        'Mention key achievements',
        'Relate to the position'
      ]
    },
    {
      id: 2,
      question: 'Why do you want to work here?',
      tips: [
        'Research the company',
        'Connect your values to theirs',
        'Mention specific projects or achievements',
        'Show enthusiasm'
      ]
    },
    {
      id: 3,
      question: 'What are your strengths and weaknesses?',
      tips: [
        'Be honest but strategic',
        'Use the STAR method for examples',
        'Show self-awareness',
        'Mention how you work on weaknesses'
      ]
    },
    {
      id: 4,
      question: 'Where do you see yourself in 5 years?',
      tips: [
        'Show ambition but be realistic',
        'Connect to the company',
        'Focus on growth and learning',
        'Be flexible'
      ]
    },
    {
      id: 5,
      question: 'Why should we hire you?',
      tips: [
        'Highlight unique skills',
        'Match your experience to the job',
        'Show enthusiasm',
        'Be confident but not arrogant'
      ]
    }
  ];

  const technicalQuestions = [
    {
      id: 6,
      question: 'Explain a technical challenge you faced and how you solved it.',
      tips: [
        'Use the STAR method',
        'Be specific about the technology',
        'Explain your thought process',
        'Highlight the result'
      ]
    },
    {
      id: 7,
      question: 'How do you stay updated with the latest technologies?',
      tips: [
        'Mention blogs, podcasts, or courses',
        'Talk about personal projects',
        'Mention professional networks',
        'Show continuous learning'
      ]
    }
  ];

  const behavioralQuestions = [
    {
      id: 8,
      question: 'Tell me about a time you worked in a team.',
      tips: [
        'Use the STAR method',
        'Show collaboration',
        'Mention conflict resolution',
        'Highlight your role'
      ]
    },
    {
      id: 9,
      question: 'Describe a time you failed and what you learned.',
      tips: [
        'Be honest but positive',
        'Focus on the learning',
        'Show growth',
        'Keep it professional'
      ]
    }
  ];

  const toggleQuestionComplete = (id) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedQuestions(newCompleted);
  };

  const getQuestions = () => {
    switch (activeTab) {
      case 'technical':
        return technicalQuestions;
      case 'behavioral':
        return behavioralQuestions;
      default:
        return commonQuestions;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Interview Preparation</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 p-1 bg-gray-800 rounded-lg">
          {[
            { id: 'common', label: 'Common Questions' },
            { id: 'technical', label: 'Technical' },
            { id: 'behavioral', label: 'Behavioral' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-900/30 mr-3">
                <Mic className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Questions</p>
                <p className="text-xl font-semibold">
                  {commonQuestions.length + technicalQuestions.length + behavioralQuestions.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-900/30 mr-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-semibold">
                  {completedQuestions.size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Time to Prepare</p>
                <p className="text-xl font-semibold">
                  {Math.ceil((commonQuestions.length + technicalQuestions.length + behavioralQuestions.length) * 2.5)} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {getQuestions().map((item) => (
            <div 
              key={item.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.question}</h3>
                    <div className="mt-2">
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">TIPS:</h4>
                      <ul className="space-y-1">
                        {item.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span className="text-sm text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleQuestionComplete(item.id)}
                    className={`ml-4 p-2 rounded-full ${
                      completedQuestions.has(item.id)
                        ? 'text-green-500 hover:text-green-400'
                        : 'text-gray-500 hover:text-gray-400'
                    }`}
                    aria-label={completedQuestions.has(item.id) ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {completedQuestions.has(item.id) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 opacity-50" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                  <Video className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Video Interview Tips</h3>
                  <p className="text-sm text-gray-400">Watch our guide to ace your video interviews</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-gray-500" />
              </div>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-900/30 mr-3">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Common Interview Questions</h3>
                  <p className="text-sm text-gray-400">Practice with our question bank</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-gray-500" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
