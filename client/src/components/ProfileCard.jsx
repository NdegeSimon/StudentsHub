import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';

export default function ProfileCard() {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            {/* Camera Button */}
            <label 
              htmlFor="profileUpload" 
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer shadow-lg transition-colors"
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
          
          <p className="text-sm text-gray-500 mb-2">Click camera icon to upload photo</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}