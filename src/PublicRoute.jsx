import { Navigate } from "react-router-dom";
import { useAuth } from "./context/auth-context";
import Loading from "./Loading";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;