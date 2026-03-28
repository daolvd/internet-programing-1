import { useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNotification } from "../../../components/common/NotificationProvider";
import { ANSWER_FEEDBACK, LEARN_ACTION } from "../../../constants/learn";
import { useLearnSession } from "../../../hook/LearnHook";
import type { Card } from "../../../types/Card";
import type { CardReviewRating } from "../../../types/CardReview";

interface LearnCardPanelProps {
  cards: Card[];
  onQueueSizeChange?: (size: number) => void;
  onProgressChange?: (current: number, total: number) => void;
  onReview?: (review: {
    cardId: number;
    deckId: number;
    isCorrect: boolean;
    rating: CardReviewRating;
    responseTimeMs: number;
  }) => void;
  onReviewAgain?: () => void;
}

export default function LearnCardPanel({ cards, onQueueSizeChange, onProgressChange, onReview, onReviewAgain }: LearnCardPanelProps) {
  const { notify } = useNotification();
  const {
    learnQueue,
    learnIndex,
    currentLearnCard,
    learnAnswerInput,
    setLearnAnswerInput,
    learnChoice,
    setLearnChoice,
    showAnswer,
    setShowAnswer,
    isFlipping,
    answerFeedback,
    handlePrevious,
    handleNext,
    handleAnswerEnter,
    handleReviewAgain,
  } = useLearnSession({ cards, notify, onQueueSizeChange, onProgressChange, onReview });

  const isCorrectFeedback = useMemo(
    () => answerFeedback === ANSWER_FEEDBACK.CORRECT,
    [answerFeedback]
  );

  return (
    <div
      className="w-full max-w-3xl mt-6 bg-white rounded-2xl shadow-lg border p-6 space-y-4 perspective transform-style transition-transform duration-300"
      style={{
        transform: isFlipping ? "rotateY(12deg) scale(0.99)" : "rotateY(0deg) scale(1)",
      }}
    >
      {currentLearnCard ? (
        <>
          <div>
            <p className="text-xs text-gray-400">
              Card {learnIndex + 1} / {learnQueue.length}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest text-gray-400 mb-2">QUESTION</p>
            <p className="text-lg font-semibold text-gray-800">{currentLearnCard.question}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs tracking-widest text-gray-400">ANSWER</p>
              <button
                type="button"
                onClick={() => setShowAnswer((prev) => !prev)}
                className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                {showAnswer ? "Hide" : "Reveal"}
              </button>
            </div>
            {showAnswer ? (
              <p className="text-lg font-medium text-blue-600">{currentLearnCard.answer}</p>
            ) : (
              <p className="text-sm text-gray-400">Answer is hidden. Click Reveal Answer.</p>
            )}
          </div>

          <div>
            <label className="text-xs tracking-widest text-gray-400">YOUR ANSWER</label>
            <input
              type="text"
              value={learnAnswerInput}
              onChange={(event) => {
                setLearnAnswerInput(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAnswerEnter();
                }
              }}
              className="w-full mt-2 p-3 border rounded-lg bg-gray-50"
              placeholder="Type your answer to verify Easy"
            />
            {answerFeedback && (
              <p
                className={`mt-2 text-sm font-medium ${
                  isCorrectFeedback ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrectFeedback ? "Correct" : "Incorrect"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-green-700 cursor-pointer">
              <input
                type="checkbox"
                checked={learnChoice === LEARN_ACTION.EASY}
                onChange={(event) => {
                  setLearnChoice(event.target.checked ? LEARN_ACTION.EASY : "");
                }}
              />
              Easy
            </label>

            <label className="flex items-center gap-2 text-sm text-blue-700 cursor-pointer">
              <input
                type="checkbox"
                checked={learnChoice === LEARN_ACTION.GOOD}
                onChange={(event) => {
                  setLearnChoice(event.target.checked ? LEARN_ACTION.GOOD : "");
                }}
              />
              Good
            </label>

            <label className="flex items-center gap-2 text-sm text-amber-700 cursor-pointer">
              <input
                type="checkbox"
                checked={learnChoice === LEARN_ACTION.HARD}
                onChange={(event) => {
                  setLearnChoice(event.target.checked ? LEARN_ACTION.HARD : "");
                }}
              />
              Hard
            </label>

            <label className="flex items-center gap-2 text-sm text-red-700 cursor-pointer">
              <input
                type="checkbox"
                checked={learnChoice === LEARN_ACTION.DONT_KNOW}
                onChange={(event) => {
                  setLearnChoice(event.target.checked ? LEARN_ACTION.DONT_KNOW : "");
                }}
              />
              Don&apos;t know
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 text-sm"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg font-semibold text-green-700">Great job!</p>
          <p className="text-sm text-gray-500 mt-1">You have finished all cards in this round.</p>
          <button
            type="button"
            onClick={() => {
              onReviewAgain?.();
              handleReviewAgain();
            }}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
          >
            Review Again
          </button>
        </div>
      )}
    </div>
  );
}
