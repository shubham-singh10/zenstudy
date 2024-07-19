
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  
  const isAuthenticated = !!Cookies.get('access_tokennew');
  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
