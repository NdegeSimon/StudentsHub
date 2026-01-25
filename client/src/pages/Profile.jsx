import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Camera, User, Edit, Save, X, Loader2, Plus, Trash2, 
  CheckCircle, AlertCircle, Wifi, WifiOff, Mail, Phone, 
  MapPin, Briefcase, GraduationCap, Award, Globe, 
  Download, Upload, Shield, Bell, Sparkles, Zap,
  Calendar, ChevronRight, Star, TrendingUp, Target,
  Users, Link, Eye, EyeOff, RefreshCw, Linkedin, Github,
  ExternalLink, FileText, Award as AwardIcon, Code
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { userAPI, authAPI, uploadAPI } from "../utils/api";
import { toast } from 'react-toastify';

// ==================== CACHE MANAGER ====================
class CacheManager {
  static CACHE_KEY = 'profile_cache_v4';
  static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static set(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        version: '4.0'
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(`${this.CACHE_KEY}_last_updated`, new Date().toISOString());
      return true;
    } catch (error) {
      console.warn('Cache storage failed:', error);
      return false;
    }
  }

  static get() {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp, version } = JSON.parse(cached);
      
      // Invalidate if expired
      const isExpired = Date.now() - timestamp > this.CACHE_DURATION;
      
      if (isExpired) {
        this.clear();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  static getLastUpdated() {
    try {
      return localStorage.getItem(`${this.CACHE_KEY}_last_updated`);
    } catch {
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(`${this.CACHE_KEY}_last_updated`);
  }

  static has() {
    return localStorage.getItem(this.CACHE_KEY) !== null;
  }
}

// ==================== CHANGE QUEUE ====================
class ChangeQueue {
  static QUEUE_KEY = 'profile_changes_queue_v3';

  static add(change) {
    const queue = this.getQueue();
    queue.push({ 
      ...change, 
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      status: 'pending'
    });
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }

  static getQueue() {
    try {
      const queue = localStorage.getItem(this.QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  static clear() {
    localStorage.removeItem(this.QUEUE_KEY);
  }

  static isEmpty() {
    return this.getQueue().length === 0;
  }

  static getPendingCount() {
    return this.getQueue().filter(item => item.status === 'pending').length;
  }

  static remove(id) {
    const queue = this.getQueue();
    const newQueue = queue.filter(item => item.id !== id);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(newQueue));
  }

  static markAsSynced(id) {
    const queue = this.getQueue();
    const itemIndex = queue.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      queue[itemIndex].status = 'synced';
      queue[itemIndex].syncedAt = Date.now();
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    }
  }
}

// ==================== DEBOUNCE HOOK ====================
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ==================== MAIN COMPONENT ====================

export default function ProfileCard({ isDashboard = false }) {
  const { profile: contextProfile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(() => CacheManager.getLastUpdated());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('full');
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [profileViews, setProfileViews] = useState(1242);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [pendingChangesCount, setPendingChangesCount] = useState(ChangeQueue.getPendingCount());
  const [apiError, setApiError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  
  const initialDataRef = useRef(null);
  const formRef = useRef(null);
  const avatarInputRef = useRef(null);
  
  // Form state that matches your backend Student model
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    work_experience: [],
    education: [],
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    resume_url: '',
    profile_picture: '',
    years_of_experience: 0,
    availability: 'immediate',
    preferred_job_types: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    skills: []
  });
  
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    grade: ''
  });

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const options = { year: 'numeric', month: 'short' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; // Return as is if date parsing fails
    }
  };

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🔄 Back online! Syncing changes...', {
        icon: <Zap className="w-5 h-5" />
      });
      syncPendingChanges();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('🌐 You are offline. Changes will sync when connection is restored.', {
        autoClose: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor pending changes count
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingChangesCount(ChangeQueue.getPendingCount());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Sync pending changes when online
  const syncPendingChanges = async () => {
    const queue = ChangeQueue.getQueue();
    if (queue.length === 0) return;

    try {
      let syncedCount = 0;
      
      for (const change of queue) {
        if (change.status === 'pending') {
          try {
            await updateProfileData(change.data);
            ChangeQueue.markAsSynced(change.id);
            syncedCount++;
          } catch (error) {
            console.error('Failed to sync change:', error);
          }
        }
      }
      
      if (syncedCount > 0) {
        await fetchProfile(true);
        toast.success(`✅ ${syncedCount} changes synced successfully!`);
      }
    } catch (error) {
      console.error('Error syncing changes:', error);
      toast.error('Failed to sync some changes. Will retry later.');
    }
  };

  // Enhanced validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Invalid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s\-()]{10,}$/.test(value.replace(/\s/g, ''))) {
          errors.phone = 'Invalid phone number (min 10 digits)';
        } else {
          delete errors.phone;
        }
        break;
      case 'first_name':
        if (!value || value.trim().length < 1) {
          errors.first_name = 'First name is required';
        } else {
          delete errors.first_name;
        }
        break;
      case 'portfolio_url':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          errors.portfolio_url = 'Invalid URL';
        } else {
          delete errors.portfolio_url;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Transform backend data to form data
  const transformBackendToForm = (backendData) => {
    console.log('Transforming backend data:', backendData);
    
    const data = backendData.data || backendData;
    
    return {
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      phone: data.phone || '',
      bio: data.bio || '',
      location: data.location || '',
      skills: Array.isArray(data.skills) ? data.skills : [],
      work_experience: Array.isArray(data.work_experience) ? data.work_experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      portfolio_url: data.portfolio_url || '',
      github_url: data.github_url || '',
      linkedin_url: data.linkedin_url || '',
      resume_url: data.resume_url || '',
      profile_picture: data.profile_picture || '',
      years_of_experience: data.years_of_experience || 0,
      availability: data.availability || 'immediate',
      preferred_job_types: Array.isArray(data.preferred_job_types) ? data.preferred_job_types : []
    };
  };

  // Transform form data to backend format
  const transformFormToBackend = (formData) => {
    console.log('Transforming form data for backend:', formData);
    
    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || '',
      location: formData.location || '',
      bio: formData.bio || '',
      skills: formData.skills || [],
      work_experience: formData.work_experience || [],
      education: formData.education || [],
      portfolio_url: formData.portfolio_url || '',
      github_url: formData.github_url || '',
      linkedin_url: formData.linkedin_url || '',
      resume_url: formData.resume_url || '',
      profile_picture: formData.profile_picture || '',
      years_of_experience: formData.years_of_experience || 0,
      availability: formData.availability || 'immediate',
      preferred_job_types: formData.preferred_job_types || []
    };
  };

  // Update profile data - handles all updates
  const updateProfileData = async (data) => {
    console.log('Updating profile with data:', data);
    
    // Try multiple endpoints
    const endpoints = [
      () => userAPI.updateProfile(data),
      () => apiPost('/profile/basic', data)
    ];
    
    for (const endpointFn of endpoints) {
      try {
        const response = await endpointFn();
        console.log('Update successful via endpoint:', endpointFn.name, response.data);
        return response;
      } catch (error) {
        console.warn('Endpoint failed, trying next...', error.message);
      }
    }
    
    throw new Error('All update endpoints failed');
  };

  // Helper function for API posts
  const apiPost = async (url, data) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    
    const response = await fetch(`${API_BASE_URL}/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  // Fetch profile with caching and error handling
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setApiError(null);
      console.log('🔍 Fetching profile...');

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = CacheManager.get();
        if (cached) {
          console.log('📦 Using cached profile data');
          const transformed = transformBackendToForm(cached);
          setFormData(transformed);
          initialDataRef.current = transformed;
          setLoading(false);
          setDebugInfo(prev => ({ ...prev, source: 'cache' }));
          return;
        }
      }

      console.log('📡 Fetching from API...');
      
      // Try multiple endpoints to find the working one
      let response;
      let source = '';
      
      try {
        // Try profile/me first (your backend endpoint)
        response = await userAPI.getProfile();
        source = 'profile/me';
      } catch (error) {
        console.log('profile/me failed, trying auth/me...');
        try {
          response = await authAPI.getCurrentUser();
          source = 'auth/me';
        } catch (authError) {
          console.log('Both endpoints failed');
          throw new Error('All API endpoints failed');
        }
      }

      if (!response || !response.data) {
        throw new Error('Invalid API response');
      }

      console.log(`✅ Profile loaded from ${source}:`, response.data);
      
      // Store debug info
      setDebugInfo({
        lastFetch: new Date().toISOString(),
        source,
        status: 'success'
      });

      const profileData = response.data;
      const transformed = transformBackendToForm(profileData);
      
      console.log('🔄 Transformed data:', transformed);
      
      // Update state
      setFormData(transformed);
      initialDataRef.current = transformed;
      
      // Update context if available
      if (updateProfile) {
        updateProfile(profileData);
      }
      
      // Cache it
      CacheManager.set(profileData);
      setLastSaved(new Date().toISOString());
      
      toast.success('✅ Profile loaded successfully');
      
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setApiError(error.message);
      
      // Store debug info
      setDebugInfo({
        lastFetch: new Date().toISOString(),
        source: 'error',
        error: error.message,
        status: 'failed'
      });

      // Check if we have cached data
      const cached = CacheManager.get();
      if (cached) {
        toast.warning('⚠️ Backend unavailable. Using cached profile data.');
        const transformed = transformBackendToForm(cached);
        setFormData(transformed);
        initialDataRef.current = transformed;
      } else {
        toast.error('❌ Unable to load profile. Please check your connection.');
        
        // Load sample data for demonstration
        const sampleData = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          bio: 'Passionate full-stack developer with 3+ years of experience building web applications.',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
          work_experience: [
            {
              id: 1,
              title: 'Software Engineer',
              company: 'Tech Corp',
              location: 'San Francisco, CA',
              start_date: '2022-01-01',
              end_date: '',
              is_current: true,
              description: 'Developed and maintained web applications using React and Node.js'
            }
          ],
          education: [
            {
              id: 1,
              institution: 'Stanford University',
              degree: 'Bachelor of Science',
              field_of_study: 'Computer Science',
              start_date: '2018-09-01',
              end_date: '2022-06-01',
              is_current: false,
              description: 'Graduated with honors',
              grade: '3.8'
            }
          ],
          portfolio_url: 'https://portfolio.johndoe.com',
          github_url: 'https://github.com/johndoe',
          linkedin_url: 'https://linkedin.com/in/johndoe',
          profile_picture: '',
          years_of_experience: 3
        };
        
        const transformed = transformBackendToForm(sampleData);
        setFormData(transformed);
        initialDataRef.current = transformed;
      }
    } finally {
      setLoading(false);
    }
  }, [updateProfile]);

  // Initialize form data
  useEffect(() => {
    if (contextProfile) {
      console.log('Using context profile:', contextProfile);
      const transformed = transformBackendToForm(contextProfile);
      setFormData(transformed);
      initialDataRef.current = transformed;
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [contextProfile, fetchProfile]);

  // Check for unsaved changes
  useEffect(() => {
    if (initialDataRef.current) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
      setHasUnsavedChanges(hasChanges);
      
      // Auto-save when there are changes and we're online
      if (hasChanges && isOnline && !saving && editing) {
        autoSaveProfile();
      }
    }
  }, [formData, editing, isOnline, saving]);

  // Auto-save functionality
  const autoSaveProfile = async () => {
    if (!hasUnsavedChanges || !isOnline || saving) return;

    try {
      setAutoSaving(true);
      const dataToSubmit = transformFormToBackend(formData);
      
      await updateProfileData(dataToSubmit);
      
      const now = new Date();
      setLastSaved(now.toISOString());
      setHasUnsavedChanges(false);
      initialDataRef.current = formData;
      
      CacheManager.set(dataToSubmit);
      
      setRealTimeUpdates(prev => [...prev.slice(-4), {
        type: 'auto-save',
        timestamp: now,
        message: 'Auto-saved successfully'
      }]);
      
      toast.success('💾 Auto-saved');
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Queue for later sync if offline
      if (!isOnline) {
        const dataToSubmit = transformFormToBackend(formData);
        ChangeQueue.add({ 
          type: 'profile_update',
          data: dataToSubmit
        });
        setPendingChangesCount(ChangeQueue.getPendingCount());
        toast.info('📱 Changes queued for offline sync');
      }
    } finally {
      setAutoSaving(false);
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    validateField(name, value);
  };

  // Enhanced image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to backend
      const response = await uploadAPI.uploadProfilePicture(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      const profilePictureUrl = response.data?.url || response.data?.profile_picture;
      
      if (!profilePictureUrl) {
        throw new Error('No image URL returned from server');
      }
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        profile_picture: profilePictureUrl
      }));
      
      // Update backend profile
      await updateProfileData({ profile_picture: profilePictureUrl });
      
      // Update context
      if (updateProfile) {
        updateProfile({ profile_picture: profilePictureUrl });
      }
      
      // Update cache
      const cached = CacheManager.get();
      if (cached) {
        cached.profile_picture = profilePictureUrl;
        CacheManager.set(cached);
      }
      
      toast.success('🎉 Profile picture updated!', {
        icon: <Sparkles className="w-5 h-5" />
      });
      
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
      
      // Fallback: Update local state only
      const localUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profile_picture: localUrl
      }));
      toast.info('📱 Picture saved locally. Will upload when online.');
      
      setUploadProgress(0);
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
      const newExp = {
        ...newExperience, 
        id: Date.now() + Math.random(),
        start_date: formatDateForInput(newExperience.start_date),
        end_date: newExperience.is_current ? '' : formatDateForInput(newExperience.end_date),
        skills: newExperience.skills || []
      };
      
      setFormData(prev => ({
        ...prev,
        work_experience: [...prev.work_experience, newExp]
      }));
      
      setNewExperience({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        skills: []
      });
    }
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter(exp => exp.id !== id)
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
    if (newEducation.institution && newEducation.degree) {
      const newEdu = {
        ...newEducation, 
        id: Date.now() + Math.random(),
        start_date: formatDateForInput(newEducation.start_date),
        end_date: newEducation.is_current ? '' : formatDateForInput(newEducation.end_date)
      };
      
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEdu]
      }));
      
      setNewEducation({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        grade: ''
      });
    }
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Handle adding/updating experience via backend
  const handleAddExperience = async (newExperience) => {
    try {
      setSaving(true);
      const response = await userAPI.updateExperience?.(newExperience) || 
                       apiPost('/profile/experience', newExperience);
      
      if (response.status === 'success') {
        setFormData(prev => ({
          ...prev,
          work_experience: [...prev.work_experience, newExperience]
        }));
        toast.success('✅ Experience added successfully');
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience. Saving locally.');
      // Save locally
      setFormData(prev => ({
        ...prev,
        work_experience: [...prev.work_experience, newExperience]
      }));
    } finally {
      setSaving(false);
    }
  };

  const handleEditExperience = (updatedExperience) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    }));
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setFormData(prev => ({
        ...prev,
        work_experience: prev.work_experience.filter(exp => exp.id !== id)
      }));
      toast.success('Experience deleted');
    }
  };

  // Handle adding/updating education via backend
  const handleAddEducation = async (newEducation) => {
    try {
      setSaving(true);
      const response = await userAPI.updateEducation?.(newEducation) ||
                       apiPost('/profile/education', newEducation);
      
      if (response.status === 'success') {
        setFormData(prev => ({
          ...prev,
          education: [...prev.education, newEducation]
        }));
        toast.success('✅ Education added successfully');
      }
    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education. Saving locally.');
      // Save locally
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
    } finally {
      setSaving(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = ['first_name', 'email'];
    const isValid = requiredFields.every(field => 
      validateField(field, formData[field])
    );

    if (!isValid) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);
      
      const dataToSubmit = transformFormToBackend(formData);

      if (!isOnline) {
        // Offline: Queue the change
        ChangeQueue.add({ 
          type: 'profile_update',
          data: dataToSubmit
        });
        setPendingChangesCount(ChangeQueue.getPendingCount());
        toast.info('💾 Changes saved locally. Will sync when online.');
        setEditing(false);
        return;
      }

      // Send to backend
      const response = await updateProfileData(dataToSubmit);
      
      // If backend returns updated data, use it
      if (response.data) {
        const updatedProfile = response.data.data || response.data;
        const transformed = transformBackendToForm(updatedProfile);
        
        // Update everything
        if (updateProfile) {
          updateProfile(updatedProfile);
        }
        setFormData(transformed);
        initialDataRef.current = transformed;
        
        // Update cache
        CacheManager.set(updatedProfile);
      }
      
      setEditing(false);
      setLastSaved(new Date().toISOString());
      setHasUnsavedChanges(false);
      
      // Add to real-time updates
      setRealTimeUpdates(prev => [...prev.slice(-4), {
        type: 'manual-save',
        timestamp: new Date(),
        message: 'Changes saved successfully'
      }]);
      
      toast.success('✅ Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Rollback optimistic update
      if (initialDataRef.current) {
        setFormData(initialDataRef.current);
      }
      
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Queue for offline sync
      const dataToSubmit = transformFormToBackend(formData);
      ChangeQueue.add({ 
        type: 'profile_update',
        data: dataToSubmit
      });
      setPendingChangesCount(ChangeQueue.getPendingCount());
      
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile strength
  const calculateProfileStrength = () => {
    let score = 0;
    const fields = [
      { check: () => formData.first_name && formData.last_name, weight: 15 },
      { check: () => formData.email, weight: 10 },
      { check: () => formData.bio?.length > 50, weight: 10 },
      { check: () => formData.profile_picture, weight: 10 },
      { check: () => formData.skills.length >= 3, weight: 10 },
      { check: () => formData.work_experience.length > 0, weight: 15 },
      { check: () => formData.education.length > 0, weight: 10 },
      { check: () => formData.location, weight: 5 },
      { check: () => formData.resume_url, weight: 5 },
      { check: () => formData.portfolio_url || formData.linkedin_url || formData.github_url, weight: 10 }
    ];
    
    fields.forEach(field => {
      if (field.check()) score += field.weight;
    });
    
    return Math.min(score, 100);
  };

  // Get profile level
  const getProfileLevel = () => {
    const strength = calculateProfileStrength();
    if (strength >= 90) return { level: 'Expert', color: 'text-purple-400', bgColor: 'bg-purple-400/10' };
    if (strength >= 70) return { level: 'Advanced', color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
    if (strength >= 50) return { level: 'Intermediate', color: 'text-green-400', bgColor: 'bg-green-400/10' };
    return { level: 'Beginner', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
  };

  // Save indicator component
  const SaveIndicator = () => {
    if (saving) {
      return (
        <div className="flex items-center text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Saving changes...</span>
        </div>
      );
    }
    
    if (autoSaving) {
      return (
        <div className="flex items-center text-blue-300">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Auto-saving...</span>
        </div>
      );
    }
    
    if (hasUnsavedChanges) {
      return (
        <div className="flex items-center text-yellow-400">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Unsaved changes</span>
        </div>
      );
    }
    
    if (lastSaved) {
      return (
        <div className="flex items-center text-green-400">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-400">
        <span>Ready to edit</span>
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="h-64 bg-gray-800 rounded-xl"></div>
                <div className="h-32 bg-gray-800 rounded-xl"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-gray-800 rounded-xl"></div>
                <div className="h-64 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full name for display
  const fullName = `${formData.first_name} ${formData.last_name}`.trim();

  // Dashboard View
  if (isDashboard) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Profile Overview
              </h2>
              <p className="text-gray-400">Your professional presence</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProfileLevel().color} ${getProfileLevel().bgColor}`}>
                {getProfileLevel().level}
              </span>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-all">
                <Eye className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-2xl border-4 border-gray-800 overflow-hidden shadow-2xl group cursor-pointer"
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
                onClick={() => avatarInputRef.current?.click()}
              >
                {formData.profile_picture ? (
                  <img 
                    src={formData.profile_picture} 
                    alt={fullName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Strength Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Profile Strength</span>
                  <span className="text-sm font-semibold text-white">{calculateProfileStrength()}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${calculateProfileStrength()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{fullName || 'Your Name'}</h3>
              <p className="text-blue-400 font-medium mb-4">{formData.bio?.substring(0, 50) || 'Add a bio to introduce yourself'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{formData.email || 'No email set'}</span>
                </div>
                {formData.location && (
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{formData.location}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{formData.work_experience.length} experiences</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>{formData.education.length} education</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex space-x-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 flex-1 border border-gray-800">
                  <div className="text-2xl font-bold text-white">{profileViews.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Profile Views</div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 flex-1 border border-gray-800">
                  <div className="text-2xl font-bold text-white">{formData.skills.length}</div>
                  <div className="text-xs text-gray-400">Skills</div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 flex-1 border border-gray-800">
                  <div className="text-2xl font-bold text-green-400">
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  <div className="text-xs text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-all transform hover:-translate-y-0.5"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
            {formData.resume_url && (
              <a 
                href={formData.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center transition-all"
              >
                <Download className="h-5 w-5 mr-2" />
                Resume
              </a>
            )}
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
        />
      </div>
    );
  }

  // Main Profile View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Professional Profile
            </h1>
            <p className="text-gray-400 mt-2">Showcase your skills and experience</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Network Status */}
            <div className={`px-4 py-2 rounded-xl border ${isOnline ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
              <div className="flex items-center">
                {isOnline ? (
                  <>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-red-400 font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-900 rounded-xl p-1">
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'full' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              >
                Full View
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <SaveIndicator />
              
              {pendingChangesCount > 0 && (
                <div className="flex items-center px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-300 text-sm">
                    {pendingChangesCount} pending change(s)
                  </span>
                </div>
              )}
              
              {apiError && (
                <div className="flex items-center px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-300 text-sm">
                    API Error
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {lastSaved && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last saved: {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              
              <button
                onClick={() => fetchProfile(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center transition-all"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Debug Panel (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 bg-black/50 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-mono text-gray-400">Debug Info</span>
              <button 
                onClick={() => console.log('Form Data:', formData)}
                className="text-xs text-blue-400"
              >
                Log Data
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-gray-500">Status:</div>
              <div className="text-green-400">{debugInfo.status || 'unknown'}</div>
              <div className="text-gray-500">Source:</div>
              <div className="text-blue-400">{debugInfo.source || 'none'}</div>
              <div className="text-gray-500">Name:</div>
              <div className="text-white">{fullName || 'Not set'}</div>
              <div className="text-gray-500">Skills:</div>
              <div className="text-white">{formData.skills.length}</div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div 
                    className="relative mb-6 cursor-pointer group/avatar"
                    onMouseEnter={() => setIsHoveringAvatar(true)}
                    onMouseLeave={() => setIsHoveringAvatar(false)}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <div className="w-32 h-32 rounded-2xl border-4 border-gray-800 overflow-hidden shadow-2xl">
                      {formData.profile_picture ? (
                        <img 
                          src={formData.profile_picture} 
                          alt={fullName}
                          className="w-full h-full object-cover transform group-hover/avatar:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                          <User className="h-20 w-20 text-gray-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className={`absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="text-white font-medium">Change Photo</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{fullName || 'Your Name'}</h3>
                  <p className="text-blue-400 mb-4">{formData.location || 'Location not set'}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 w-full mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formData.work_experience.length}</div>
                      <div className="text-xs text-gray-400">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formData.skills.length}</div>
                      <div className="text-xs text-gray-400">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formData.education.length}</div>
                      <div className="text-xs text-gray-400">Education</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 w-full">
                    {formData.email && (
                      <div className="flex items-center text-gray-300">
                        <Mail className="h-4 w-4 mr-3 text-gray-500" />
                        <span className="truncate">{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-3 text-gray-500" />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                        <span>{formData.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3 mt-6">
                    {formData.portfolio_url && (
                      <a href={formData.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                        <Globe className="h-5 w-5 text-gray-300" />
                      </a>
                    )}
                    {formData.linkedin_url && (
                      <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-blue-600/20 rounded-lg transition-all">
                        <Linkedin className="h-5 w-5 text-gray-300" />
                      </a>
                    )}
                    {formData.github_url && (
                      <a href={formData.github_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                        <Github className="h-5 w-5 text-gray-300" />
                      </a>
                    )}
                    {formData.resume_url && (
                      <a href={formData.resume_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-green-600/20 rounded-lg transition-all">
                        <FileText className="h-5 w-5 text-gray-300" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Skills & Expertise</h4>
                <span className="text-sm text-gray-400">{formData.skills.length} skills</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:border-blue-500/50 transition-all cursor-pointer hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No skills added yet</p>
                    <button 
                      onClick={() => setEditing(true)}
                      className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Add Skills
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Edit Mode */}
            {editing ? (
              <form onSubmit={handleSubmit} ref={formRef} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <p className="text-gray-400">Update your personal information</p>
                    {Object.keys(validationErrors).length > 0 && (
                      <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">Please fix the errors below</p>
                        <ul className="mt-1 text-sm text-red-300">
                          {Object.entries(validationErrors).map(([key, value]) => (
                            <li key={key}>• {value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        if (initialDataRef.current) {
                          setFormData(initialDataRef.current);
                        }
                        setValidationErrors({});
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center transition-all"
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl flex items-center transition-all disabled:opacity-50"
                      disabled={saving || Object.keys(validationErrors).length > 0}
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

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${validationErrors.first_name ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="John"
                      disabled={saving}
                    />
                    {validationErrors.first_name && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="john@example.com"
                      disabled={saving}
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="+1 (555) 123-4567"
                      disabled={saving}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="San Francisco, CA"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself, your experience, and your career goals..."
                    disabled={saving}
                  />
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-300 hover:text-white"
                          disabled={saving}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a skill (e.g., React, Python, AWS)"
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center"
                      disabled={saving}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Website/Portfolio</label>
                    <input
                      type="url"
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${validationErrors.portfolio_url ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="https://yourportfolio.com"
                      disabled={saving}
                    />
                    {validationErrors.portfolio_url && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.portfolio_url}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub</label>
                    <input
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Resume URL</label>
                    <input
                      type="url"
                      name="resume_url"
                      value={formData.resume_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourresume.com"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Experience Section in Edit Mode */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Work Experience</h3>
                  <div className="space-y-4">
                    {formData.work_experience.map((exp, index) => (
                      <div key={exp.id || index} className="bg-gray-800/50 p-4 rounded-xl">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-white">{exp.title}</h4>
                            <p className="text-blue-400">{exp.company}</p>
                            <p className="text-gray-400 text-sm">
                              {formatDateForDisplay(exp.start_date)} - {exp.is_current ? 'Present' : formatDateForDisplay(exp.end_date)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add New Experience Form */}
                  <div className="mt-6 p-4 border border-dashed border-gray-700 rounded-xl">
                    <h4 className="font-medium text-white mb-4">Add New Experience</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="title"
                        value={newExperience.title}
                        onChange={handleExperienceChange}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                        placeholder="Job Title"
                      />
                      <input
                        type="text"
                        name="company"
                        value={newExperience.company}
                        onChange={handleExperienceChange}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                        placeholder="Company"
                      />
                      <input
                        type="date"
                        name="start_date"
                        value={newExperience.start_date}
                        onChange={handleExperienceChange}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          name="end_date"
                          value={newExperience.end_date}
                          onChange={handleExperienceChange}
                          disabled={newExperience.is_current}
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_current"
                            checked={newExperience.is_current}
                            onChange={handleExperienceChange}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-400">Current</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="md:col-span-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <>
                {/* Tabs */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                  <div className="flex border-b border-gray-800 overflow-x-auto">
                    {['overview', 'experience', 'education', 'skills', 'contact'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 min-w-24 py-4 font-medium text-sm uppercase tracking-wider transition-all ${activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Bio */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4">About Me</h4>
                          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
                            {formData.bio ? (
                              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {formData.bio}
                              </p>
                            ) : (
                              <div className="text-center py-8">
                                <User className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500">No bio added yet</p>
                                <button 
                                  onClick={() => setEditing(true)}
                                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  + Add Bio
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Experience Preview */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white">Experience</h4>
                            <span className="text-sm text-gray-400">{formData.work_experience.length} positions</span>
                          </div>
                          
                          <div className="space-y-4">
                            {formData.work_experience.slice(0, 3).map((exp, index) => (
                              <div key={exp.id || index} className="bg-gray-900/30 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{exp.title}</h5>
                                    <p className="text-blue-400">{exp.company}</p>
                                    <div className="flex items-center text-gray-400 text-sm mt-2">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDateForDisplay(exp.start_date)} - {exp.is_current ? 'Present' : formatDateForDisplay(exp.end_date)}
                                      {exp.location && <span className="ml-2">• {exp.location}</span>}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                                </div>
                                {exp.description && (
                                  <p className="text-gray-300 mt-3 text-sm">{exp.description}</p>
                                )}
                              </div>
                            ))}
                            
                            {formData.work_experience.length === 0 && (
                              <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-xl">
                                <Briefcase className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500">No experience added yet</p>
                                <button 
                                  onClick={() => setEditing(true)}
                                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  + Add Experience
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'experience' && (
                      <ExperienceTab 
                        formData={formData}
                        formatDateForDisplay={formatDateForDisplay}
                        onAddExperience={handleAddExperience}
                        onEditExperience={handleEditExperience}
                        onDeleteExperience={handleDeleteExperience}
                        formatDateForInput={formatDateForInput}
                      />
                    )}

                    {activeTab === 'education' && (
                      <EducationTab 
                        formData={formData} 
                        formatDateForDisplay={formatDateForDisplay}
                        formatDateForInput={formatDateForInput}
                        onAddEducation={handleAddEducation}
                      />
                    )}
                    
                    {activeTab === 'skills' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h5 className="text-lg font-bold text-white">Skills & Expertise</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">{formData.skills.length} skills</span>
                            <button 
                              onClick={() => setEditing(true)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                            >
                              + Add Skill
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl text-lg font-medium text-gray-300 hover:border-blue-500/50 transition-all group cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <span>{skill}</span>
                                <button 
                                  onClick={() => removeSkill(skill)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'contact' && (
                      <div className="space-y-6">
                        <h5 className="text-lg font-bold text-white">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-start text-gray-300">
                              <Mail className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p>{formData.email || 'Not set'}</p>
                              </div>
                            </div>
                            {formData.phone && (
                              <div className="flex items-start text-gray-300">
                                <Phone className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-400">Phone</p>
                                  <p>{formData.phone}</p>
                                </div>
                              </div>
                            )}
                            {formData.location && (
                              <div className="flex items-start text-gray-300">
                                <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-400">Location</p>
                                  <p>{formData.location}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {formData.portfolio_url && (
                              <div className="flex items-start text-gray-300">
                                <Globe className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-400">Website/Portfolio</p>
                                  <a href={formData.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                                    {formData.portfolio_url}
                                  </a>
                                </div>
                              </div>
                            )}
                            {formData.linkedin_url && (
                              <div className="flex items-start text-gray-300">
                                <Linkedin className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-400">LinkedIn</p>
                                  <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                                    LinkedIn Profile
                                  </a>
                                </div>
                              </div>
                            )}
                            {formData.github_url && (
                              <div className="flex items-start text-gray-300">
                                <Github className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-400">GitHub</p>
                                  <a href={formData.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                                    GitHub Profile
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                  <h4 className="text-xl font-bold text-white mb-6">Recent Activity</h4>
                  
                  <div className="space-y-4">
                    {realTimeUpdates.length > 0 ? (
                      realTimeUpdates.map((update, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-800">
                          <div className="flex items-center">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                            <span className="text-gray-300">{update.message}</span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Zap className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setEditing(!editing)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all z-50"
      >
        {editing ? <Save className="h-6 w-6" /> : <Edit className="h-6 w-6" />}
      </button>

      <input
        ref={avatarInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files?.[0])}
      />

      {/* Test Button (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={async () => {
            console.log('🧪 Testing API connection...');
            console.log('Form Data:', formData);
            console.log('Cache:', CacheManager.get());
            console.log('Pending Changes:', ChangeQueue.getQueue());
            
            try {
              const response = await userAPI.getProfile();
              console.log('✅ API Response:', response.data);
              alert('API is working! Check console for details.');
            } catch (error) {
              console.error('❌ API Error:', error);
              alert('API error: ' + error.message);
            }
          }}
          className="fixed top-4 right-4 bg-purple-600 text-white p-2 rounded z-50"
        >
          🧪 Test
        </button>
      )}
    </div>
  );
}

// Experience Modal Component
const ExperienceModal = ({ 
  isOpen, 
  onClose, 
  experience = null,
  onSave,
  formatDateForInput,
  formatDateForDisplay
}) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    skills: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || '',
        company: experience.company || '',
        location: experience.location || '',
        start_date: formatDateForInput(experience.start_date) || '',
        end_date: experience.is_current ? '' : (formatDateForInput(experience.end_date) || ''),
        is_current: !!experience.is_current,
        description: experience.description || '',
        skills: experience.skills || []
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        skills: []
      });
    }
    setErrors({});
  }, [experience, isOpen, formatDateForInput]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.is_current && !formData.end_date) {
      newErrors.end_date = 'End date is required if not current';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: experience?.id || Date.now().toString()
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {experience ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. Senior Developer"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    errors.company ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-400">{errors.company}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. New York, NY"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`px-3 py-2 bg-gray-700 border ${
                    errors.start_date ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.start_date}</p>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    End Date {!formData.is_current && '*'}
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_current"
                      checked={formData.is_current}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-300">I currently work here</span>
                  </label>
                </div>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={formData.is_current}
                  className={`px-3 py-2 bg-gray-700 border ${
                    !formData.is_current && errors.end_date ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.is_current ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {!formData.is_current && errors.end_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.end_date}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your role and responsibilities"
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {experience ? 'Update' : 'Save'} Experience
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Experience Tab Component
const ExperienceTab = ({ 
  formData, 
  formatDateForDisplay, 
  formatDateForInput,
  onAddExperience, 
  onEditExperience, 
  onDeleteExperience 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleAddNew = () => {
    setEditingExperience(null);
    setShowModal(true);
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setShowModal(true);
  };

  const handleSave = (experience) => {
    if (editingExperience) {
      onEditExperience(experience);
    } else {
      onAddExperience(experience);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-bold text-white">Professional Experience</h5>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </button>
      </div>
      
      <div className="space-y-4">
        {formData.work_experience.map((exp, index) => (
          <div key={exp.id || index} className="bg-gray-900/30 rounded-xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h6 className="font-bold text-white text-xl">{exp.title}</h6>
                <p className="text-blue-400 text-lg">{exp.company}</p>
                {exp.location && (
                  <p className="text-gray-400 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" /> {exp.location}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(exp)}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                </button>
                <button 
                  onClick={() => onDeleteExperience(exp.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center text-gray-400 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDateForDisplay(exp.start_date)} - {exp.is_current ? 'Present' : formatDateForDisplay(exp.end_date)}</span>
              {exp.is_current && (
                <span className="ml-3 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Current</span>
              )}
            </div>
            
            {exp.description && (
              <p className="text-gray-300 mb-4">{exp.description}</p>
            )}
            
            {exp.skills && exp.skills.length > 0 && (
              <div className="mt-4">
                <h6 className="text-sm font-semibold text-gray-400 mb-2">Skills used:</h6>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      
        {formData.work_experience.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h6 className="text-lg font-semibold text-gray-400 mb-2">No Experience Added</h6>
            <p className="text-gray-500 mb-4">Add your work experience to showcase your career journey</p>
            <button 
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Your First Experience
            </button>
          </div>
        )}
      
        <ExperienceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          experience={editingExperience}
          onSave={handleSave}
          formatDateForInput={formatDateForInput}
          formatDateForDisplay={formatDateForDisplay}
        />
      </div>
    </div>
  );
};

// Education Modal Component
const EducationModal = ({ 
  isOpen, 
  onClose, 
  education = null,
  onSave,
  formatDateForInput,
  formatDateForDisplay
}) => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    grade: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || '',
        degree: education.degree || '',
        field_of_study: education.field_of_study || '',
        start_date: formatDateForInput(education.start_date) || '',
        end_date: education.is_current ? '' : (formatDateForInput(education.end_date) || ''),
        is_current: !!education.is_current,
        description: education.description || '',
        grade: education.grade || ''
      });
    } else {
      setFormData({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        grade: ''
      });
    }
    setErrors({});
  }, [education, isOpen, formatDateForInput]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.institution.trim()) newErrors.institution = 'Institution name is required';
    if (!formData.degree) newErrors.degree = 'Degree level is required';
    if (!formData.field_of_study.trim()) newErrors.field_of_study = 'Field of study is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.is_current && !formData.end_date) {
      newErrors.end_date = 'End date is required if not current';
    }
    if (formData.grade && (isNaN(formData.grade) || formData.grade < 0 || formData.grade > 4)) {
      newErrors.grade = 'Grade must be between 0 and 4';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: education?.id || Date.now().toString(),
        grade: formData.grade ? parseFloat(formData.grade) : null
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {education ? 'Edit Education' : 'Add Education'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    errors.institution ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. University of Technology"
                />
                {errors.institution && (
                  <p className="mt-1 text-sm text-red-400">{errors.institution}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Degree Level *
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    errors.degree ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select degree</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate's Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">Doctorate (PhD)</option>
                  <option value="Professional">Professional Degree</option>
                  <option value="Other">Other</option>
                </select>
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-400">{errors.degree}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Field of Study *
                </label>
                <input
                  type="text"
                  name="field_of_study"
                  value={formData.field_of_study}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    errors.field_of_study ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. Computer Science"
                />
                {errors.field_of_study && (
                  <p className="mt-1 text-sm text-red-400">{errors.field_of_study}</p>
                )}
              </div>
              
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Grade (Optional)
                  </label>
                  <input
                    type="number"
                    name="grade"
                    min="0"
                    max="4"
                    step="0.1"
                    value={formData.grade}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${
                      errors.grade ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. 3.5"
                  />
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-400">{errors.grade}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Scale: 4.0
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`px-3 py-2 bg-gray-700 border ${
                    errors.start_date ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.start_date}</p>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    End Date {!formData.is_current && '*'}
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_current"
                      checked={formData.is_current}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-300">Currently attending</span>
                  </label>
                </div>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={formData.is_current}
                  className={`px-3 py-2 bg-gray-700 border ${
                    !formData.is_current && errors.end_date ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.is_current ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {!formData.is_current && errors.end_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.end_date}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional information about your education"
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {education ? 'Update' : 'Save'} Education
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Education Tab Component
const EducationTab = ({ formData, formatDateForDisplay, formatDateForInput, onAddEducation }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const handleAddNew = () => {
    setEditingEducation(null);
    setShowModal(true);
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setShowModal(true);
  };

  const handleSave = (education) => {
    if (editingEducation) {
      // Update existing
      console.log('Updating education:', education);
    } else {
      onAddEducation(education);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-bold text-white">Education</h5>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.education.map((edu, index) => (
          <div key={edu.id || index} className="bg-gray-900/30 rounded-xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h6 className="font-bold text-white text-lg">{edu.institution}</h6>
                <p className="text-blue-400">{edu.degree} in {edu.field_of_study}</p>
                {edu.grade && (
                  <p className="text-gray-400 text-sm">GPA: <span className="font-semibold text-white">{edu.grade}</span></p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(edu)}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDateForDisplay(edu.start_date)} - {edu.is_current ? 'Present' : formatDateForDisplay(edu.end_date)}</span>
              </div>
              {edu.description && (
                <p className="text-gray-300 text-sm mt-2">{edu.description}</p>
              )}
            </div>
          </div>
        ))}
        
        {formData.education.length === 0 && (
          <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <GraduationCap className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h6 className="text-lg font-semibold text-gray-400 mb-2">No Education Added</h6>
            <p className="text-gray-500 mb-4">Add your educational background to complete your profile</p>
            <button 
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Your First Education
            </button>
          </div>
        )}
      </div>
      
      <EducationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        education={editingEducation}
        onSave={handleSave}
        formatDateForInput={formatDateForInput}
        formatDateForDisplay={formatDateForDisplay}
      />
    </div>
  );
};