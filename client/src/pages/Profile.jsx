import React from 'react';
import ProfileCard from '../components/ProfileCard';

export default function Profile() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <ProfileCard />
            </div>
        </div>
    );
}