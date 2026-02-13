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
import { DemoRequestsAdmin } from './components/admin/DemoRequestsAdmin';
import { NewDashboard } from './components/NewDashboard';
import { NewProfile } from './components/NewProfile';
import { NewLeaderboard } from './components/NewLeaderboard';
import { BrowseSimulations } from './components/BrowseSimulations';
import { InstructorPortal } from './components/InstructorPortal';
import { StudentProgressView } from './components/StudentProgressView';
import { InstructorRequestForm } from './components/InstructorRequestForm';
import { BookDemo } from './components/BookDemo';

const App = lazy(() => import('./App'));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboardPage = location.pathname === '/dashboard';
  const isProfilePage = location.pathname === '/profile';
  const isLeaderboardPage = location.pathname === '/leaderboard';
  const isBrowseSimulationsPage = location.pathname === '/browse';
  const isLabPage = location.pathname === '/lab';
  const isInstructorPage = location.pathname.startsWith('/instructor');
  const hasOwnNavigation = isDashboardPage || isProfilePage || isLeaderboardPage || isBrowseSimulationsPage || isLabPage || isInstructorPage;

  return (
    <>
      {!isAuthPage && !isAdminPage && !hasOwnNavigation && <Header />}
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
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/dashboard" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseSimulations /></ProtectedRoute>} />
          <Route path="/lab" element={<ProtectedRoute allowGuestTrial={true}><App /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<NewLeaderboard />} />
          <Route path="/profile" element={<ProtectedRoute><NewProfile /></ProtectedRoute>} />
          <Route path="/instructor/request" element={<ProtectedRoute><InstructorRequestForm /></ProtectedRoute>} />
          <Route path="/instructor/setup" element={<ProtectedRoute><InstructorPortal /></ProtectedRoute>} />
          <Route path="/instructor/class/:classId" element={<ProtectedRoute><StudentProgressView /></ProtectedRoute>} />
          <Route path="/instructor/:code" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/requests" element={<AdminRoute><InstructorRequestsAdmin /></AdminRoute>} />
          <Route path="/admin/demo-requests" element={<AdminRoute><DemoRequestsAdmin /></AdminRoute>} />
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