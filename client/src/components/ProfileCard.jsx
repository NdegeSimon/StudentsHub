import React from 'react';
import { Camera, User } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useState } from 'react';

export default function ProfileCard({ isDashboard = false }) {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(profile.name);
  const [tempBio, setTempBio] = React.useState(profile.bio || 'Web Developer | Tech Enthusiast');
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('Web Developer | Tech Enthusiast');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isDashboard) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-4">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{name.split(' ')[0]}</h3>
        <p className="text-sm text-gray-500">{bio.split('|')[0].trim()}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {/* Profile Header with Gradient */}
        <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-36 h-36">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Camera Button */}
              <label 
                htmlFor="profileUpload" 
                className="absolute -bottom-1 -right-1 bg-white text-orange-500 p-2 rounded-full hover:bg-orange-50 cursor-pointer shadow-md transition-all duration-200 hover:scale-105"
              >
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  id="profileUpload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          <p className="text-center text-sm text-gray-500 mb-1">Click camera icon to update photo</p>

          {/* Profile Info */}
          <div className="space-y-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 focus:shadow-sm"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl hover:shadow-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}