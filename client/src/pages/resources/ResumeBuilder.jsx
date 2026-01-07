import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Plus, X, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [{
      id: Date.now(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      id: Date.now() + 1,
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const updatedItems = [...resume[section]];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      setResume(prev => ({ ...prev, [section]: updatedItems }));
    } else {
      setResume(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const addSectionItem = (section) => {
    const newItem = section === 'experience' ? {
      id: Date.now(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    } : section === 'education' ? {
      id: Date.now(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    } : '';

    setResume(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    const updatedItems = resume[section].filter((_, i) => i !== index);
    setResume(prev => ({
      ...prev,
      [section]: updatedItems
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setResume(prev => ({
        ...prev,
        skills: [...prev.skills, { id: Date.now(), name: newSkill.trim() }]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (id) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Here you would typically make an API call to save the resume
      console.log('Saving resume:', resume);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    // This would be implemented with a PDF generation library
    toast.info('This would generate and download a PDF of your resume');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/resources"
            className="p-2 rounded-full hover:bg-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-gray-400">Create a professional resume that stands out</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'personal' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              <span>Personal Info</span>
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'experience' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              <span>Experience</span>
              {resume.experience.length > 0 && (
                <span className="ml-auto bg-gray-700 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {resume.experience.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'education' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-3" />
              <span>Education</span>
              {resume.education.length > 0 && (
                <span className="ml-auto bg-gray-700 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {resume.education.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'skills' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Award className="h-5 w-5 mr-3" />
              <span>Skills</span>
              {resume.skills.length > 0 && (
                <span className="ml-auto bg-gray-700 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {resume.skills.length}
                </span>
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6">
            <form onSubmit={handleSubmit}>
              {activeTab === 'personal' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={resume.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={resume.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={resume.personalInfo.location}
                        onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Professional Summary</label>
                      <textarea
                        value={resume.personalInfo.summary}
                        onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                        className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="A passionate professional with experience in..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    <button
                      type="button"
                      onClick={() => addSectionItem('experience')}
                      className="flex items-center text-purple-400 hover:text-purple-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                  
                  {resume.experience.map((exp, index) => (
                    <div key={exp.id} className="mb-6 p-4 bg-gray-700/50 rounded-lg relative group">
                      <button
                        type="button"
                        onClick={() => removeSectionItem('experience', index)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove experience"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Senior Developer"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Company Name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                          className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe your responsibilities and achievements"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'education' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Education</h2>
                    <button
                      type="button"
                      onClick={() => addSectionItem('education')}
                      className="flex items-center text-purple-400 hover:text-purple-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Add Education</span>
                    </button>
                  </div>
                  
                  {resume.education.map((edu, index) => (
                    <div key={edu.id} className="mb-6 p-4 bg-gray-700/50 rounded-lg relative group">
                      <button
                        type="button"
                        onClick={() => removeSectionItem('education', index)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove education"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="University Name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">End Date (or expected)</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleInputChange('education', 'description', e.target.value, index)}
                          className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Relevant coursework, honors, or achievements"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Skills</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Add Skills</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., JavaScript, Project Management"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-purple-600 hover:bg-purple-700 px-4 rounded-r-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Press Enter or click Add to include the skill</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Your Skills ({resume.skills.length})</h3>
                    {resume.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map(skill => (
                          <div key={skill.id} className="flex items-center bg-gray-700 px-3 py-1.5 rounded-full">
                            <span className="text-sm">{skill.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.id)}
                              className="ml-2 text-gray-400 hover:text-red-400"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No skills added yet. Add some skills to get started.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="flex items-center justify-center px-6 py-2.5 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-900/30 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
