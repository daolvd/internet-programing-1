export default function ProgressBar({ current, total } : { current: number; total: number }) {
  const percent = (current / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>Geography Mastery</span>
        <span className="text-blue-500 font-medium">
          {current} / {total} Cards
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}