import { Navigate } from "react-router-dom";
import { isAdminUser } from "../utils/AdminHelper.jsx";

const AdminRoute = ({ children }) => {
  if (!isAdminUser()) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

export default AdminRoute;