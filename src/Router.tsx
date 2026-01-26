import { useEffect, useState, lazy, Suspense } from 'react';
import Header from './components/Header';

const App = lazy(() => import('./App'));
const InstructorSetup = lazy(() => import('./components/InstructorSetup').then(m => ({ default: m.InstructorSetup })));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  let content;

  if (currentPath === '/leaderboard') {
    content = <Leaderboard />;
  } else if (currentPath === '/profile') {
    content = <StudentProfile />;
  } else if (currentPath === '/instructor/setup') {
    content = <InstructorSetup />;
  } else if (currentPath.startsWith('/instructor/')) {
    // Temporarily redirect instructor dashboards to setup
    content = <InstructorSetup />;
  } else {
    content = <App />;
  }

  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading...</p>
          </div>
        </div>
      }>
        {content}
      </Suspense>
    </>
  );
}