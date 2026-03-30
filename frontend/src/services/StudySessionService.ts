import { STUDY_SESSIONS_KEY } from "../constants/storageKeys";
import { getOrCreateUserId } from "./CardReviewService";
import type { StudySession } from "../types/StudySession";
import { apiClient } from "./ApiClient";

interface CreateStudySessionInput {
    started_at: number;
    ended_at: number;
    user_id?: string;
}

function generateId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStudySessionsFromStorage(): StudySession[] {
    if (typeof window === "undefined") return [];

    const raw = window.localStorage.getItem(STUDY_SESSIONS_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as StudySession[]) : [];
    } catch {
        return [];
    }
}

function persistStudySessions(sessions: StudySession[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(sessions));
}

let studySessionList: StudySession[] = readStudySessionsFromStorage();

export function getStudySessions(): StudySession[] {
    return [...studySessionList];
}

export function createStudySession(input: CreateStudySessionInput): StudySession {
    const startedAt = input.started_at;
    const endedAt = input.ended_at;
    const durationMs = Math.max(endedAt - startedAt, 0);

    const session: StudySession = {
        id: generateId(),
        user_id: input.user_id || getOrCreateUserId(),
        started_at: startedAt,
        ended_at: endedAt,
        duration_seconds: Math.round(durationMs / 1000),
    };

    studySessionList = [...studySessionList, session];
    persistStudySessions(studySessionList);
    return session;
}

export function clearStudySessions(): void {
    studySessionList = [];
    persistStudySessions(studySessionList);
}

export function reloadStudySessionsFromStorage(): StudySession[] {
    studySessionList = readStudySessionsFromStorage();
    return [...studySessionList];
}

export function syncCreateStudySession(startedAt: number, endedAt: number, deckId: number): Promise<{ id: number }> {
    return apiClient.post<{ id: number }>('/api/session-study/create', {
        startTime: startedAt,
        endTime: endedAt,
        deckId
    });
}
