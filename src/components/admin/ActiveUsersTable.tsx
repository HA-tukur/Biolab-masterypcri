interface ActiveUser {
  full_name: string;
  university: string;
  sim_count: number;
  last_active: string;
}

interface ActiveUsersTableProps {
  data: ActiveUser[];
}

export function ActiveUsersTable({ data }: ActiveUsersTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 20 Active Users</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">University</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Simulations</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="py-3 px-4 text-sm text-gray-900">{user.full_name || 'Anonymous'}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.university || 'Not specified'}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.sim_count}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.last_active)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
