import { Navigate } from "react-router-dom";
import { IsAuthenticated } from "../utils/AuthHelper.jsx";

const PublicOnlyRoute = ({ children }) => {
  if (IsAuthenticated()) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
