export default function ProgressCard() {
  return (
    <div className="bg-blue-50 rounded-2xl p-5 border">

      <p className="text-blue-600 text-sm font-semibold mb-4">
        YOUR PROGRESS
      </p>

      <div className="flex justify-between items-center">
        
        <div>
          <p className="text-2xl font-bold">124</p>
          <p className="text-gray-500 text-sm">Cards Learned</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-2xl font-bold">88%</p>
          <p className="text-gray-500 text-sm">Accuracy</p>
        </div>

      </div>
    </div>
  );
}