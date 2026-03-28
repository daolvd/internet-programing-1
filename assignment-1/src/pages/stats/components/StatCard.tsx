interface Stat {
  icon: React.ComponentType<{ className: string }>;
  change: string;
  title: string;
  value: string | number;
}

export default function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  const isPositive = stat.change.includes("+");
  const isNegative = stat.change.includes("-");

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">

      <div className="flex justify-between items-start">

        {/* ICON */}
        <div className="p-3 rounded-lg bg-gray-100">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>

        {/* CHANGE */}
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
          }`}
        >
          {stat.change}
        </span>

      </div>

      <p className="text-gray-500 mt-3 text-sm">
        {stat.title}
      </p>

      <p className="text-xl font-bold mt-1">
        {stat.value}
      </p>

    </div>
  );
}