import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

interface StudyControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onReveal: () => void;
  isRevealed: boolean;
}

const secondaryButtonClass = "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
const primaryButtonClass = "flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

export default function StudyControls({ onPrev, onNext, onReveal, isRevealed }: StudyControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        className={secondaryButtonClass}
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      <button
        type="button"
        onClick={onReveal}
        className={primaryButtonClass}
      >
        {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {isRevealed ? "Hide Answer" : "Reveal Answer"}
      </button>

      <button
        type="button"
        onClick={onNext}
        className={secondaryButtonClass}
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
