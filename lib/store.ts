import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Profile, Mission, ChatMessage, SavedSebteuk } from './types';

const defaultState: AppState = {
  profile: {
    name: '',
    grade: '',
    school: '',
    tracks: [],
    major: '',
    gradeRank: '',
  },
  diag: {
    score: 75,
    breakdown: { 교과: 80, 세특: 70, 창체: 75, 독서: 65 },
  },
  missions: [],
  savedSebteuks: [],
  chatHistory: [],
  userEssay: '',
  stats: { topics: 0, books: 0, sebteuks: 0, chats: 0 },
  onboarded: false,
};

interface StoreActions {
  setProfile: (profile: Profile) => void;
  setOnboarded: (v: boolean) => void;
  setMissions: (m: Mission[]) => void;
  completeMission: (id: string) => void;
  saveSebteuk: (s: SavedSebteuk) => void;
  addChatMessage: (m: ChatMessage) => void;
  resetChat: () => void;
  setUserEssay: (s: string) => void;
  incrementStat: (key: keyof AppState['stats']) => void;
  recalcDiagnosis: () => void;
  resetAll: () => void;
}

type Store = AppState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setProfile: (profile) => set({ profile }),

      setOnboarded: (v) => set({ onboarded: v }),

      setMissions: (missions) => set({ missions }),

      completeMission: (id) => {
        const missions = get().missions.map((m) =>
          m.id === id ? { ...m, done: true } : m
        );
        set({ missions });
      },

      saveSebteuk: (s) => {
        const list = [...get().savedSebteuks];
        const idx = list.findIndex((x) => x.title === s.title);
        if (idx >= 0) list[idx] = s;
        else {
          list.push(s);
          // Increment topic stat only on new save
          set({ stats: { ...get().stats, topics: get().stats.topics + 1 } });
        }
        set({ savedSebteuks: list });
      },

      addChatMessage: (m) => {
        set({
          chatHistory: [...get().chatHistory, m],
          stats:
            m.role === 'user'
              ? { ...get().stats, chats: get().stats.chats + 1 }
              : get().stats,
        });
      },

      resetChat: () => set({ chatHistory: [] }),

      setUserEssay: (s) => set({ userEssay: s }),

      incrementStat: (key) =>
        set({ stats: { ...get().stats, [key]: get().stats[key] + 1 } }),

      recalcDiagnosis: () => {
        const p = get().profile;
        const baseScore =
          p.gradeRank === '1.0~1.5'
            ? 92
            : p.gradeRank === '1.5~2.0'
            ? 84
            : p.gradeRank === '2.0~2.5'
            ? 76
            : p.gradeRank === '2.5~3.0'
            ? 68
            : p.gradeRank === '3.0~'
            ? 60
            : 75;
        set({
          diag: {
            score: baseScore,
            breakdown: {
              교과: Math.min(100, baseScore + Math.round((Math.random() - 0.5) * 8)),
              세특: Math.max(50, baseScore + Math.round((Math.random() - 0.5) * 12) - 4),
              창체: Math.max(50, baseScore + Math.round((Math.random() - 0.5) * 10) - 2),
              독서: Math.max(50, baseScore + Math.round((Math.random() - 0.5) * 14) - 8),
            },
          },
        });
      },

      resetAll: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('queston-store');
        }
        set(defaultState);
      },
    }),
    {
      name: 'queston-store',
      // Don't persist sensitive data outside localStorage scope
      partialize: (state) => ({
        profile: state.profile,
        diag: state.diag,
        missions: state.missions,
        savedSebteuks: state.savedSebteuks,
        chatHistory: state.chatHistory,
        userEssay: state.userEssay,
        stats: state.stats,
        onboarded: state.onboarded,
      }),
    }
  )
);
