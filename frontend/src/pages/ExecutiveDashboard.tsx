import React from 'react';
import type { SummaryKPIs, ServiceCost, EnvironmentCost, DailyTrend, WasteCase } from '../types';
import { MetricCard } from '../components/MetricCard';
import { CostChart } from '../components/CostChart';
import { DollarSign, TrendingUp, AlertTriangle, PiggyBank, Flame } from 'lucide-react';

interface ExecDashboardProps {
  kpis: SummaryKPIs | null;
  services: ServiceCost[];
  environments: EnvironmentCost[];
  dailyTrends: DailyTrend[];
  wasteCases: WasteCase[];
}

export const ExecutiveDashboardPage: React.FC<ExecDashboardProps> = ({
  kpis,
  services,
  environments,
  dailyTrends,
  wasteCases
}) => {
  if (!kpis) return <div className="text-slate-400 p-6">Loading executive dashboard...</div>;

  const trendDates = dailyTrends.map(d => d.date);
  const trendCosts = dailyTrends.map(d => d.cost);

  const dailyTrendPlotData = [
    {
      x: trendDates,
      y: trendCosts,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: '#3b82f6', size: 5 },
      line: { color: '#3b82f6', width: 2.5 },
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
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
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
      marker: { color: '#6366f1' }
    }
  ];

  const wasteCategoryCounts: { [cat: string]: number } = {};
  wasteCases.filter(w => w.is_waste).forEach(w => {
    wasteCategoryCounts[w.category] = (wasteCategoryCounts[w.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Executive FinOps Dashboard</h2>
        <p className="text-xs text-slate-400">High-level cloud cost spend overview, service distribution, and waste breakdown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Cloud Spend"
          value={`$${kpis.total_spend.toLocaleString()}`}
          subtitle="60-Day Aggregate"
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Recent 7-Day Spend"
          value={`$${kpis.recent_7d_spend.toLocaleString()}`}
          trend={`${kpis.spend_pct_change_7d > 0 ? '+' : ''}${kpis.spend_pct_change_7d}%`}
          trendType={kpis.spend_pct_change_7d > 5 ? 'negative' : 'positive'}
          icon={TrendingUp}
          color="indigo"
        />
        <MetricCard
          title="Flagged Anomalies"
          value={kpis.total_anomalies}
          subtitle="Statistical baseline deviations"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CostChart
            data={dailyTrendPlotData}
            title="Daily Cloud Spending Trend ($)"
          />
        </div>
        <div>
          <CostChart
            data={servicePlotData}
            title="Spend Distribution by AWS Service"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostChart
          data={envPlotData}
          title="Cloud Spend by Environment"
        />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Waste Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(wasteCategoryCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div className="flex items-center space-x-2.5">
                  <Flame className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-semibold text-slate-200">{cat}</span>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
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
