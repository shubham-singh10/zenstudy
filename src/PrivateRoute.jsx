import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, authenticated, ...rest }) => {
  return authenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
