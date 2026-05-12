import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from 'next-themes';

// Lazy load pages for performance
const LoginPage = lazy(() => import('@/pages/Login'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Builder = lazy(() => import('@/pages/Builder'));
const Settings = lazy(() => import('@/pages/Settings'));
const OrganizationSettings = lazy(() => import('@/pages/OrganizationSettings'));
const SharedSignature = lazy(() => import('@/pages/SharedSignature'));

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Loading Signova...</p>
            </div>
          </div>
        }>
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
        </Suspense>
      </div>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
