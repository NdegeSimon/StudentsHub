import React from 'react';
import { Link } from 'react-router-dom';

const EmployerJobs = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Job Postings</h1>
        <Link 
          to="/employer/jobs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Post New Job
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300">Your job postings will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;
