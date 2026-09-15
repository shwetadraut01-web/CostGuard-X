import React from 'react';
import type { SummaryKPIs, WasteCase } from '../types';
import { MetricCard } from '../components/MetricCard';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Flame,
  PiggyBank,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';
import { formatCurrency } from '../utils/currency';

interface OverviewProps {
  kpis: SummaryKPIs | null;
  wasteCases: WasteCase[];
  onNavigate: (tab: string, resourceId?: string) => void;
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const OverviewPage: React.FC<OverviewProps> = ({ kpis, wasteCases, onNavigate, currency = 'USD', theme = 'light' }) => {
  const isDark = theme === 'dark';

  if (!kpis) return <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'} p-6 font-medium`}>Loading summary overview...</div>;

  const topHighConfWaste = wasteCases
    .filter(w => w.is_waste)
    .sort((a, b) => b.confidence.score - a.confidence.score)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className={`${
        isDark
          ? 'bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950 border-blue-800/40 text-white'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 border-blue-200/80 text-slate-900 shadow-xs'
      } border rounded-2xl p-6 relative overflow-hidden transition-all duration-200`}>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className={`inline-flex items-center space-x-2 text-xs font-bold px-3 py-1 rounded-full ${
            isDark ? 'bg-blue-500/20 border-blue-400/40 text-blue-200' : 'bg-blue-100 border border-blue-300 text-blue-800'
          }`}>
            <ShieldCheck className={`h-4 w-4 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
            <span>FinOps Cloud Intelligence Engine</span>
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AWS Cloud Cost Waste Intelligence (No-ML Statistical Engine)
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600 font-medium'}`}>
            CostGuard-X analyzes AWS cloud cost and utilization metrics using time-series statistics, robust Z-scores (MAD), temporal event correlation, explainable waste fingerprinting, and counterfactual scenario modeling to pinpoint avoidable spend.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center space-x-2 shadow-xs"
            >
              <span>View Executive Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('waste')}
              className={`${
                isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
              } font-semibold text-xs px-4 py-2.5 rounded-lg border transition`}
            >
              Explore Waste Cases ({kpis.total_waste_cases})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Cloud Spend"
          value={formatCurrency(kpis.total_spend, currency, true)}
          subtitle="60-day aggregate dataset"
          icon={DollarSign}
          color="blue"
          theme={theme}
        />
        <MetricCard
          title="Recent 7-Day Spend"
          value={formatCurrency(kpis.recent_7d_spend, currency, true)}
          subtitle="Recent 7-day period"
          icon={TrendingUp}
          trend={`${kpis.spend_pct_change_7d > 0 ? '+' : ''}${kpis.spend_pct_change_7d}%`}
          trendType={kpis.spend_pct_change_7d > 5 ? 'negative' : 'positive'}
          color="indigo"
          theme={theme}
        />
        <MetricCard
          title="Statistical Anomalies"
          value={kpis.total_anomalies}
          subtitle="MAD Z-score & Moving Avg flagged"
          icon={AlertTriangle}
          color="amber"
          theme={theme}
        />
        <MetricCard
          title="Potential Avoidable Spend"
          value={`${formatCurrency(kpis.total_avoidable_monthly_spend, currency, true)}/mo`}
          subtitle={`Avg Waste Confidence: ${kpis.avg_waste_confidence}%`}
          icon={PiggyBank}
          color="emerald"
          theme={theme}
        />
      </div>

      {/* High Confidence Waste Alerts */}
      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Flame className="h-5 w-5 text-rose-500" />
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              High-Confidence Waste Findings
            </h3>
          </div>
          <button
            onClick={() => onNavigate('waste')}
            className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-semibold`}
          >
            View All ({kpis.total_waste_cases}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topHighConfWaste.map((item) => (
            <div
              key={item.resource_id}
              className={`${
                isDark
                  ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
              } border rounded-xl p-4 flex flex-col justify-between transition`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    {item.resource_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isDark
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 font-bold'
                  }`}>
                    {item.confidence.score}% CONFIDENCE
                  </span>
                </div>
                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.category} ({item.service})
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                  {item.recommendation.primary_recommendation}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-200'} flex items-center justify-between`}>
                <div>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Avoidable Cost
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    ${item.counterfactual.potential_avoidable_monthly}/mo
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('resource', item.resource_id)}
                  className={`${
                    isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
                  } text-xs px-2.5 py-1.5 rounded font-semibold transition`}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conceptual Pipeline Architecture View */}
      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-3`}>
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          CostGuard-X Core Analytical Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            'Data Ingestion', 'Validation & Clean', 'Feature Engineer',
            'Statistical Anomaly', 'Waste Fingerprint', 'Counterfactual', 'Bedrock Explanation'
          ].map((step, idx) => (
            <div key={step} className={`${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            } border p-2.5 rounded-lg flex flex-col items-center justify-center`}>
              <span className={`text-[10px] font-bold mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>M0{idx+1}</span>
              <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
