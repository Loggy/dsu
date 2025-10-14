'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-slate-gray/20 bg-transparent" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group relative h-9 w-9 rounded-lg border border-slate-gray/20 bg-white/80 transition-all hover:border-electric-teal hover:bg-electric-teal/10 dark:bg-midnight/80 dark:hover:bg-electric-teal/10"
      aria-label="Toggle theme"
    >
      <Sun className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-slate-gray transition-all group-hover:text-electric-teal dark:scale-0 dark:rotate-90 dark:opacity-0" />
      <Moon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 scale-0 rotate-90 text-slate-gray opacity-0 transition-all group-hover:text-electric-teal dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
