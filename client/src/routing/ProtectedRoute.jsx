import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
