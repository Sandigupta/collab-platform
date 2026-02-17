import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('collabflow-theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
};

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: getInitialTheme(),
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('collabflow-theme', next);
            return { theme: next };
        }),
    setTheme: (theme) => {
        localStorage.setItem('collabflow-theme', theme);
        set({ theme });
    },
}));
