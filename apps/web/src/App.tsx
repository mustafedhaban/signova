import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from 'next-themes';
import PageLoading from '@/components/PageLoading';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

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
const InstallationGuides = lazy(() => import('@/pages/InstallationGuides'));
const InstallationGuideView = lazy(() => import('@/pages/InstallationGuideView'));

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
      <AuthProvider>
        <div className="min-h-screen w-full bg-background font-sans antialiased text-foreground">
        <Suspense fallback={<PageLoading />}>
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
              <Route path="/guides" element={<InstallationGuides />} />
              <Route path="/guides/:guideId" element={<InstallationGuideView />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
