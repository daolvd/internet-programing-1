import { ArrowLeft, ArrowRight, Eye } from "lucide-react";

export default function StudyControls({ onPrev, onNext, onReveal }: { onPrev: () => void; onNext: () => void; onReveal: () => void }) {
  return (
    <div className="flex items-center gap-4">

      <button
        onClick={onPrev}
        className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </button>

      <button
        onClick={onReveal}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Reveal Answer
      </button>

      <button
        onClick={onNext}
        className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
}