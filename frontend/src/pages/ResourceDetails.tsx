import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HardDrive, ShieldAlert, ArrowLeft, Clock } from 'lucide-react';
import { formatCurrency, type CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface ResourceDetailsProps {
  resourceId: string;
  onBack: () => void;
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const ResourceDetailsPage: React.FC<ResourceDetailsProps> = ({
  resourceId,
  onBack,
  currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await api.getResourceDetails(resourceId);
        setDetails(res);
      } catch (err) {
        console.error("Failed to load resource details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (resourceId) loadData();
  }, [resourceId]);

  if (loading) return <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'} p-6 font-medium`}>Loading resource details for {resourceId}...</div>;
  if (!details) return <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'} p-6 font-medium`}>Resource '{resourceId}' not found.</div>;

  const waste = details.waste_details;
  const events = details.temporal_events || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className={`${
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
          } p-2 rounded-lg transition`}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <HardDrive className="h-5 w-5 text-blue-500" />
            <span className="font-mono">{resourceId}</span>
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Detailed resource timeline, metric correlation, waste evaluation, and event logs.</p>
        </div>
      </div>

      {waste && (
        <div className={`${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        } border rounded-xl p-5 space-y-4`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className={`block uppercase font-semibold text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Service</span>
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{waste.service} ({waste.instance_type})</span>
            </div>
            <div>
              <span className={`block uppercase font-semibold text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Environment</span>
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{waste.environment}</span>
            </div>
            <div>
              <span className={`block uppercase font-semibold text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg CPU Load</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{waste.cpu_utilization}%</span>
            </div>
            <div>
              <span className={`block uppercase font-semibold text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Daily Runtime</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{waste.runtime_hours} hrs/day</span>
            </div>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className={`${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        } border rounded-xl p-5 space-y-3`}>
          <div className={`flex items-center space-x-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Clock className="h-4 w-4 text-indigo-500" />
            <span>Temporal Infrastructure Event Correlation</span>
          </div>
          <div className="space-y-2">
            {events.map((ev: any, idx: number) => (
              <div key={idx} className={`${
                isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              } border rounded-lg p-3 text-xs`}>
                <div className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{ev.event_name} ({ev.event_type})</div>
                <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{ev.correlation_statement}</p>
                <div className={`text-[10px] mt-1 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Timestamp: {ev.event_timestamp} | User: {ev.user_or_role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {waste && waste.counterfactual && (
        <div className={`${
          isDark
            ? 'bg-gradient-to-r from-slate-900 to-indigo-950 border-indigo-800/40 text-white'
            : 'bg-gradient-to-r from-slate-900 to-indigo-900 border-slate-800 text-white shadow-md'
        } border rounded-xl p-5 space-y-3`}>
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
            <span>Counterfactual Avoidable Cost Estimation</span>
          </h3>
          <p className="text-xs text-slate-200">{waste.counterfactual.scenario_description}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs pt-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Current Monthly</span>
              <span className="font-bold text-slate-200 text-sm">{formatCurrency(waste.counterfactual.current_monthly_cost, currency)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Counterfactual Monthly</span>
              <span className="font-bold text-indigo-300 text-sm">{formatCurrency(waste.counterfactual.counterfactual_monthly_cost, currency)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Avoidable Monthly</span>
              <span className="font-bold text-emerald-400 text-sm">{formatCurrency(waste.counterfactual.potential_avoidable_monthly, currency)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Avoidable Annualized</span>
              <span className="font-bold text-emerald-400 text-sm">{formatCurrency(waste.counterfactual.potential_avoidable_monthly * 12, currency)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Savings %</span>
              <span className="font-bold text-emerald-400 text-sm">{waste.counterfactual.percentage_savings}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
