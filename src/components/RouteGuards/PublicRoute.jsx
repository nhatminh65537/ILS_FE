import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PERMISSIONS } from '../../constants/permissions';
import { hasPermission } from '../../store/myUserSlice';

/**
 * PublicRoute component for login/register pages
 * Redirects authenticated users to home or the original page they tried to access
 */
const PublicRoute = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  const canAddPermission = useSelector(state => 
        hasPermission(state, PERMISSIONS.Users.AddPermission) ||
        hasPermission(state, PERMISSIONS.Roles.AddPermission)
  );
  
  // Check if we have a saved location to redirect to
  const from = location.state?.from || '/';

  if (isAuthenticated && from === '/permissions' && !canAddPermission) {
    return <Navigate to="/"/>;
  }

  return isAuthenticated ? 
    <Navigate to={from} replace /> : 
    <Outlet />;
};

export default PublicRoute;
