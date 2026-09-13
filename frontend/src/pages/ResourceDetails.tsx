import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HardDrive, ShieldAlert, ArrowLeft, Clock } from 'lucide-react';

interface ResourceDetailsProps {
  resourceId: string;
  onBack: () => void;
}

export const ResourceDetailsPage: React.FC<ResourceDetailsProps> = ({
  resourceId,
  onBack
}) => {
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

  if (loading) return <div className="text-slate-400 p-6">Loading resource details for {resourceId}...</div>;
  if (!details) return <div className="text-slate-400 p-6">Resource '{resourceId}' not found.</div>;

  const waste = details.waste_details;
  const events = details.temporal_events || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-blue-400" />
            <span className="font-mono">{resourceId}</span>
          </h2>
          <p className="text-xs text-slate-400">Detailed resource timeline, metric correlation, waste evaluation, and event logs.</p>
        </div>
      </div>

      {waste && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Service</span>
              <span className="font-bold text-white text-sm">{waste.service} ({waste.instance_type})</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Environment</span>
              <span className="font-bold text-white text-sm">{waste.environment}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Avg CPU Load</span>
              <span className="font-bold text-amber-400 text-sm">{waste.cpu_utilization}%</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Daily Runtime</span>
              <span className="font-bold text-indigo-400 text-sm">{waste.runtime_hours} hrs/day</span>
            </div>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Temporal Infrastructure Event Correlation</span>
          </div>
          <div className="space-y-2">
            {events.map((ev: any, idx: number) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300">
                <div className="font-semibold text-blue-300">{ev.event_name} ({ev.event_type})</div>
                <p className="text-slate-400 mt-1">{ev.correlation_statement}</p>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">Timestamp: {ev.event_timestamp} | User: {ev.user_or_role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {waste && waste.counterfactual && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-800/40 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
            <span>Counterfactual Avoidable Cost Estimation</span>
          </h3>
          <p className="text-xs text-slate-300">{waste.counterfactual.scenario_description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Current Monthly</span>
              <span className="font-bold text-slate-200 text-sm">${waste.counterfactual.current_monthly_cost}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Counterfactual Monthly</span>
              <span className="font-bold text-indigo-300 text-sm">${waste.counterfactual.counterfactual_monthly_cost}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Avoidable Monthly</span>
              <span className="font-bold text-emerald-400 text-sm">${waste.counterfactual.potential_avoidable_monthly}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Savings %</span>
              <span className="font-bold text-emerald-400 text-sm">${waste.counterfactual.percentage_savings}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
