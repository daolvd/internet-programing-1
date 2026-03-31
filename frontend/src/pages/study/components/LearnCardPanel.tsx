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

const actionButtonClass = "rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
const choiceBaseClass = "rounded-full border px-3 py-1.5 text-sm font-medium transition duration-150 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.98] cursor-pointer";

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

  const handleNextClick = () => {
    if (learnAnswerInput.trim()) {
      handleAnswerEnter();
      return;
    }

    handleNext();
  };

  const getChoiceClass = (action: typeof LEARN_ACTION[keyof typeof LEARN_ACTION], tone: string) =>
    `${choiceBaseClass} ${learnChoice === action ? tone : "border-gray-200 bg-white text-gray-600"}`;

  return (
    <div
      className="perspective mt-6 w-full max-w-3xl space-y-4 rounded-2xl border bg-white p-6 shadow-lg transform-style transition-transform duration-300"
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
            <p className="mb-2 text-xs tracking-widest text-gray-400">QUESTION</p>
            <p className="text-lg font-semibold text-gray-800">{currentLearnCard.question}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs tracking-widest text-gray-400">ANSWER</p>
              <button
                type="button"
                onClick={() => setShowAnswer((prev) => !prev)}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition duration-150 hover:-translate-y-0.5 hover:bg-blue-200 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
              className="mt-2 w-full rounded-lg border bg-gray-50 p-3"
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

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setLearnChoice((prev) => prev === LEARN_ACTION.EASY ? "" : LEARN_ACTION.EASY)}
              className={getChoiceClass(LEARN_ACTION.EASY, "border-green-200 bg-green-100 text-green-700 shadow-sm")}
              aria-pressed={learnChoice === LEARN_ACTION.EASY}
            >
              Easy
            </button>

            <button
              type="button"
              onClick={() => setLearnChoice((prev) => prev === LEARN_ACTION.GOOD ? "" : LEARN_ACTION.GOOD)}
              className={getChoiceClass(LEARN_ACTION.GOOD, "border-blue-200 bg-blue-100 text-blue-700 shadow-sm")}
              aria-pressed={learnChoice === LEARN_ACTION.GOOD}
            >
              Good
            </button>

            <button
              type="button"
              onClick={() => setLearnChoice((prev) => prev === LEARN_ACTION.HARD ? "" : LEARN_ACTION.HARD)}
              className={getChoiceClass(LEARN_ACTION.HARD, "border-amber-200 bg-amber-100 text-amber-700 shadow-sm")}
              aria-pressed={learnChoice === LEARN_ACTION.HARD}
            >
              Hard
            </button>

            <button
              type="button"
              onClick={() => setLearnChoice((prev) => prev === LEARN_ACTION.DONT_KNOW ? "" : LEARN_ACTION.DONT_KNOW)}
              className={getChoiceClass(LEARN_ACTION.DONT_KNOW, "border-red-200 bg-red-100 text-red-700 shadow-sm")}
              aria-pressed={learnChoice === LEARN_ACTION.DONT_KNOW}
            >
              Don&apos;t know
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrevious}
              className={`${actionButtonClass} flex items-center gap-2 border border-gray-200 bg-white text-gray-700`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className={`${actionButtonClass} flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-offset-2`}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-lg font-semibold text-green-700">Great job!</p>
          <p className="mt-1 text-sm text-gray-500">You have finished all cards in this round.</p>
          <button
            type="button"
            onClick={() => {
              onReviewAgain?.();
              handleReviewAgain();
            }}
            className="mt-4 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            Review Again
          </button>
        </div>
      )}
    </div>
  );
}
