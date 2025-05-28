import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * PublicRoute component for login/register pages
 * Redirects authenticated users to home or the original page they tried to access
 */
const PublicRoute = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const location = useLocation();
  
  // Check if we have a saved location to redirect to
  const from = location.state?.from || '/';
  
  return isAuthenticated ? 
    <Navigate to={from} replace /> : 
    <Outlet />;
};

export default PublicRoute;
