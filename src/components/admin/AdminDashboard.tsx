import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from './MetricCard';
import { SignupsChart } from './SignupsChart';
import { UniversityChart } from './UniversityChart';
import { ProgramChart } from './ProgramChart';
import { SignupSourceList } from './SignupSourceList';
import { ActiveUsersTable } from './ActiveUsersTable';

const ADMIN_EMAIL = 'brianidoko27@gmail.com';

interface DashboardData {
  totalUsers: number;
  activeThisMonth: number;
  avgSimulations: number;
  completionRate: number;
  signupsData: Array<{ date: string; count: number }>;
  universityData: Array<{ university: string; count: number }>;
  programData: Array<{ program: string; count: number }>;
  sourceData: Array<{ source: string; count: number }>;
  activeUsers: Array<{
    full_name: string;
    university: string;
    sim_count: number;
    last_active: string;
  }>;
  monthlyGrowth: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, navigate, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', thirtyDaysAgo.toISOString());

      const { data: labResults } = await supabase
        .from('lab_results')
        .select('student_id, status');

      const totalSimulations = labResults?.length || 0;
      const avgSimulations = totalUsers ? (totalSimulations / totalUsers).toFixed(1) : '0.0';

      const completedSimulations = labResults?.filter(r =>
        r.status && r.status.toLowerCase().includes('mastery')
      ).length || 0;
      const completionRate = totalSimulations > 0
        ? Math.round((completedSimulations / totalSimulations) * 100)
        : 0;

      const rangeDate = new Date();
      rangeDate.setDate(rangeDate.getDate() - dateRange);

      const { data: recentSignups } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', rangeDate.toISOString())
        .order('created_at', { ascending: true });

      const signupsByDate: Record<string, number> = {};
      recentSignups?.forEach(profile => {
        const date = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        signupsByDate[date] = (signupsByDate[date] || 0) + 1;
      });

      const signupsData = Object.entries(signupsByDate).map(([date, count]) => ({
        date,
        count
      }));

      const { data: universities } = await supabase
        .from('profiles')
        .select('university');

      const universityCounts: Record<string, number> = {};
      universities?.forEach(p => {
        const uni = p.university || 'Not specified';
        universityCounts[uni] = (universityCounts[uni] || 0) + 1;
      });

      const universityData = Object.entries(universityCounts)
        .map(([university, count]) => ({ university, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const { data: programs } = await supabase
        .from('profiles')
        .select('program_department');

      const programCounts: Record<string, number> = {};
      programs?.forEach(p => {
        const prog = p.program_department || 'Not specified';
        programCounts[prog] = (programCounts[prog] || 0) + 1;
      });

      const programData = Object.entries(programCounts)
        .map(([program, count]) => ({ program, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const { data: sources } = await supabase
        .from('profiles')
        .select('referral_source');

      const sourceCounts: Record<string, number> = {};
      sources?.forEach(p => {
        const source = p.referral_source || 'Not specified';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const sourceData = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, university');

      const { data: allLabResults } = await supabase
        .from('lab_results')
        .select('student_id, created_at');

      const userSimulations: Record<string, { count: number; lastActive: string }> = {};

      allLabResults?.forEach(result => {
        if (result.student_id) {
          if (!userSimulations[result.student_id]) {
            userSimulations[result.student_id] = { count: 0, lastActive: result.created_at };
          }
          userSimulations[result.student_id].count += 1;
          if (new Date(result.created_at) > new Date(userSimulations[result.student_id].lastActive)) {
            userSimulations[result.student_id].lastActive = result.created_at;
          }
        }
      });

      const activeUsers = allProfiles
        ?.map(profile => ({
          full_name: profile.full_name,
          university: profile.university,
          sim_count: userSimulations[profile.id]?.count || 0,
          last_active: userSimulations[profile.id]?.lastActive || ''
        }))
        .sort((a, b) => b.sim_count - a.sim_count)
        .slice(0, 20) || [];

      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString());

      const monthlyGrowth = lastMonthUsers || 0;

      setData({
        totalUsers: totalUsers || 0,
        activeThisMonth: activeThisMonth || 0,
        avgSimulations: parseFloat(avgSimulations),
        completionRate,
        signupsData,
        universityData,
        programData,
        sourceData,
        activeUsers,
        monthlyGrowth
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const activePercentage = data.totalUsers > 0
    ? Math.round((data.activeThisMonth / data.totalUsers) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BioSim Analytics</h1>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value) as 7 | 30 | 90)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Registered Users"
            value={data.totalUsers}
            trend="up"
            trendValue={`+${data.monthlyGrowth} this month`}
          />
          <MetricCard
            title="Active Users (30 days)"
            value={data.activeThisMonth}
            subtitle={`${activePercentage}% of total`}
          />
          <MetricCard
            title="Avg Simulations per User"
            value={data.avgSimulations}
          />
          <MetricCard
            title="Simulation Completion Rate"
            value={`${data.completionRate}%`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SignupsChart data={data.signupsData} />
          <SignupSourceList data={data.sourceData} total={data.totalUsers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UniversityChart data={data.universityData} />
          <ProgramChart data={data.programData} />
        </div>

        <div className="mb-6">
          <ActiveUsersTable data={data.activeUsers} />
        </div>
      </div>
    </div>
  );
}
