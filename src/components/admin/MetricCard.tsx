import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function MetricCard({ title, value, subtitle, trend, trendValue }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 text-sm">
          {trend && trendValue && (
            <span className={`flex items-center gap-1 ${
              trend === 'up' ? 'text-emerald-600' :
              trend === 'down' ? 'text-rose-600' :
              'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-gray-600">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
