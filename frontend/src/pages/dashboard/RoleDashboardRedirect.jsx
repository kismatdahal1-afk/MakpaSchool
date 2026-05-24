import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const RoleDashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleRouteMap = {
    admin: "/dashboard/admin",
    teacher: "/dashboard/teacher",
    student: "/dashboard/student",
  };

  return <Navigate to={roleRouteMap[user.role] || "/"} replace />;
};

export default RoleDashboardRedirect;
