import { useEffect, useState } from 'react';
import App from './App';
import InstructorSetup from './components/InstructorSetup';
import InstructorDashboard from './components/InstructorDashboard';
import StudentProfile from './components/StudentProfile';
import Leaderboard from './components/Leaderboard';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath === '/leaderboard') {
    return <Leaderboard />;
  }

  if (currentPath === '/profile') {
    return <StudentProfile />;
  }

  if (currentPath === '/instructor/setup') {
    return <InstructorSetup />;
  }

  if (currentPath.startsWith('/instructor/')) {
    const classCode = currentPath.split('/instructor/')[1];
    if (classCode && classCode !== 'setup') {
      return <InstructorDashboard classCode={classCode} />;
    }
  }

  return <App />;
}