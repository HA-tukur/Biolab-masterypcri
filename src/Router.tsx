import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Header from './components/Header';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { VerificationPending } from './components/auth/VerificationPending';

const App = lazy(() => import('./App'));
const InstructorSetup = lazy(() => import('./components/InstructorSetup').then(m => ({ default: m.InstructorSetup })));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
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
            <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/instructor/setup" element={<InstructorSetup />} />
            <Route path="/instructor/:code" element={<InstructorDashboard />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}