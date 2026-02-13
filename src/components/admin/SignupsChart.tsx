import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SignupsChartProps {
  data: Array<{ date: string; count: number }>;
}

export function SignupsChart({ data }: SignupsChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">New Signups - Last 30 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2D7A6E"
            strokeWidth={2}
            dot={{ fill: '#2D7A6E', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
