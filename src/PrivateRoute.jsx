import { Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import Loading from './Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="https://zenstudy.in/sign-In" replace />;
};

export default PrivateRoute;
