import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ReadinessMeterProps {
  percentage: number;
  totalStudents: number;
  readyStudents: number;
}

export default function ReadinessMeter({ percentage, totalStudents, readyStudents }: ReadinessMeterProps) {
  const data = [
    { name: 'Ready', value: percentage },
    { name: 'Not Ready', value: 100 - percentage }
  ];

  const getColor = (pct: number) => {
    if (pct >= 80) return '#10b981';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const mainColor = getColor(percentage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Class Readiness</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">Students with purity score &ge; 1.8 (excellent)</p>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={mainColor} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-bold" style={{ color: mainColor }}>
            {Math.round(percentage)}%
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {readyStudents} of {totalStudents} students
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mainColor }}></div>
          <span className="text-xs text-gray-600">Ready ({readyStudents})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span className="text-xs text-gray-600">In Progress ({totalStudents - readyStudents})</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Threshold: 1.8 purity (A260/280)</span>
          <span className={percentage >= 80 ? 'text-green-600 font-medium' : percentage >= 50 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
            {percentage >= 80 ? 'Excellent' : percentage >= 50 ? 'Moderate' : 'Needs Attention'}
          </span>
        </div>
      </div>
    </div>
  );
}
