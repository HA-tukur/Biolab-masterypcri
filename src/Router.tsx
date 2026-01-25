import { useEffect, useState } from 'react';
import App from './App';
import Header from './components/Header';
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

  let content;

  if (currentPath === '/leaderboard') {
    content = <Leaderboard />;
  } else if (currentPath === '/profile') {
    content = <StudentProfile />;
  } else if (currentPath === '/instructor/setup') {
    content = <InstructorSetup />;
  } else if (currentPath.startsWith('/instructor/')) {
    const classCode = currentPath.split('/instructor/')[1];
    if (classCode && classCode !== 'setup') {
      content = <InstructorDashboard classCode={classCode} />;
    } else {
      content = <App />;
    }
  } else {
    content = <App />;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
}