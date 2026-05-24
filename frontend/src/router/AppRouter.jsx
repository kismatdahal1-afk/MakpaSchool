import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import RoleRoute from "../components/common/RoleRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import RoleDashboardRedirect from "../pages/dashboard/RoleDashboardRedirect.jsx";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard.jsx";
import StudentDashboard from "../pages/dashboard/student/StudentDashboard.jsx";
import TeacherDashboard from "../pages/dashboard/teacher/TeacherDashboard.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import AboutPage from "../pages/shared/AboutPage.jsx";
import ContactPage from "../pages/shared/ContactPage.jsx";
import NotFoundPage from "../pages/shared/NotFoundPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<RoleDashboardRedirect />} />
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
            <Route path="teacher" element={<TeacherDashboard />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route path="student" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
