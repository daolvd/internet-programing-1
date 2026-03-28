import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProgressBar from "./components/ProgressBar";
import FlashcardViewer from "./components/FlashcardViewer";
import StudyControls from "./components/StudyControls";
import Modal from "../../components/modal/Modal";

import { getCardsByDeck, getNameOfDeck, updateDeckLastActive } from "../../services/DeckServices";
import { LAST_REVIEW_DECK_KEY } from "../../constants/storageKeys";
import { INITIAL_LEARN_FILTERS, type LearnFilterKey } from "../../constants/study";
import LearnCardPanel from "./components/LearnCardPanel";
import { createCardReview, getCardReviews, getOrCreateUserId } from "../../services/CardReviewService";
import { createStudySession } from "../../services/StudySessionService";
import { findFallbackDeckId, formatSessionClock, getCurrentStreakDays, normalizeLearnStatus } from "../../utils/Utils";

export default function StudyPage() {
  const [searchParams] = useSearchParams();
  const rawDeckIdParam = searchParams.get("deckId");
  const deckIdParam = rawDeckIdParam ? Number(rawDeckIdParam) : null;
  const rawCardIdParam = searchParams.get("cardId");
  const cardIdParam = rawCardIdParam ? Number(rawCardIdParam) : null;

  const storedDeckId = Number(localStorage.getItem(LAST_REVIEW_DECK_KEY) || 0);
  const isParamValid = Number.isFinite(deckIdParam) && (deckIdParam ?? 0) > 0;
  const isStoredValid = Number.isFinite(storedDeckId) && storedDeckId > 0;

  const resolvedDeckId = isParamValid
    ? (deckIdParam as number)
    : isStoredValid
      ? storedDeckId
      : findFallbackDeckId();

  const cards = useMemo(() => getCardsByDeck(resolvedDeckId), [resolvedDeckId]);
  const deckName = useMemo(() => getNameOfDeck(resolvedDeckId) || "Selected Deck", [resolvedDeckId]);

  useEffect(() => {
    if (resolvedDeckId > 0) {
      localStorage.setItem(LAST_REVIEW_DECK_KEY, String(resolvedDeckId));
      updateDeckLastActive(resolvedDeckId);
    }
  }, [resolvedDeckId]);

  const targetIndex = cardIdParam
    ? cards.findIndex((card) => card.id === cardIdParam)
    : -1;
  const initialIndex = targetIndex >= 0 ? targetIndex : 0;

  const [index, setIndex] = useState(initialIndex);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<"quickview" | "learn">("quickview");
  const [learnQueueSize, setLearnQueueSize] = useState(cards.length);
  const [learnCurrent, setLearnCurrent] = useState(cards.length > 0 ? 1 : 0);
  const [quickCardStartedAt, setQuickCardStartedAt] = useState(Date.now());
  const [quickCardRecorded, setQuickCardRecorded] = useState(false);
  const [isLearnSettingOpen, setIsLearnSettingOpen] = useState(false);
  const [learnShowAll, setLearnShowAll] = useState(true);
  const [learnFilters, setLearnFilters] = useState(INITIAL_LEARN_FILTERS);
  const [studyStartedAt, setStudyStartedAt] = useState<number | null>(null);
  const [studySessionSaved, setStudySessionSaved] = useState(false);
  const [completedSessionTime, setCompletedSessionTime] = useState<number | null>(null);
  const [clockNow, setClockNow] = useState(Date.now());

  const filteredLearnCards = useMemo(() => {
    if (learnShowAll) return cards;

    return cards.filter((card) => {
      const key = normalizeLearnStatus(card.status || "");
      return learnFilters[key];
    });
  }, [cards, learnFilters, learnShowAll]);

  useEffect(() => {
    setIndex(initialIndex);
    setShow(false);
    setLearnQueueSize(cards.length);
    setLearnCurrent(cards.length > 0 ? 1 : 0);
    setStudyStartedAt(null);
    setStudySessionSaved(false);
    setCompletedSessionTime(null);
  }, [resolvedDeckId, initialIndex]);

  useEffect(() => {
    setLearnQueueSize(filteredLearnCards.length);
    setLearnCurrent(filteredLearnCards.length > 0 ? 1 : 0);
  }, [filteredLearnCards.length]);

  useEffect(() => {
    setQuickCardStartedAt(Date.now());
    setQuickCardRecorded(false);
  }, [index, resolvedDeckId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Save incomplete session when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (studyStartedAt !== null && !studySessionSaved) {
        createStudySession({
          user_id: getOrCreateUserId(),
          started_at: studyStartedAt,
          ended_at: Date.now(),
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Also save on component unmount (e.g., when navigating away)
      if (studyStartedAt !== null && !studySessionSaved) {
        createStudySession({
          user_id: getOrCreateUserId(),
          started_at: studyStartedAt,
          ended_at: Date.now(),
        });
      }
    };
  }, [studyStartedAt, studySessionSaved]);

  const currentUserId = useMemo(() => getOrCreateUserId(), []);
  const streakDays = useMemo(() => {
    const timestamps = getCardReviews()
      .filter((review) => review.user_id === currentUserId)
      .map((review) => review.reviewed_at);

    return getCurrentStreakDays(timestamps);
  }, [currentUserId, clockNow, quickCardRecorded, learnCurrent]);

  const sessionLabel = useMemo(() => {
    if (studyStartedAt === null) return "00:00";

    // If session is completed, show fixed time
    if (completedSessionTime !== null) {
      return formatSessionClock(completedSessionTime);
    }

    // Otherwise show live elapsed time
    const elapsedSeconds = Math.floor((clockNow - studyStartedAt) / 1000);
    return formatSessionClock(elapsedSeconds);
  }, [clockNow, studyStartedAt, completedSessionTime]);

  if (cards.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700">No cards found for this deck</h2>
        <p className="text-sm text-gray-500 mt-2">Please go back and choose a deck that has cards.</p>
      </div>
    );
  }

  const current = cards[index] || cards[0];

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    setShow(false);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setShow(false);
  };

  const revealQuickviewAnswer = () => {
    const startedAt = studyStartedAt ?? Date.now();
    if (studyStartedAt === null) {
      setStudyStartedAt(startedAt);
    }

    setShow(true);
    if (quickCardRecorded) {
      return;
    }

    createCardReview({
      card_id: current.id,
      deck_id: current.deckId,
      is_correct: true,
      rating: "good",
      response_time_ms: Date.now() - quickCardStartedAt,
    });
    setQuickCardRecorded(true);
  };

  const startStudySessionIfNeeded = () => {
    if (studyStartedAt === null) {
      setStudyStartedAt(Date.now());
    }
  };

  const completeStudySessionIfNeeded = () => {
    if (studySessionSaved || studyStartedAt === null) {
      return;
    }

    const endTime = Date.now();
    const elapsedSeconds = Math.floor((endTime - studyStartedAt) / 1000);
    setCompletedSessionTime(elapsedSeconds);

    createStudySession({
      user_id: getOrCreateUserId(),
      started_at: studyStartedAt,
      ended_at: endTime,
    });
    setStudySessionSaved(true);
  };

  const handleToggleAllFilters = (checked: boolean) => {
    setLearnShowAll(checked);
    if (checked) {
      setLearnFilters(INITIAL_LEARN_FILTERS);
    }
  };

  const handleToggleLearnFilter = (key: LearnFilterKey, checked: boolean) => {
    setLearnFilters((prev) => {
      const next = { ...prev, [key]: checked };
      const allEnabled = Object.values(next).every(Boolean);
      setLearnShowAll(allEnabled);
      return next;
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">

      {/* PROGRESS */}
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Study: {deckName}</h1>
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex bg-white border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab("quickview")}
              className={`px-4 py-1.5 text-sm rounded-md ${
                activeTab === "quickview" ? "bg-blue-500 text-white" : "text-gray-600"
              }`}
            >
              Quickview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("learn")}
              className={`px-4 py-1.5 text-sm rounded-md ${
                activeTab === "learn" ? "bg-blue-500 text-white" : "text-gray-600"
              }`}
            >
              Learn
            </button>
          </div>

          {activeTab === "learn" && (
            <button
              type="button"
              onClick={() => setIsLearnSettingOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Settings
            </button>
          )}
        </div>

        <ProgressBar
          current={activeTab === "quickview" ? index + 1 : learnCurrent}
          total={activeTab === "quickview" ? cards.length : learnQueueSize || 1}
        />
      </div>

      {activeTab === "quickview" ? (
        <>
          {/* CARD */}
          <div className="w-full max-w-3xl mt-6">
            <FlashcardViewer card={current} show={show} onFlip={() => setShow(!show)} />
          </div>

          {/* CONTROLS */}
          <div className="mt-6">
            <StudyControls
              onPrev={() => {
                startStudySessionIfNeeded();
                prev();
              }}
              onNext={() => {
                startStudySessionIfNeeded();
                next();
              }}
              onReveal={revealQuickviewAnswer}
            />
          </div>
        </>
      ) : (
        <LearnCardPanel
          cards={filteredLearnCards}
          onQueueSizeChange={setLearnQueueSize}
          onReview={(review) => {
            startStudySessionIfNeeded();
            createCardReview({
              card_id: review.cardId,
              deck_id: review.deckId,
              is_correct: review.isCorrect,
              rating: review.rating,
              response_time_ms: review.responseTimeMs,
            });
          }}
          onProgressChange={(current, total) => {
            setLearnCurrent(current);
            setLearnQueueSize(total);
            if (total > 0 && current === total) {
              completeStudySessionIfNeeded();
            }
          }}
          onReviewAgain={() => {
            setStudyStartedAt(Date.now());
            setStudySessionSaved(false);
            setCompletedSessionTime(null);
          }}
        />
      )}

      {isLearnSettingOpen && (
        <Modal onClose={() => setIsLearnSettingOpen(false)}>
          <div className="p-5 border-b">
            <h3 className="text-lg font-semibold">Learn Settings</h3>
            <p className="text-sm text-gray-500">Choose card types to include in Learn mode.</p>
          </div>

          <div className="p-5 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={learnShowAll}
                onChange={(event) => handleToggleAllFilters(event.target.checked)}
              />
              All
            </label>
            <label className="flex items-center gap-2 text-sm text-green-700">
              <input
                type="checkbox"
                checked={learnFilters.easy}
                onChange={(event) => handleToggleLearnFilter("easy", event.target.checked)}
              />
              Easy
            </label>
            <label className="flex items-center gap-2 text-sm text-blue-700">
              <input
                type="checkbox"
                checked={learnFilters.good}
                onChange={(event) => handleToggleLearnFilter("good", event.target.checked)}
              />
              Good
            </label>
            <label className="flex items-center gap-2 text-sm text-amber-700">
              <input
                type="checkbox"
                checked={learnFilters.hard}
                onChange={(event) => handleToggleLearnFilter("hard", event.target.checked)}
              />
              Hard
            </label>
            <label className="flex items-center gap-2 text-sm text-red-700">
              <input
                type="checkbox"
                checked={learnFilters.dontknow}
                onChange={(event) => handleToggleLearnFilter("dontknow", event.target.checked)}
              />
              Don&apos;t know
            </label>
          </div>

          <div className="p-5 border-t flex justify-end">
            <button
              type="button"
              onClick={() => setIsLearnSettingOpen(false)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              Apply
            </button>
          </div>
        </Modal>
      )}

      {/* FOOTER */}
      <div className="mt-6 text-sm text-gray-400">
        Session: {sessionLabel} • Streak: {streakDays} day{streakDays === 1 ? "" : "s"}
      </div>

    </div>
  );
}