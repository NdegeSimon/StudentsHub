import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const CompanyProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    company_size: '',
    founded_year: ''
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/api/companies/${id || 'me'}`);
        setCompany(response.data);
        setFormData({
          company_name: response.data.company_name || '',
          description: response.data.description || '',
          industry: response.data.industry || '',
          website: response.data.website || '',
          location: response.data.location || '',
          company_size: response.data.company_size || '',
          founded_year: response.data.founded_year || ''
        });
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/companies/${company.id}`, formData);
      setCompany(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!company) {
    return <div className="text-center py-10">Company not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{company.company_name}</h1>
        {user?.id === company.user_id && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5000+">5000+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Founded Year</label>
              <input
                type="number"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Industry</h3>
              <p>{company.industry || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Website</h3>
              {company.website ? (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {company.website}
                </a>
              ) : (
                <p>Not specified</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Location</h3>
              <p>{company.location || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Company Size</h3>
              <p>{company.company_size || 'Not specified'}</p>
            </div>
            {company.founded_year && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">Founded</h3>
                <p>{company.founded_year}</p>
              </div>
            )}
          </div>
          
          {company.description && (
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-medium mb-2">About Us</h3>
              <p className="whitespace-pre-line">{company.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
