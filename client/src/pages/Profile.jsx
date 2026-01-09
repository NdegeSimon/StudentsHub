import React, { useState, useEffect } from 'react';
import { Camera, User, Edit, Save, X, Loader2, Plus, Trash2 } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { userAPI, uploadAPI } from "../utils/api";
import { toast } from 'react-toastify';

export default function ProfileCard({ isDashboard = false }) {
  const { profile: contextProfile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    experience: [],
    education: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Initialize form data when contextProfile changes
  useEffect(() => {
    if (contextProfile) {
      setFormData({
        name: contextProfile.name || '',
        email: contextProfile.email || '',
        phone: contextProfile.phone || '',
        bio: contextProfile.bio || '',
        skills: contextProfile.skills || [],
        experience: contextProfile.experience?.map(exp => ({
          ...exp,
          id: exp.id || Date.now() + Math.random()
        })) || [],
        education: contextProfile.education?.map(edu => ({
          ...edu,
          id: edu.id || Date.now() + Math.random()
        })) || []
      });
      setLoading(false);
    }
  }, [contextProfile]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      
      const response = await uploadAPI.uploadFile(formData);
      const avatarUrl = response.data.url;
      await userAPI.updateProfile({ avatar: avatarUrl });
      updateProfile({ ...contextProfile, avatar: avatarUrl });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  // Skills
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Experience
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      const updatedExperience = [...formData.experience, { 
        ...newExperience, 
        id: Date.now() + Math.random() 
      }];
      
      setFormData(prev => ({
        ...prev,
        experience: updatedExperience
      }));
      
      setNewExperience({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Education
  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addEducation = () => {
    if (newEducation.school && newEducation.degree) {
      const updatedEducation = [...formData.education, { 
        ...newEducation, 
        id: Date.now() + Math.random() 
      }];
      
      setFormData(prev => ({
        ...prev,
        education: updatedEducation
      }));
      
      setNewEducation({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        // Remove temporary IDs before sending to server
        experience: formData.experience.map(({ id, ...rest }) => rest),
        education: formData.education.map(({ id, ...rest }) => rest)
      };

      const response = await userAPI.updateProfile(dataToSubmit);
      const updatedProfile = {
        ...contextProfile,
        ...response.data,
        // Ensure we have IDs for local state management
        experience: response.data.experience?.map(exp => ({
          ...exp,
          id: exp.id || Date.now() + Math.random()
        })) || [],
        education: response.data.education?.map(edu => ({
          ...edu,
          id: edu.id || Date.now() + Math.random()
        })) || []
      };

      updateProfile(updatedProfile);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Dashboard View
  if (isDashboard) {
    return (
      <div className="bg-blue-900 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full bg-blue-800 flex items-center justify-center overflow-hidden">
              {contextProfile.avatar ? (
                <img 
                  src={contextProfile.avatar} 
                  alt={contextProfile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-blue-300" />
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{contextProfile.name}</h2>
          <p className="text-blue-200">{contextProfile.title || 'Member'}</p>
          
          {contextProfile.bio && (
            <p className="mt-4 text-blue-100 text-sm">
              {contextProfile.bio.length > 100 
                ? `${contextProfile.bio.substring(0, 100)}...` 
                : contextProfile.bio}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Main Profile View
  return (
    <div className="bg-blue-950 text-blue-100 rounded-xl overflow-hidden">
      {editing ? (
        // Edit Form
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <p className="text-blue-300">Update your personal information</p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center"
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center overflow-hidden">
                      {contextProfile.avatar ? (
                        <img 
                          src={contextProfile.avatar} 
                          alt={formData.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-blue-300" />
                      )}
                      <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="h-6 w-6 text-white" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={saving}
                        />
                      </label>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{formData.name}</h3>
                  <p className="text-blue-300 text-sm">{formData.email}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-blue-950 border border-blue-800 rounded-lg"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-blue-950 border border-blue-800 rounded-lg"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-blue-950 border border-blue-800 rounded-lg"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-blue-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 bg-blue-950 border border-blue-800 rounded-lg"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-800 text-blue-100 rounded-full text-sm flex items-center">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-300 hover:text-white"
                        disabled={saving}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-2 bg-blue-950 border border-blue-800 rounded-l-lg"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim() || saving}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-r-lg disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Experience Section */}
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <h3 className="text-lg font-semibold mb-4">Experience</h3>
                <div className="space-y-4">
                  {formData.experience.map((exp) => (
                    <div key={exp.id} className="bg-blue-950 p-4 rounded-lg border border-blue-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-blue-300">{exp.company}</p>
                          <p className="text-sm text-blue-400">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                          </p>
                          {exp.description && (
                            <p className="mt-2 text-blue-200 text-sm">{exp.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Experience Form */}
                  <div className="mt-6 p-4 bg-blue-950 rounded-lg border border-dashed border-blue-800">
                    <h4 className="font-medium mb-3">Add New Experience</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Job Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={newExperience.title}
                          onChange={handleExperienceChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Company*</label>
                        <input
                          type="text"
                          name="company"
                          value={newExperience.company}
                          onChange={handleExperienceChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={newExperience.startDate}
                          onChange={handleExperienceChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={newExperience.endDate}
                          onChange={handleExperienceChange}
                          disabled={newExperience.current || saving}
                          className={`w-full px-3 py-2 bg-blue-900 border ${newExperience.current ? 'border-blue-800' : 'border-blue-700'} rounded-lg`}
                        />
                        <label className="flex items-center mt-2 text-sm text-blue-300">
                          <input
                            type="checkbox"
                            name="current"
                            checked={newExperience.current}
                            onChange={handleExperienceChange}
                            className="mr-2"
                            disabled={saving}
                          />
                          I currently work here
                        </label>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm text-blue-300 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        rows="2"
                        className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                        disabled={saving}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={addExperience}
                        disabled={!newExperience.title || !newExperience.company || saving}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm disabled:opacity-50"
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section - Similar to Experience */}
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="bg-blue-950 p-4 rounded-lg border border-blue-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-blue-300">{edu.school}</p>
                          <p className="text-blue-300 text-sm">{edu.field}</p>
                          <p className="text-sm text-blue-400">
                            {edu.startDate} - {edu.current ? 'Present' : edu.endDate || 'Present'}
                          </p>
                          {edu.description && (
                            <p className="mt-2 text-blue-200 text-sm">{edu.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Education Form */}
                  <div className="mt-6 p-4 bg-blue-950 rounded-lg border border-dashed border-blue-800">
                    <h4 className="font-medium mb-3">Add Education</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">School*</label>
                        <input
                          type="text"
                          name="school"
                          value={newEducation.school}
                          onChange={handleEducationChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Degree*</label>
                        <input
                          type="text"
                          name="degree"
                          value={newEducation.degree}
                          onChange={handleEducationChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Field of Study</label>
                        <input
                          type="text"
                          name="field"
                          value={newEducation.field}
                          onChange={handleEducationChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={newEducation.startDate}
                          onChange={handleEducationChange}
                          className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={newEducation.endDate}
                          onChange={handleEducationChange}
                          disabled={newEducation.current || saving}
                          className={`w-full px-3 py-2 bg-blue-900 border ${newEducation.current ? 'border-blue-800' : 'border-blue-700'} rounded-lg`}
                        />
                        <label className="flex items-center mt-2 text-sm text-blue-300">
                          <input
                            type="checkbox"
                            name="current"
                            checked={newEducation.current}
                            onChange={handleEducationChange}
                            className="mr-2"
                            disabled={saving}
                          />
                          I currently study here
                        </label>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm text-blue-300 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={newEducation.description}
                        onChange={handleEducationChange}
                        rows="2"
                        className="w-full px-3 py-2 bg-blue-900 border border-blue-800 rounded-lg"
                        disabled={saving}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={addEducation}
                        disabled={!newEducation.school || !newEducation.degree || saving}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm disabled:opacity-50"
                      >
                        Add Education
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        // View Mode
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{contextProfile.name}</h2>
              <p className="text-blue-300">{contextProfile.title || 'Member'}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center overflow-hidden">
                      {contextProfile.avatar ? (
                        <img 
                          src={contextProfile.avatar} 
                          alt={contextProfile.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-blue-300" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{contextProfile.name}</h3>
                  <p className="text-blue-300">{contextProfile.email}</p>
                  <p className="text-blue-300">{contextProfile.phone}</p>
                  
                  {contextProfile.skills && contextProfile.skills.length > 0 && (
                    <div className="mt-4 w-full">
                      <h4 className="font-medium text-blue-100 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {contextProfile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-800 text-blue-100 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* About */}
              {contextProfile.bio && (
                <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-blue-200">{contextProfile.bio}</p>
                </div>
              )}

              {/* Experience */}
              {contextProfile.experience && contextProfile.experience.length > 0 && (
                <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                  <h3 className="text-lg font-semibold mb-4">Experience</h3>
                  <div className="space-y-4">
                    {contextProfile.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-700 pl-4 py-1">
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-blue-300">{exp.company}</p>
                        <p className="text-sm text-blue-400">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-blue-200 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {contextProfile.education && contextProfile.education.length > 0 && (
                <div className="bg-blue-900 p-6 rounded-xl border border-blue-800">
                  <h3 className="text-lg font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {contextProfile.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-700 pl-4 py-1">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-blue-300">{edu.school}</p>
                        <p className="text-blue-300 text-sm">{edu.field}</p>
                        <p className="text-sm text-blue-400">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate || 'Present'}
                        </p>
                        {edu.description && (
                          <p className="mt-2 text-blue-200 text-sm">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}