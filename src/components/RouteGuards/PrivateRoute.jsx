import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * PrivateRoute component for protecting routes that require authentication
 * It redirects unauthenticated users to the login page and preserves the intended destination
 */
const PrivateRoute = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? 
    <Outlet /> : 
    <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;
