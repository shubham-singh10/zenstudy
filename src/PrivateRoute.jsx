import { Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import Loading from './Loading';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return <Loading />
  }
  
  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
