import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/authentication'
import { LandingPage } from './pages/LandingPage'
import { ViewPostPage } from './pages/ViewPostPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignUpPage'
import { AdminArticleManagement } from './pages/admin/AdminArticleManagement'
import AdminArticleCreate from './pages/admin/AdminArticleCreate'
import { AdminCategoryManagement } from './pages/admin/AdminCategoryManagement'
import { AdminProfile } from './pages/admin/AdminProfile'
import { AdminNotification } from './pages/admin/AdminNotification'
import { AdminResetPassword } from './pages/admin/AdminResetPassword'
import AdminArticleEdit from './pages/admin/AdminArticleEdit'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          {/* admin */}
          <Route path="/admin/article-management" element={<AdminArticleManagement />} />
          <Route path="/admin/article-management/create" element={<AdminArticleCreate />} />
          <Route path="/admin/article-management/edit/:articleId" element={<AdminArticleEdit />} />
          <Route path="/admin/category-management" element={<AdminCategoryManagement />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/notifications" element={<AdminNotification />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          {/* not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App