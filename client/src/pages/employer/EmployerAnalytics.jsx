import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const EmployerAnalytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h1>
      
      <div className="mb-6 flex space-x-4">
        <Link 
          to="/employer/analytics/overview" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Overview
        </Link>
        <Link 
          to="/employer/analytics/reports" 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reports
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployerAnalytics;
