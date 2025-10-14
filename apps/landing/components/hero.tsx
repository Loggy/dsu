'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-deep-ocean px-6 py-24 md:py-32 dark:bg-deep-ocean-800">
      <div className="relative mx-auto max-w-content">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <h1 className="animate-slide-up font-display text-hero-mobile font-bold leading-tight text-white md:text-5xl lg:text-hero-desktop">
            Decentralized Stable Units
          </h1>

          {/* Subheading/Slogan */}
          <p
            className="mt-6 animate-slide-up text-lg text-cloud-white/90 md:text-xl lg:text-2xl"
            style={{ animationDelay: '100ms' }}
          >
            DeFi Savings buddy maximizing yield, adjusting risks
          </p>

          {/* CTA Button */}
          <Link
            href="/app"
            className="group mt-10 inline-flex items-center space-x-2 rounded-lg bg-electric-teal px-8 py-4 font-semibold text-deep-ocean shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-teal-lg animate-slide-up md:px-10 md:py-5 md:text-lg"
            style={{ animationDelay: '200ms' }}
          >
            <span>Earn with DSU</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Optional: Stats or Trust Indicators */}
          <div
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 animate-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="font-display text-3xl font-bold text-electric-teal">
                0-35%
              </div>
              <div className="mt-1 text-sm text-cloud-white/80">
                Senior Tranche Range
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="font-display text-3xl font-bold text-electric-teal">
                65%
              </div>
              <div className="mt-1 text-sm text-cloud-white/80">
                Junior Tranche Upside
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="font-display text-3xl font-bold text-electric-teal">
                100%
              </div>
              <div className="mt-1 text-sm text-cloud-white/80">
                Decentralized
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
