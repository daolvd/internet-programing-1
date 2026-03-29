import { useEffect, useMemo, useRef, useState } from "react";
import {
  ANSWER_FEEDBACK,
  LEARN_ACTION,
  LEARN_ACTION_PRIORITY,
  LEARN_CARD_STATUS,
  type AnswerFeedback,
  type LearnAction,
} from "../constants/learn";
import { updateCardStatus } from "../services/DeckServices";
import { isAnswerCorrect, mapLearnActionToRating, resolveLearnAction } from "../services/LearnService";
import type { Card } from "../types/Card";
import type { CardReviewRating } from "../types/CardReview";

interface UseLearnSessionOptions {
  cards: Card[];
  notify: (message: string, type?: "success" | "error" | "warning") => void;
  onQueueSizeChange?: (size: number) => void;
  onProgressChange?: (current: number, total: number) => void;
  onReview?: (review: {
    cardId: number;
    deckId: number;
    isCorrect: boolean;
    rating: CardReviewRating;
    responseTimeMs: number;
  }) => void;
}

export function useLearnSession({
  cards,
  notify,
  onQueueSizeChange,
  onProgressChange,
  onReview,
}: UseLearnSessionOptions) {
  const [learnQueue, setLearnQueue] = useState<Card[]>(cards);
  const [learnIndex, setLearnIndex] = useState(0);
  const [learnAnswerInput, setLearnAnswerInput] = useState("");
  const [learnChoice, setLearnChoice] = useState<LearnAction | "">("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const autoNextTimeoutRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  const sortCardsByPriority = (newCards: Card[]) => {
    return [...newCards]
      .map((card, originalIndex) => ({ card, originalIndex }))
      .sort((a, b) => {
        const priorityDiff = getStatusPriority(a.card.status) - getStatusPriority(b.card.status);
        if (priorityDiff !== 0) return priorityDiff;
        return a.originalIndex - b.originalIndex;
      })
      .map(entry => entry.card);
  };

  useEffect(() => {
    setLearnQueue(sortCardsByPriority(cards));
    setLearnIndex(0);
    setLearnAnswerInput("");
    setLearnChoice("");
    setShowAnswer(false);
    setAnswerFeedback(null);
    setIsCompleted(false);
  }, [cards]);

  useEffect(() => {
    if (onQueueSizeChange) {
      onQueueSizeChange(learnQueue.length);
    }
  }, [learnQueue.length, onQueueSizeChange]);

  useEffect(() => {
    if (onProgressChange) {
      const current = learnQueue.length === 0
        ? 0
        : isCompleted
          ? learnQueue.length
          : learnIndex + 1;
      onProgressChange(current, learnQueue.length);
    }
  }, [isCompleted, learnIndex, learnQueue.length, onProgressChange]);

  const currentLearnCard = useMemo(
    () => (isCompleted ? undefined : (learnQueue[learnIndex] || learnQueue[0])),
    [isCompleted, learnQueue, learnIndex]
  );

  useEffect(() => {
    setShowAnswer(false);
    setAnswerFeedback(null);
    startedAtRef.current = Date.now();
  }, [currentLearnCard?.id]);

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        window.clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, []);

  const clearAutoNext = () => {
    if (autoNextTimeoutRef.current) {
      window.clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  };

  const resetInputState = () => {
    setLearnAnswerInput("");
    setLearnChoice("");
    setShowAnswer(false);
    setAnswerFeedback(null);
  };

  const normalizeStatus = (status: string): string => status.trim().toLowerCase().replace(/\s+/g, "");

  const getStatusPriority = (status: string): number => {
    const normalized = normalizeStatus(status);
    if (normalized === normalizeStatus(LEARN_CARD_STATUS[LEARN_ACTION.DONT_KNOW])) {
      return LEARN_ACTION_PRIORITY[LEARN_ACTION.DONT_KNOW];
    }
    if (normalized === normalizeStatus(LEARN_CARD_STATUS[LEARN_ACTION.HARD])) {
      return LEARN_ACTION_PRIORITY[LEARN_ACTION.HARD];
    }
    if (normalized === normalizeStatus(LEARN_CARD_STATUS[LEARN_ACTION.GOOD])) {
      return LEARN_ACTION_PRIORITY[LEARN_ACTION.GOOD];
    }
    if (normalized === normalizeStatus(LEARN_CARD_STATUS[LEARN_ACTION.EASY])) {
      return LEARN_ACTION_PRIORITY[LEARN_ACTION.EASY];
    }
    return 4;
  };

  const applyLearnStatus = (action: LearnAction, shouldAdvance: boolean, targetCard: Card) => {
    const nextStatus = LEARN_CARD_STATUS[action];
    updateCardStatus(targetCard.id, nextStatus);

    setLearnQueue((prev) => {
      const updated = prev.map((card) => (
        card.id === targetCard.id
          ? { ...card, status: nextStatus }
          : card
      ));

      const currentIndexInOrdered = prev.findIndex((card) => card.id === targetCard.id);
      if (updated.length === 0) {
        setLearnIndex(0);
        setIsCompleted(true);
      } else if (shouldAdvance) {
        if (currentIndexInOrdered >= updated.length - 1) {
          setLearnIndex(updated.length - 1);
          setIsCompleted(true);
        } else {
          setLearnIndex(currentIndexInOrdered + 1);
          setIsCompleted(false);
        }
      } else {
        setLearnIndex(Math.max(currentIndexInOrdered, 0));
        setIsCompleted(false);
      }

      return updated;
    });
  };

  const handleLearnAction = (action: LearnAction, shouldAdvance = false, isCorrectInput?: boolean) => {
    if (!currentLearnCard) return;

    const targetCard = currentLearnCard;

    const isCorrect = typeof isCorrectInput === "boolean"
      ? isCorrectInput
      : isAnswerCorrect(learnAnswerInput, currentLearnCard.answer);

    if (action === LEARN_ACTION.EASY) {
      if (!isCorrect) {
        notify("Easy chi dung khi ban tra loi dung.", "warning");
        return;
      }

      onReview?.({
        cardId: targetCard.id,
        deckId: targetCard.deckId,
        isCorrect,
        rating: mapLearnActionToRating(action),
        responseTimeMs: Date.now() - startedAtRef.current,
      });

      applyLearnStatus(LEARN_ACTION.EASY, shouldAdvance, targetCard);
      resetInputState();
      notify("Marked as Easy.", "success");
      return;
    }

    onReview?.({
      cardId: targetCard.id,
      deckId: targetCard.deckId,
      isCorrect,
      rating: mapLearnActionToRating(action),
      responseTimeMs: Date.now() - startedAtRef.current,
    });

    if (action === LEARN_ACTION.HARD) {
      applyLearnStatus(LEARN_ACTION.HARD, shouldAdvance, targetCard);
      resetInputState();
      return;
    }

    if (action === LEARN_ACTION.GOOD) {
      applyLearnStatus(LEARN_ACTION.GOOD, shouldAdvance, targetCard);
      resetInputState();
      return;
    }

    applyLearnStatus(LEARN_ACTION.DONT_KNOW, shouldAdvance, targetCard);
    resetInputState();
  };

  const handlePrevious = () => {
    if (learnQueue.length === 0) return;
    clearAutoNext();
    setIsFlipping(true);
    window.setTimeout(() => {
      if (isCompleted) {
        setIsCompleted(false);
        setLearnIndex(learnQueue.length - 1);
        resetInputState();
        setIsFlipping(false);
        return;
      }
      setLearnIndex((prev) => (prev - 1 + learnQueue.length) % learnQueue.length);
      resetInputState();
      setIsFlipping(false);
    }, 220);
  };

  const handleReviewAgain = () => {
    clearAutoNext();
    setIsCompleted(false);
    setLearnQueue(prev => sortCardsByPriority(prev));
    setLearnIndex(0);
    resetInputState();
    startedAtRef.current = Date.now();
  };

  const handleNext = () => {
    if (!currentLearnCard) return;
    clearAutoNext();

    setIsFlipping(true);
    window.setTimeout(() => {
      const isCorrect = isAnswerCorrect(learnAnswerInput, currentLearnCard.answer);
      const action = resolveLearnAction(learnChoice, isCorrect);
      handleLearnAction(action, true, isCorrect);
      setIsFlipping(false);
    }, 220);
  };

  const handleAnswerEnter = () => {
    if (!currentLearnCard) return;

    clearAutoNext();
    setShowAnswer(true);

    const isCorrect = isAnswerCorrect(learnAnswerInput, currentLearnCard.answer);
    setAnswerFeedback(isCorrect ? ANSWER_FEEDBACK.CORRECT : ANSWER_FEEDBACK.INCORRECT);

    const action = resolveLearnAction(learnChoice, isCorrect);

    autoNextTimeoutRef.current = window.setTimeout(() => {
      setIsFlipping(true);
      window.setTimeout(() => {
        handleLearnAction(action, true, isCorrect);
        setIsFlipping(false);
      }, 220);
      autoNextTimeoutRef.current = null;
    }, 1000);
  };

  return {
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
    isCompleted,
    handlePrevious,
    handleNext,
    handleAnswerEnter,
    handleReviewAgain,
  };
}
