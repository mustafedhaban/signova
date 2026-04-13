import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import LoginPage from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import RegisterPage from '@/pages/Register';
import ForgotPasswordPage from '@/pages/ForgotPassword';
import ResetPasswordPage from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import Builder from '@/pages/Builder';
import Settings from '@/pages/Settings';
import OrganizationSettings from '@/pages/OrganizationSettings';
import SharedSignature from '@/pages/SharedSignature';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/shared/:token" element={<SharedSignature />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/organizations" element={<OrganizationSettings />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
