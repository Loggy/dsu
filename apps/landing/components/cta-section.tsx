'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="bg-deep-ocean px-6 py-24 md:py-32 dark:bg-deep-ocean-800">
      <div className="mx-auto max-w-content text-center">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Ready to start earning?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-cloud-white/90 md:text-xl">
          Join the decentralized savings revolution. Choose your risk level and
          let your crypto work for you.
        </p>

        <Link
          href="/app"
          className="group mt-10 inline-flex items-center space-x-2 rounded-lg bg-electric-teal px-10 py-5 text-lg font-semibold text-deep-ocean shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-teal-lg"
        >
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-6 text-sm text-cloud-white/70">Transparent</p>
      </div>
    </section>
  );
}
