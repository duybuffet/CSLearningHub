import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TopicProgress } from '@/types/content-schema-types';

// ── Global progress + UI state, persisted to localStorage ─────
export type ViewMode = 'deep' | 'compact';

interface ProgressState {
  progress: Record<string, TopicProgress>;
  lastVisited: string | null; // topic id
  sidebarOpen: boolean; // mobile drawer
  viewMode: ViewMode; // deep chapter vs compact cheat-sheet

  markRead: (topicId: string) => void;
  setQuizScore: (topicId: string, score: number) => void;
  setLastVisited: (topicId: string) => void;
  toggleSidebar: (open?: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
}

const emptyProgress = (): TopicProgress => ({ read: false, quizAttempts: 0 });

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      lastVisited: null,
      sidebarOpen: false,
      viewMode: 'deep',

      markRead: (topicId) =>
        set((state) => {
          const prev = state.progress[topicId] ?? emptyProgress();
          if (prev.read) return state; // no-op once read
          return {
            progress: {
              ...state.progress,
              [topicId]: { ...prev, read: true, readAt: new Date().toISOString() },
            },
          };
        }),

      setQuizScore: (topicId, score) =>
        set((state) => {
          const prev = state.progress[topicId] ?? emptyProgress();
          const best = Math.max(prev.quizScore ?? 0, score);
          return {
            progress: {
              ...state.progress,
              [topicId]: { ...prev, quizScore: best, quizAttempts: prev.quizAttempts + 1 },
            },
          };
        }),

      setLastVisited: (topicId) =>
        set((state) => {
          const prev = state.progress[topicId] ?? emptyProgress();
          return {
            lastVisited: topicId,
            progress: {
              ...state.progress,
              [topicId]: { ...prev, lastVisited: new Date().toISOString() },
            },
          };
        }),

      toggleSidebar: (open) =>
        set((state) => ({ sidebarOpen: open ?? !state.sidebarOpen })),

      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'cs-hub-progress' },
  ),
);
