interface SignupSourceListProps {
  data: Array<{ source: string; count: number }>;
  total: number;
}

export function SignupSourceList({ data, total }: SignupSourceListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">How Users Found Us</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.source} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{item.source || 'Not specified'}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{percentage}%</span>
                <span className="text-sm text-gray-500">({item.count} users)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
