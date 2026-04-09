import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const role = useSelector((state) => state.auth.role);

  if (role !== "ADMIN") {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

export default AdminRoute;