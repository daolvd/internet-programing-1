import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProgressBar from "./components/ProgressBar";
import FlashcardViewer from "./components/FlashcardViewer";
import StudyControls from "./components/StudyControls";
import Modal from "../../components/modal/Modal";
import { fetchCardsByDeck, getCardsByDeck, getNameOfDeck, updateDeckLastActive } from "../../services/DeckServices";
import { LAST_REVIEW_DECK_KEY } from "../../constants/storageKeys";
import { INITIAL_LEARN_FILTERS, type LearnFilterKey } from "../../constants/study";
import LearnCardPanel from "./components/LearnCardPanel";
import { createCardReviewOnServer } from "../../services/CardReviewService";
import { getMetricsSummary } from "../../services/MetricsService";
import { createStudySessionOnServer, updateStudySessionOnServer } from "../../services/StudySessionService";
import { findFallbackDeckId, formatSessionClock, normalizeLearnStatus } from "../../utils/Utils";

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

  const deckName = useMemo(() => getNameOfDeck(resolvedDeckId) || "Selected Deck", [resolvedDeckId]);

  const [cards, setCards] = useState(() => getCardsByDeck(resolvedDeckId));
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<"quickview" | "learn">("quickview");
  const [learnQueueSize, setLearnQueueSize] = useState(cards.length);
  const [learnCurrent, setLearnCurrent] = useState(cards.length > 0 ? 1 : 0);
  const [isLearnSettingOpen, setIsLearnSettingOpen] = useState(false);
  const [learnShowAll, setLearnShowAll] = useState(true);
  const [learnFilters, setLearnFilters] = useState(INITIAL_LEARN_FILTERS);
  const [studyStartedAt, setStudyStartedAt] = useState<number | null>(null);
  const [studySessionId, setStudySessionId] = useState<number | null>(null);
  const [studySessionSaved, setStudySessionSaved] = useState(false);
  const [completedSessionTime, setCompletedSessionTime] = useState<number | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [clockNow, setClockNow] = useState(() => Date.now());

  const creatingStudySessionRef = useRef<Promise<number | null> | null>(null);
  const sessionDataRef = useRef({
    studyStartedAt: null as number | null,
    studySessionId: null as number | null,
    studySessionSaved: false,
    resolvedDeckId,
  });

  useEffect(() => {
    let isMounted = true;
    const localCards = getCardsByDeck(resolvedDeckId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards(localCards);

    if (resolvedDeckId > 0) {
      localStorage.setItem(LAST_REVIEW_DECK_KEY, String(resolvedDeckId));
      updateDeckLastActive(resolvedDeckId);
      setIsLoadingCards(true);

      void fetchCardsByDeck(resolvedDeckId)
        .then((fetchedCards) => {
          if (isMounted) {
            setCards(fetchedCards);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingCards(false);
          }
        });
    } else {
      setIsLoadingCards(false);
    }

    return () => {
      isMounted = false;
    };
  }, [resolvedDeckId]);

  const targetIndex = cardIdParam
    ? cards.findIndex((card) => card.id === cardIdParam)
    : -1;
  const initialIndex = targetIndex >= 0 ? targetIndex : 0;

  const filteredLearnCards = useMemo(() => {
    if (learnShowAll) return cards;

    return cards.filter((card) => {
      const key = normalizeLearnStatus(card.status || "");
      return learnFilters[key];
    });
  }, [cards, learnFilters, learnShowAll]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(initialIndex);
    setShow(false);
    setLearnQueueSize(cards.length);
    setLearnCurrent(cards.length > 0 ? 1 : 0);
    setStudyStartedAt(null);
    setStudySessionId(null);
    setStudySessionSaved(false);
    setCompletedSessionTime(null);
    creatingStudySessionRef.current = null;
  }, [resolvedDeckId, initialIndex, cards.length]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLearnQueueSize(filteredLearnCards.length);
    setLearnCurrent(filteredLearnCards.length > 0 ? 1 : 0);
  }, [filteredLearnCards.length]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const refreshStudyInsights = () => {
    getMetricsSummary()
      .then((summary) => {
        setStreakDays(summary.currentStreakDays);
      })
      .catch((err) => console.error("Failed to refresh study insights", err));
  };

  const ensureStudySession = async (): Promise<number | null> => {
    if (resolvedDeckId <= 0) {
      return null;
    }

    if (studySessionId !== null) {
      return studySessionId;
    }

    if (creatingStudySessionRef.current) {
      return creatingStudySessionRef.current;
    }

    const startedAt = studyStartedAt ?? Date.now();
    if (studyStartedAt === null) {
      setStudyStartedAt(startedAt);
    }

    const createPromise = createStudySessionOnServer(startedAt, resolvedDeckId)
      .then((session) => {
        setStudySessionId(session.id);
        setStudySessionSaved(false);
        return session.id;
      })
      .catch((err) => {
        console.error("Failed to create study session", err);
        return null;
      })
      .finally(() => {
        creatingStudySessionRef.current = null;
      });

    creatingStudySessionRef.current = createPromise;
    return createPromise;
  };

  const finalizeStudySession = async (
    endTime: number,
    lockSessionClock: boolean,
    sessionIdOverride?: number
  ) => {
    const activeSessionId = sessionIdOverride ?? studySessionId;
    if (studySessionSaved || studyStartedAt === null || activeSessionId === null) {
      return;
    }

    if (lockSessionClock) {
      const elapsedSeconds = Math.floor((endTime - studyStartedAt) / 1000);
      setCompletedSessionTime(elapsedSeconds);
    }

    try {
      await updateStudySessionOnServer(activeSessionId, studyStartedAt, endTime, resolvedDeckId);
      setStudySessionSaved(true);
    } catch (err) {
      console.error("Failed to finalize study session", err);
    }
  };

  useEffect(() => {
    sessionDataRef.current = {
      studyStartedAt,
      studySessionId,
      studySessionSaved,
      resolvedDeckId,
    };
  }, [studyStartedAt, studySessionId, studySessionSaved, resolvedDeckId]);

  useEffect(() => {
    refreshStudyInsights();
  }, []);

  useEffect(() => {
    const flushSession = () => {
      const currentSession = sessionDataRef.current;
      if (
        currentSession.studyStartedAt === null ||
        currentSession.studySessionId === null ||
        currentSession.studySessionSaved
      ) {
        return;
      }

      void updateStudySessionOnServer(
        currentSession.studySessionId,
        currentSession.studyStartedAt,
        Date.now(),
        currentSession.resolvedDeckId
      ).catch((err) => console.error("Failed to flush study session", err));
    };

    window.addEventListener("beforeunload", flushSession);
    window.addEventListener("pagehide", flushSession);

    return () => {
      window.removeEventListener("beforeunload", flushSession);
      window.removeEventListener("pagehide", flushSession);
      flushSession();
    };
  }, []);

  const sessionLabel = useMemo(() => {
    if (studyStartedAt === null) return "00:00";

    if (completedSessionTime !== null) {
      return formatSessionClock(completedSessionTime);
    }

    const elapsedSeconds = Math.floor((clockNow - studyStartedAt) / 1000);
    return formatSessionClock(elapsedSeconds);
  }, [clockNow, studyStartedAt, completedSessionTime]);

  if (isLoadingCards && cards.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
    void ensureStudySession();
    setShow(true);
  };

  const startStudySessionIfNeeded = () => {
    void ensureStudySession();
  };

  const completeStudySessionIfNeeded = () => {
    void (async () => {
      if (studySessionSaved) {
        return;
      }

      const ensuredSessionId = await ensureStudySession();
      if (ensuredSessionId === null) {
        return;
      }

      await finalizeStudySession(Date.now(), true, ensuredSessionId);
    })();
  };

  const handleToggleAllFilters = (checked: boolean) => {
    setLearnShowAll(checked);
    if (checked) {
      setLearnFilters(INITIAL_LEARN_FILTERS);
    }
  };

  const handleToggleLearnFilter = (key: LearnFilterKey, checked: boolean) => {
    setLearnFilters((prev) => {
      const nextFilters = { ...prev, [key]: checked };
      const allEnabled = Object.values(nextFilters).every(Boolean);
      setLearnShowAll(allEnabled);
      return nextFilters;
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Study: {deckName}</h1>
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex bg-white border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab("quickview")}
              className={`px-4 py-1.5 text-sm rounded-md ${activeTab === "quickview" ? "bg-blue-500 text-white" : "text-gray-600"}`}
            >
              Quickview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("learn")}
              className={`px-4 py-1.5 text-sm rounded-md ${activeTab === "learn" ? "bg-blue-500 text-white" : "text-gray-600"}`}
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
          <div className="w-full max-w-3xl mt-6">
            <FlashcardViewer card={current} show={show} onFlip={() => setShow(!show)} />
          </div>

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
              onReveal={() => {
                if (show) {
                  setShow(false);
                  return;
                }
                revealQuickviewAnswer();
              }}
              isRevealed={show}
            />
          </div>
        </>
      ) : (
        <LearnCardPanel
          cards={filteredLearnCards}
          onQueueSizeChange={setLearnQueueSize}
          onReview={(review) => {
            void (async () => {
              const sessionId = await ensureStudySession();
              if (sessionId === null) {
                return;
              }

              try {
                await createCardReviewOnServer({
                  cardId: review.cardId,
                  isCorrect: review.isCorrect,
                  rating: review.rating,
                  responseTimeMs: review.responseTimeMs,
                  studySessionId: sessionId,
                });
                refreshStudyInsights();
              } catch (err) {
                console.error("Failed to create review", err);
              }
            })();
          }}
          onProgressChange={(currentProgress, total) => {
            setLearnCurrent(currentProgress);
            setLearnQueueSize(total);
            if (total > 0 && currentProgress === total) {
              completeStudySessionIfNeeded();
            }
          }}
          onReviewAgain={() => {
            setStudyStartedAt(null);
            setStudySessionId(null);
            setStudySessionSaved(false);
            setCompletedSessionTime(null);
            creatingStudySessionRef.current = null;
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
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-600 active:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </Modal>
      )}

      <div className="mt-6 text-sm text-gray-400">
        Session: {sessionLabel} • Streak: {streakDays} day{streakDays === 1 ? "" : "s"}
      </div>
    </div>
  );
}
