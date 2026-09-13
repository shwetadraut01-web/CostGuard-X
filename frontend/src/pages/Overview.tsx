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

interface OverviewProps {
  kpis: SummaryKPIs | null;
  wasteCases: WasteCase[];
  onNavigate: (tab: string, resourceId?: string) => void;
}

export const OverviewPage: React.FC<OverviewProps> = ({ kpis, wasteCases, onNavigate }) => {
  if (!kpis) return <div className="text-slate-400 p-6">Loading summary overview...</div>;

  const topHighConfWaste = wasteCases
    .filter(w => w.is_waste)
    .sort((a, b) => b.confidence.score - a.confidence.score)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>FinOps Cloud Intelligence Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AWS Cloud Cost Waste Intelligence (No-ML Statistical Engine)
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            CostGuard-X analyzes AWS cloud cost and utilization metrics using time-series statistics, robust Z-scores (MAD), temporal event correlation, explainable waste fingerprinting, and counterfactual scenario modeling to pinpoint avoidable spend.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition flex items-center space-x-2 shadow"
            >
              <span>View Executive Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('waste')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition"
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
          value={`$${kpis.total_spend.toLocaleString()}`}
          subtitle="60-day aggregate dataset"
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Recent 7-Day Spend"
          value={`$${kpis.recent_7d_spend.toLocaleString()}`}
          subtitle="Recent 7-day period"
          icon={TrendingUp}
          trend={`${kpis.spend_pct_change_7d > 0 ? '+' : ''}${kpis.spend_pct_change_7d}%`}
          trendType={kpis.spend_pct_change_7d > 5 ? 'negative' : 'positive'}
          color="indigo"
        />
        <MetricCard
          title="Statistical Anomalies"
          value={kpis.total_anomalies}
          subtitle="MAD Z-score & Moving Avg flagged"
          icon={AlertTriangle}
          color="amber"
        />
        <MetricCard
          title="Potential Avoidable Spend"
          value={`$${kpis.total_avoidable_monthly_spend.toLocaleString()}/mo`}
          subtitle={`Avg Waste Confidence: ${kpis.avg_waste_confidence}%`}
          icon={PiggyBank}
          color="emerald"
        />
      </div>

      {/* High Confidence Waste Alerts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Flame className="h-5 w-5 text-red-400" />
            <h3 className="text-base font-semibold text-white">
              High-Confidence Waste Findings
            </h3>
          </div>
          <button
            onClick={() => onNavigate('waste')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            View All ({kpis.total_waste_cases}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topHighConfWaste.map((item) => (
            <div
              key={item.resource_id}
              className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-300">
                    {item.resource_id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    {item.confidence.score}% CONFIDENCE
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {item.category} ({item.service})
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.recommendation.primary_recommendation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">Avoidable Cost</div>
                  <div className="text-sm font-bold text-emerald-400">
                    ${item.counterfactual.potential_avoidable_monthly}/mo
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('resource', item.resource_id)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2.5 py-1.5 rounded font-medium transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conceptual Pipeline Architecture View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          CostGuard-X Core Analytical Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            'Data Ingestion', 'Validation & Clean', 'Feature Engineer',
            'Statistical Anomaly', 'Waste Fingerprint', 'Counterfactual', 'Bedrock Explanation'
          ].map((step, idx) => (
            <div key={step} className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-lg flex flex-col items-center justify-center">
              <span className="text-[10px] text-blue-400 font-bold mb-1">M0{idx+1}</span>
              <span className="text-slate-200 font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
