import React from 'react';
import type { SummaryKPIs, ServiceCost, EnvironmentCost, DailyTrend, WasteCase } from '../types';
import { MetricCard } from '../components/MetricCard';
import { CostChart } from '../components/CostChart';
import { DollarSign, TrendingUp, AlertTriangle, PiggyBank, Flame } from 'lucide-react';

import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface ExecDashboardProps {
  kpis: SummaryKPIs | null;
  services: ServiceCost[];
  environments: EnvironmentCost[];
  dailyTrends: DailyTrend[];
  wasteCases: WasteCase[];
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const ExecutiveDashboardPage: React.FC<ExecDashboardProps> = ({
  kpis,
  services,
  environments,
  dailyTrends,
  wasteCases,
  currency: _currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  if (!kpis) return <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'} p-6 font-medium`}>Loading executive dashboard...</div>;

  const trendDates = dailyTrends.map(d => d.date);
  const trendCosts = dailyTrends.map(d => d.cost);

  const dailyTrendPlotData = [
    {
      x: trendDates,
      y: trendCosts,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: '#2563eb', size: 5 },
      line: { color: '#2563eb', width: 2.5 },
      name: 'Daily Cost ($)'
    }
  ];

  const servicePlotData = [
    {
      labels: services.map(s => s.service),
      values: services.map(s => s.cost),
      type: 'pie',
      hole: 0.4,
      marker: {
        colors: ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626']
      },
      textinfo: 'label+percent',
      textfont: { color: '#ffffff', size: 10 }
    }
  ];

  const envPlotData = [
    {
      x: environments.map(e => e.environment.toUpperCase()),
      y: environments.map(e => e.cost),
      type: 'bar',
      marker: { color: '#4f46e5' }
    }
  ];

  const wasteCategoryCounts: { [cat: string]: number } = {};
  wasteCases.filter(w => w.is_waste).forEach(w => {
    wasteCategoryCounts[w.category] = (wasteCategoryCounts[w.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Executive FinOps Dashboard
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          High-level cloud cost spend overview, service distribution, and waste breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Cloud Spend"
          value={`$${kpis.total_spend.toLocaleString()}`}
          subtitle="60-Day Aggregate"
          icon={DollarSign}
          color="blue"
          theme={theme}
        />
        <MetricCard
          title="Recent 7-Day Spend"
          value={`$${kpis.recent_7d_spend.toLocaleString()}`}
          trend={`${kpis.spend_pct_change_7d > 0 ? '+' : ''}${kpis.spend_pct_change_7d}%`}
          trendType={kpis.spend_pct_change_7d > 5 ? 'negative' : 'positive'}
          icon={TrendingUp}
          color="indigo"
          theme={theme}
        />
        <MetricCard
          title="Flagged Anomalies"
          value={kpis.total_anomalies}
          subtitle="Statistical baseline deviations"
          icon={AlertTriangle}
          color="amber"
          theme={theme}
        />
        <MetricCard
          title="Potential Avoidable Spend"
          value={`$${kpis.total_avoidable_monthly_spend.toLocaleString()}/mo`}
          subtitle={`Avg Waste Confidence: ${kpis.avg_waste_confidence}%`}
          icon={PiggyBank}
          color="emerald"
          theme={theme}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CostChart
            data={dailyTrendPlotData}
            title="Daily Cloud Spending Trend ($)"
            theme={theme}
          />
        </div>
        <div>
          <CostChart
            data={servicePlotData}
            title="Spend Distribution by AWS Service"
            theme={theme}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostChart
          data={envPlotData}
          title="Cloud Spend by Environment"
          theme={theme}
        />

        <div className={`${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        } border rounded-xl p-5 space-y-4`}>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Waste Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(wasteCategoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700/60'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cat}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  isDark
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {count} {count === 1 ? 'case' : 'cases'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
