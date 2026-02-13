import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import Header from './components/Header';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { VerificationPending } from './components/auth/VerificationPending';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { Homepage } from './components/Homepage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InstructorRequestsAdmin } from './components/admin/InstructorRequestsAdmin';
import { Dashboard } from './components/Dashboard';

const App = lazy(() => import('./App'));
const InstructorSetup = lazy(() => import('./components/InstructorSetup').then(m => ({ default: m.InstructorSetup })));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <>
      {!isAuthPage && !isAdminPage && !isDashboardPage && <Header />}
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/verify-email" element={<VerificationPending />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/lab" element={<ProtectedRoute allowGuestTrial={true}><App /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/instructor/setup" element={<InstructorSetup />} />
          <Route path="/instructor/:code" element={<InstructorDashboard />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/requests" element={<AdminRoute><InstructorRequestsAdmin /></AdminRoute>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}