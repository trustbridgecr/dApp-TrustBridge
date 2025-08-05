interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  badge?: string;
  icon: string;
  subtitle?: string;
  loading?: boolean;
  hoverContent?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  badge,
  icon,
  subtitle,
  loading = false,
  hoverContent,
}: StatCardProps) {
  const formatValue = (val: string) => {
    if (loading) return "---";
    return val;
  };

  const formatChange = (changeVal: string, type: "positive" | "negative") => {
    if (loading) return "";
    return (
      <span
        className={`text-sm flex items-center transition-all duration-300 ${
          type === "positive" ? "text-success" : "text-warning"
        }`}
      >
        <i
          className={`fas ${
            type === "positive" ? "fa-arrow-up" : "fa-arrow-down"
          } mr-1`}
        ></i>
        {changeVal}
      </span>
    );
  };

  return (
    <div className="relative group">
      <div className="card stat-card p-5 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-400 text-sm font-medium">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            {badge && (
              <span className="text-success bg-green-900 bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                {badge}
              </span>
            )}
            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <i className={`${icon} text-success text-sm`}></i>
            </div>
          </div>
        </div>

        {/* Value and Change */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold text-white transition-all duration-300">
              {formatValue(value)}
            </span>
            {change && changeType && formatChange(change, changeType)}
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="mt-2 text-xs text-gray-400">
            {subtitle}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-dark-primary rounded-lg flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-600 h-8 w-8"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle Tooltip on Hover */}
        {hoverContent && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20">
            <div className="bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap">
              {hoverContent}
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
