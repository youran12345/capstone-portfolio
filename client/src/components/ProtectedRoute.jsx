import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards a route: unauthenticated visitors are redirected to /login.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
