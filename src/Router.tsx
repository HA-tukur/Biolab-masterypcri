import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Header from './components/Header';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { VerificationPending } from './components/auth/VerificationPending';
import { Homepage } from './components/Homepage';

const App = lazy(() => import('./App'));
const InstructorSetup = lazy(() => import('./components/InstructorSetup').then(m => ({ default: m.InstructorSetup })));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/verify-email'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />}
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
          <Route path="/" element={<Homepage />} />
          <Route path="/lab" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/instructor/setup" element={<InstructorSetup />} />
          <Route path="/instructor/:code" element={<InstructorDashboard />} />
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