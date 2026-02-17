import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className={`group relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${className}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-amber-400" />
            ) : (
                <Moon className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-indigo-600" />
            )}
        </button>
    );
};
