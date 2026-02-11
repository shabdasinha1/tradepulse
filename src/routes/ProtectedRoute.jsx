import { Navigate } from "react-router-dom";
import { IsAuthenticated } from "../utils/AuthHelper.jsx";

const ProtectedRoute = ({ children }) => {
  if (!IsAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
