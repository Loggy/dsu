'use client';

import { Shield, TrendingUp, Scale } from 'lucide-react';

export function Features() {
  return (
    <section className="bg-cloud-white px-6 py-24 md:py-32 dark:bg-midnight">
      <div className="mx-auto max-w-content">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-midnight md:text-4xl dark:text-white">
            Risk-Adjusted Tranches
          </h2>
          <p className="mt-4 text-lg text-slate-gray dark:text-slate-gray-200">
            Choose your risk level, maximize your returns
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* TDSU - Senior Tranche */}
          <div className="group rounded-xl border border-slate-gray/10 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-teal dark:border-slate-gray/20 dark:bg-deep-ocean-700">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sage-green/10 dark:bg-sage-green/20">
                <Shield className="h-7 w-7 text-sage-green" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-midnight dark:text-white">
                  Tempered DSU
                </h3>
                <p className="text-sm text-electric-teal">
                  $TDSU - Senior Tranche
                </p>
              </div>
            </div>

            <p className="mb-6 text-base leading-relaxed text-slate-gray dark:text-slate-gray-200">
              A senior liquidity pool designed for conservative investors
              seeking lower risk with steady returns.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Scale className="mt-1 h-5 w-5 flex-shrink-0 text-sage-green" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    Lower Risk/Reward Profile
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Gains from 0-35% of protocol profit and losses from yield
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-sage-green" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    Limited Downside Protection
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Covers only 35% of liquidation losses
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="mt-1 h-5 w-5 flex-shrink-0 text-sage-green" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    Stable Returns
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Prioritized earnings with capped exposure
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-sage-green/5 px-4 py-3 dark:bg-sage-green/10">
              <div className="text-xs font-medium uppercase tracking-wide text-sage-green">
                Risk Level
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-gray/10 dark:bg-slate-gray/20">
                  <div className="h-full w-[35%] rounded-full bg-sage-green" />
                </div>
                <span className="text-sm font-semibold text-sage-green">
                  Low
                </span>
              </div>
            </div>
          </div>

          {/* CDSU - Junior Tranche */}
          <div className="group rounded-xl border border-slate-gray/10 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-teal dark:border-slate-gray/20 dark:bg-deep-ocean-700">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-electric-teal/10 dark:bg-electric-teal/20">
                <TrendingUp className="h-7 w-7 text-electric-teal" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-midnight dark:text-white">
                  Chasing DSU
                </h3>
                <p className="text-sm text-electric-teal">
                  $CDSU - Junior Tranche
                </p>
              </div>
            </div>

            <p className="mb-6 text-base leading-relaxed text-slate-gray dark:text-slate-gray-200">
              A junior liquidity pool for aggressive investors willing to take
              higher risk for potentially higher rewards.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="mt-1 h-5 w-5 flex-shrink-0 text-electric-teal" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    Higher Risk/Reward Profile
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Captures 65% of protocol earnings
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-electric-teal" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    First Loss Coverage
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Covers all losses during negative funding periods and when
                    lending APY exceeds funding APY
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Scale className="mt-1 h-5 w-5 flex-shrink-0 text-electric-teal" />
                <div>
                  <div className="font-semibold text-midnight dark:text-white">
                    Liquidation Buffer
                  </div>
                  <div className="text-sm text-slate-gray dark:text-slate-gray-300">
                    Absorbs liquidation losses beyond senior tranche coverage
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-electric-teal/5 px-4 py-3 dark:bg-electric-teal/10">
              <div className="text-xs font-medium uppercase tracking-wide text-electric-teal">
                Risk Level
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-gray/10 dark:bg-slate-gray/20">
                  <div className="h-full w-[85%] rounded-full bg-electric-teal" />
                </div>
                <span className="text-sm font-semibold text-electric-teal">
                  High
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Explainer Note */}
        <div className="mt-12 rounded-xl border border-deep-ocean/10 bg-deep-ocean/5 p-6 dark:border-electric-teal/20 dark:bg-electric-teal/5">
          <p className="text-center text-sm leading-relaxed text-slate-gray dark:text-slate-gray-200">
            <span className="font-semibold text-deep-ocean dark:text-electric-teal">
              How it works:
            </span>{' '}
            Protocol earnings are distributed based on tranche priority. Senior
            tranche ($TDSU) receives first claim up to 35% of profits with
            limited downside. Junior tranche ($CDSU) receives the remaining 65%
            but acts as the first line of defense against losses.
          </p>
        </div>
      </div>
    </section>
  );
}
