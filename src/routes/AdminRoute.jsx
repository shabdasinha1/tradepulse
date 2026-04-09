import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/RoleHelper.jsx";

const AdminRoute = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

export default AdminRoute;