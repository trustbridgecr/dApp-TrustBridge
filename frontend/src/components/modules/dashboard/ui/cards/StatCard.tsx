interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  badge?: string;
  icon: string;
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
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
  onClick,
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
          type === "positive" ? "text-green-500" : "text-red-500"
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
    <div
      className={`relative group transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            {badge && (
              <span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                {badge}
              </span>
            )}
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <i className={`${icon} text-gray-500 dark:text-gray-400 text-sm`}></i>
            </div>
          </div>
        </div>

        {/* Value and Change */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300">
              {formatValue(value)}
            </span>
            {change && changeType && formatChange(change, changeType)}
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            {subtitle}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        {/* Hover Content */}
        {hoverContent && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-xs">
              {hoverContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
