import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgramChartProps {
  data: Array<{ program: string; count: number }>;
}

export function ProgramChart({ data }: ProgramChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by Program/Department (Top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
          <XAxis
            type="number"
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="program"
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            width={95}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <Bar dataKey="count" fill="#2D7A6E" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
