'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-gray/10 bg-white px-6 py-12 dark:border-slate-gray/20 dark:bg-midnight">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-deep-ocean to-electric-teal">
              <span className="font-display text-lg font-bold text-white">
                D
              </span>
            </div>
            <span className="font-display text-xl font-bold text-deep-ocean dark:text-white">
              DSU
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm md:gap-8">
            <Link
              href="/docs"
              className="text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
            >
              Docs
            </Link>
            <Link
              href="https://x.com/dsu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
            >
              X
            </Link>
            <Link
              href="/terms"
              className="text-slate-gray transition-colors hover:text-electric-teal dark:text-slate-gray-200"
            >
              Terms
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-slate-gray dark:text-slate-gray-300">
            © {new Date().getFullYear()} DSU. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
