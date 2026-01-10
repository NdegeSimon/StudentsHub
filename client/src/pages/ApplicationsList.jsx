import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const ApplicationsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Add filters as query params
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.dateFrom) params.append('date_from', filters.dateFrom);
        if (filters.dateTo) params.append('date_to', filters.dateTo);
        
        const response = await api.get(`/api/applications?${params.toString()}`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await api.delete(`/api/applications/${applicationId}`);
        setApplications(applications.filter(app => app.id !== applicationId));
        toast.success('Application withdrawn successfully');
      } catch (error) {
        console.error('Error withdrawing application:', error);
        toast.error('Failed to withdraw application');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'applied': 'bg-blue-500',
      'reviewed': 'bg-yellow-500',
      'interview': 'bg-purple-500',
      'offered': 'bg-green-500',
      'hired': 'bg-green-700',
      'rejected': 'bg-red-500',
      'withdrawn': 'bg-gray-500'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusMap[status] || 'bg-gray-600'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}
              className="w-full p-2 bg-gray-600 hover:bg-gray-500 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No applications found</h3>
          <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {application.job.company.logo_url ? (
                        <img 
                          src={application.job.company.logo_url} 
                          alt={`${application.job.company.company_name} logo`}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center text-lg font-bold">
                          {application.job.company.company_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        <button 
                          onClick={() => navigate(`/jobs/${application.job.id}`)}
                          className="hover:text-blue-400 hover:underline"
                        >
                          {application.job.title}
                        </button>
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>{application.job.company.company_name}</span>
                        <span className="mx-2">•</span>
                        <span>{application.job.location || 'Remote'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Applied:</span>
                    <span className="text-sm">
                      {moment(application.applied_at).format('MMM D, YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Status:</span>
                    {getStatusBadge(application.status)}
                  </div>
                </div>
              </div>
              
              {application.status === 'rejected' && application.rejection_reason && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-md">
                  <h4 className="font-medium text-red-300 mb-1">Reason for rejection:</h4>
                  <p className="text-sm">{application.rejection_reason}</p>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Last updated: {moment(application.updated_at).fromNow()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/jobs/${application.job.id}`)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md"
                  >
                    View Job
                  </button>
                  {['applied', 'reviewed'].includes(application.status) && (
                    <button
                      onClick={() => handleWithdraw(application.id)}
                      className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-800/50 border border-red-800 rounded-md"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
