import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ErrorData {
  error: string;
  count: number;
}

interface ErrorAnalyticsChartProps {
  errors: ErrorData[];
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4'];

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export default function ErrorAnalyticsChart({ errors }: ErrorAnalyticsChartProps) {
  const sortedErrors = [...errors].sort((a, b) => b.count - a.count).slice(0, 8);

  if (sortedErrors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Student Errors</h3>
        <p className="text-sm text-gray-500 mb-4">Analysis of protocol mistakes from event logs</p>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No errors recorded yet</p>
            <p className="text-gray-400 text-sm mt-1">Students are following protocols correctly</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = sortedErrors.map(e => ({
    ...e,
    shortError: truncateText(e.error, 30)
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Student Errors</h3>
      <p className="text-sm text-gray-500 mb-4">Top {sortedErrors.length} protocol mistakes from event logs</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="shortError"
              width={150}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ErrorData & { shortError: string };
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
                      <p className="text-sm font-medium text-gray-900 mb-1">Error Details</p>
                      <p className="text-xs text-gray-600 mb-2">{data.error}</p>
                      <p className="text-sm font-bold text-red-600">{data.count} occurrences</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Use this data to identify areas where students need additional guidance</span>
        </div>
      </div>
    </div>
  );
}
