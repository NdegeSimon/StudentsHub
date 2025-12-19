import { authAPI } from './api';
import { toast } from 'react-toastify';

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (navigate) {
    navigate('/login');
  }
};

// Check user role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

// Verify token with backend
export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await authAPI.getCurrentUser();
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return true;
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    logout();
  }
  return false;
};

// Protected route wrapper
export const withAuth = (Component, roles = []) => {
  return (props) => {
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const isAuth = await verifyToken();
        
        if (!isAuth) {
          toast.error('Please log in to access this page');
          navigate('/login', { state: { from: props.location } });
          return;
        }

        const user = getCurrentUser();
        if (roles.length > 0 && !roles.includes(user.role)) {
          toast.error('You do not have permission to access this page');
          navigate('/unauthorized');
          return;
        }

        setVerified(true);
        setLoading(false);
      };

      checkAuth();
    }, [navigate, props.location]);

    if (loading) {
      return <div>Loading...</div>; // Or your custom loading component
    }

    return verified ? <Component {...props} /> : null;
  };
};
