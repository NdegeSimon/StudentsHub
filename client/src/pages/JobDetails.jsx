import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const [jobRes, savedRes] = await Promise.all([
          api.get(`/api/jobs/${id}`),
          user ? api.get(`/api/saved-jobs/check/${id}`).catch(() => null) : Promise.resolve(null)
        ]);
        
        setJob(jobRes.data);
        setSaved(savedRes?.data?.saved || false);
        
        // Check if user has already applied
        if (user) {
          try {
            const appRes = await api.get(`/api/applications/check/${id}`);
            setApplicationStatus(appRes.data.status || 'applied');
          } catch (error) {
            // Not applied yet
            setApplicationStatus(null);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleSaveJob = async () => {
    if (!user) {
      toast.info('Please log in to save jobs');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      if (saved) {
        await api.delete(`/api/saved-jobs/${id}`);
        setSaved(false);
        toast.success('Job removed from saved jobs');
      } else {
        await api.post('/api/saved-jobs', { job_id: id });
        setSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.info('Please log in to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role === 'company') {
      toast.error('Companies cannot apply for jobs');
      return;
    }

    setApplying(true);
    try {
      await api.post('/api/applications', { job_id: id });
      setApplicationStatus('applied');
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.error || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-10">Job not found</div>;
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY');
  };

  const isExpired = job.application_deadline && new Date(job.application_deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Link 
                to={`/companies/${job.company.id}`}
                className="text-blue-400 hover:underline"
              >
                {job.company.company_name}
              </Link>
              <span className="mx-2">•</span>
              <span>{job.location || 'Remote'}</span>
              <span className="mx-2">•</span>
              <span>{job.job_type || 'Full-time'}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveJob}
              className={`px-4 py-2 rounded-md flex items-center ${
                saved 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
            
            {user?.role === 'student' && (
              <button
                onClick={handleApply}
                disabled={!!applicationStatus || isExpired || applying}
                className={`px-6 py-2 rounded-md ${
                  applicationStatus
                    ? 'bg-green-600 cursor-default'
                    : isExpired
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {applying ? (
                  'Applying...'
                ) : applicationStatus ? (
                  applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)
                ) : isExpired ? (
                  'Expired'
                ) : (
                  'Apply Now'
                )}
              </button>
            )}
          </div>
        </div>

        {isExpired && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded-md mb-4">
            This job posting has expired and is no longer accepting applications.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Job Type</h3>
            <p>{job.job_type || 'Not specified'}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Experience Level</h3>
            <p>{job.experience_level || 'Not specified'}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Application Deadline</h3>
            <p>{job.application_deadline ? formatDate(job.application_deadline) : 'Not specified'}</p>
          </div>
        </div>

        {job.salary_min && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Salary</h3>
            <p>
              {job.salary_currency || '$'}{job.salary_min.toLocaleString()}
              {job.salary_max ? ` - ${job.salary_currency || '$'}${job.salary_max.toLocaleString()}` : '+'}
              {job.salary_period ? ` per ${job.salary_period}` : ''}
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Job Description</h3>
          <div className="prose prose-invert max-w-none">
            {job.description}
          </div>
        </div>

        {job.requirements && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Requirements</h3>
            <div className="prose prose-invert max-w-none">
              {job.requirements}
            </div>
          </div>
        )}

        {job.responsibilities && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
            <div className="prose prose-invert max-w-none">
              {job.responsibilities}
            </div>
          </div>
        )}

        {(job.required_skills?.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(job.benefits?.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">About {job.company.company_name}</h2>
        <div className="prose prose-invert max-w-none">
          {job.company.description || 'No company description available.'}
        </div>
        <div className="mt-4">
          <Link 
            to={`/companies/${job.company.id}`}
            className="text-blue-400 hover:underline inline-flex items-center"
          >
            View Company Profile
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
