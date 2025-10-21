import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authentication";
import { LandingPage } from "./pages/LandingPage";
import { ViewPostPage } from "./pages/ViewPostPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignUpPage";
import { AdminArticleManagement } from "./pages/admin/AdminArticleManagement";
import AdminArticleCreate from "./pages/admin/AdminArticleCreate";
import { AdminCategoryManagement } from "./pages/admin/AdminCategoryManagement";
import AdminCategoryCreate from "./pages/admin/AdminCategoryCreate";
import AdminCategoryEdit from "./pages/admin/AdminCategoryEdit";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { AdminNotification } from "./pages/admin/AdminNotification";
import { AdminResetPassword } from "./pages/admin/AdminResetPassword";
import { RegistSuccess } from "./pages/auth/RegistSuccessPage";
import AdminArticleEdit from "./pages/admin/AdminArticleEdit";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import ProfilePage from "./pages/user/ProfilePage";
import ResetPasswordPage from "./pages/user/ResetPassword";

function App() {
  const { isAuthenticated, state } = useAuth();

  return (
    <Routes>
      {/* เส้นทางสาธารณะที่ทุกคนเข้าถึงได้ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/post/:postId" element={<ViewPostPage />} />

      {/* เส้นทางที่เฉพาะผู้ที่ยังไม่ล็อกอินเข้าถึงได้ */}
      <Route
        path="/login"
        element={
          <AuthenticationRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
          >
            <LoginPage />
          </AuthenticationRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <AuthenticationRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
          >
            <SignupPage />
          </AuthenticationRoute>
        }
      />

      {/* user */}
      <Route
        path="/registration-success"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="user"
          >
            <RegistSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="user"
          >
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/reset-password"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="user"
          >
            <ResetPasswordPage />
          </ProtectedRoute>
        }
      />

      {/* admin */}
      <Route
        path="/admin/article-management"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminArticleManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/article-management/create"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminArticleCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/article-management/edit/:articleId"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminArticleEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category-management"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminCategoryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category-management/create"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminCategoryCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category-management/edit/:categoryId"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminCategoryEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminNotification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reset-password"
        element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminResetPassword />
          </ProtectedRoute>
        }
      />

      {/* not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
