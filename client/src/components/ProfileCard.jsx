import React, { useState, useEffect } from 'react';
import { Camera, User, Edit, Save, X, Loader2 } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { userAPI, uploadAPI } from "../utils/api";
import { toast } from 'react-toastify';

export default function ProfileCard({ isDashboard = false }) {
  const { profile: contextProfile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: null,
    skills: [],
    experience: [],
    education: []
  });
  
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        const userData = response.data;
        
        setProfile(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          skills: userData.skills || []
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contextProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      // Update profile with new avatar
      const updatedProfile = { ...profile, avatar: avatarUrl };
      await userAPI.updateProfile({ avatar: avatarUrl });
      
      setProfile(updatedProfile);
      updateProfile(updatedProfile);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await userAPI.updateProfile(formData);
      
      // Update local state and context
      const updatedProfile = { ...profile, ...formData };
      setProfile(updatedProfile);
      updateProfile(updatedProfile);
      
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-navy min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  }

  if (isDashboard) {
    return (
      <div className="bg-dark-navy min-h-screen">
        <div className="flex flex-col items-center text-center p-6">
          <div className="relative group">
            <div className="relative w-28 h-28 mb-4">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name || 'Profile'} 
                  className="w-full h-full rounded-full object-cover ring-2 ring-dark-blue shadow-xl"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-900/30 flex items-center justify-center border-2 border-blue-800/50">
                  <User className="h-14 w-14 text-blue-400" />
                </div>
              )}
              <label 
                className="absolute -bottom-2 -right-2 bg-blue-700 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                title="Change photo"
              >
                <Camera className="h-5 w-5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={saving}
                />
              </label>
              {saving && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="h-7 w-7 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white">
            {profile.name || 'No name provided'}
          </h3>
          {profile.title && (
            <p className="text-sm text-blue-300 mt-1">
              {profile.title}
            </p>
          )}
          {profile.bio && (
            <p className="text-sm text-gray-400 mt-2 max-w-md">
              {profile.bio.length > 50 ? `${profile.bio.substring(0, 50)}...` : profile.bio}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-navy min-h-screen text-gray-200">
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-dark-blue p-6 rounded-lg mx-4 my-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <p className="text-gray-400">Update your personal information</p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 bg-blue-900/50 rounded-lg hover:bg-blue-900/70 transition-all flex items-center border border-blue-800/30"
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-all flex items-center shadow-lg"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center bg-blue-900/20 p-6 rounded-xl border border-blue-800/30">
                  <div className="relative group mb-6">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-blue-800/50 shadow-2xl">
                      {profile.avatar ? (
                        <img 
                          src={profile.avatar} 
                          alt={formData.name || 'Profile'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-900/30 flex items-center justify-center">
                          <User className="h-20 w-20 text-blue-400" />
                        </div>
                      )}
                      <label 
                        className="absolute inset-0 bg-blue-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full cursor-pointer backdrop-blur-sm"
                        title="Change photo"
                      >
                        <Camera className="h-10 w-10 text-white mb-2" />
                        <span className="text-sm text-white">Change Photo</span>
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
                  <h3 className="text-xl font-semibold text-white text-center mb-1">
                    {formData.name || 'No name provided'}
                  </h3>
                  <p className="text-sm text-blue-300">
                    {profile.email}
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-800/30">
                  <h3 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-blue-800/30">Personal Information</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-gray-400 cursor-not-allowed"
                        disabled
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Contact support to change your email address
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Skills
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          className="flex-1 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                          placeholder="Add a skill and press Enter"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-5 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-lg"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills?.map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-800/50 text-blue-200 border border-blue-700/30"
                          >
                            {skill}
                            <button 
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-3 inline-flex items-center justify-center h-5 w-5 rounded-full text-blue-400 hover:bg-blue-700/50 hover:text-blue-300 transition-all"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Profile</h2>
                <p className="text-gray-400 mt-2">Manage your profile information</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-3 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all flex items-center shadow-lg"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center bg-blue-900/20 p-8 rounded-xl border border-blue-800/30">
                  <div className="relative mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-blue-800/50 shadow-2xl">
                      {profile.avatar ? (
                        <img 
                          src={profile.avatar} 
                          alt={profile.name || 'Profile'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-900/30 flex items-center justify-center">
                          <User className="h-24 w-24 text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center">
                    {profile.name || 'No name provided'}
                  </h3>
                  {profile.title && (
                    <p className="text-lg text-blue-400 mt-2">
                      {profile.title}
                    </p>
                  )}
                  
                  <div className="mt-8 w-full">
                    <div className="space-y-4">
                      <div className="flex items-center p-3 rounded-lg bg-blue-900/30 border border-blue-800/30">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-400">Email</div>
                          <div className="text-sm text-gray-200 truncate">
                            {profile.email || 'Not provided'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-blue-900/30 border border-blue-800/30">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-400">Phone</div>
                          <div className="text-sm text-gray-200">
                            {profile.phone || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 overflow-hidden">
                  <div className="px-6 py-5 border-b border-blue-800/30">
                    <h3 className="text-xl font-semibold text-white">
                      About
                    </h3>
                    <p className="mt-1 text-gray-400">
                      Personal details and information
                    </p>
                  </div>
                  <div className="p-6">
                    <dl className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="text-sm font-medium text-blue-300 sm:w-1/4">Bio</dt>
                        <dd className="mt-1 text-gray-200 sm:mt-0 sm:w-3/4">
                          {profile.bio || 'No bio provided'}
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="text-sm font-medium text-blue-300 sm:w-1/4">Skills</dt>
                        <dd className="mt-1 sm:mt-0 sm:w-3/4">
                          {profile.skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-800/50 text-blue-200 border border-blue-700/30"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No skills added</span>
                          )}
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="text-sm font-medium text-blue-300 sm:w-1/4">Member Since</dt>
                        <dd className="mt-1 text-gray-200 sm:mt-0 sm:w-3/4">
                          {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'N/A'}
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <dt className="text-sm font-medium text-blue-300 sm:w-1/4">Last Updated</dt>
                        <dd className="mt-1 text-gray-200 sm:mt-0 sm:w-3/4">
                          {profile.updated_at ? new Date(profile.updated_at).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Experience Section */}
                <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 overflow-hidden">
                  <div className="px-6 py-5 border-b border-blue-800/30 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Experience</h3>
                      <p className="mt-1 text-sm text-gray-400">Professional background and work history</p>
                    </div>
                    <button
                      onClick={() => {}}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all flex items-center"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Experience
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-4">
                      {profile.experience?.length > 0 ? (
                        profile.experience.map((exp, index) => (
                          <li key={index} className="bg-blue-900/30 p-5 rounded-lg border border-blue-800/30">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                              <div>
                                <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                                <div className="flex items-center mt-1">
                                  <span className="px-3 py-1 text-xs font-medium bg-blue-800/50 text-blue-200 rounded-full">
                                    {exp.company}
                                  </span>
                                  {exp.location && (
                                    <span className="ml-3 text-sm text-gray-400 flex items-center">
                                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {exp.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <span className="px-3 py-1 text-sm font-medium text-green-200 bg-green-900/30 rounded-lg border border-green-800/30">
                                  {exp.start_date} - {exp.current ? 'Present' : exp.end_date || 'Present'}
                                </span>
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-gray-300 mt-3 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-800/30">
                            <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-gray-400 mb-4">No experience added yet</p>
                          <button
                            type="button"
                            onClick={() => {}}
                            className="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all"
                          >
                            Add your first experience
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Education Section */}
                <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 overflow-hidden">
                  <div className="px-6 py-5 border-b border-blue-800/30 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Education</h3>
                      <p className="mt-1 text-sm text-gray-400">Academic background and qualifications</p>
                    </div>
                    <button
                      onClick={() => {}}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all flex items-center"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Education
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-4">
                      {profile.education?.length > 0 ? (
                        profile.education.map((edu, index) => (
                          <li key={index} className="bg-blue-900/30 p-5 rounded-lg border border-blue-800/30">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                              <div>
                                <h4 className="text-lg font-semibold text-white">{edu.degree} in {edu.field_of_study}</h4>
                                <div className="flex items-center mt-1">
                                  <span className="px-3 py-1 text-xs font-medium bg-purple-900/50 text-purple-200 rounded-full">
                                    {edu.school}
                                  </span>
                                  {edu.grade && (
                                    <span className="ml-3 text-sm text-gray-400 flex items-center">
                                      <svg className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      {edu.grade}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <span className="px-3 py-1 text-sm font-medium text-blue-200 bg-blue-800/50 rounded-lg border border-blue-700/30">
                                  {edu.start_year} - {edu.current ? 'Present' : edu.end_year || 'N/A'}
                                </span>
                              </div>
                            </div>
                            {edu.activities && (
                              <p className="text-gray-300 mt-3 leading-relaxed">
                                {edu.activities}
                              </p>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-800/30">
                            <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l-9-5" />
                            </svg>
                          </div>
                          <p className="text-gray-400 mb-4">No education information added yet</p>
                          <button
                            type="button"
                            onClick={() => {}}
                            className="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all"
                          >
                            Add your education
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}