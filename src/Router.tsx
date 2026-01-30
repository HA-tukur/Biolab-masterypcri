import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

const App = lazy(() => import('./App'));
const InstructorSetup = lazy(() => import('./components/InstructorSetup').then(m => ({ default: m.InstructorSetup })));
const InstructorDashboard = lazy(() => import('./components/InstructorDashboard').then(m => ({ default: m.InstructorDashboard })));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/instructor/setup" element={<InstructorSetup />} />
          <Route path="/instructor/:code" element={<InstructorDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}