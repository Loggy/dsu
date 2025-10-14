'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-gray/10 bg-white/80 backdrop-blur-glass dark:border-slate-gray/20 dark:bg-midnight/80">
      <div className="mx-auto max-w-content px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-deep-ocean to-electric-teal">
              <span className="font-display text-xl font-bold text-white">
                D
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-deep-ocean dark:text-white">
              DSU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/docs"
              className="text-base font-medium text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
            >
              Docs
            </Link>
            <Link
              href="https://x.com/dsu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
            >
              X
            </Link>
            <ThemeToggle />
            <Link
              href="/app"
              className="rounded-lg bg-electric-teal px-6 py-3 font-semibold text-deep-ocean shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-teal"
            >
              Open App
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-deep-ocean dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-deep-ocean dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-gray/10 py-4 md:hidden dark:border-slate-gray/20">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/docs"
                className="text-base font-medium text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="https://x.com/dsu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                X
              </Link>
              <Link
                href="/app"
                className="inline-block rounded-lg bg-electric-teal px-6 py-3 text-center font-semibold text-deep-ocean shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-teal"
                onClick={() => setMobileMenuOpen(false)}
              >
                Open App
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
