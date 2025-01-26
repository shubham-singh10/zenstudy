import { Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <div>Loading...</div>
  }
  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
