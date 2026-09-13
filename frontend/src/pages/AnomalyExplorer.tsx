import React, { useState } from 'react';
import type { AnomalyRecord } from '../types';
import { AlertTriangle, Filter, Eye } from 'lucide-react';

interface AnomalyExplorerProps {
  anomalies: AnomalyRecord[];
  onSelectResource: (resourceId: string) => void;
}

export const AnomalyExplorerPage: React.FC<AnomalyExplorerProps> = ({
  anomalies,
  onSelectResource
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);

  const filteredAnomalies = anomalies.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Statistical Anomaly Explorer (No-ML)</h2>
        <p className="text-xs text-slate-400">
          Flagged statistical anomalies detected using Moving Averages, Standard Z-score, and Robust Median Absolute Deviation (MAD Z-Score).
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          <Filter className="h-4 w-4 text-blue-400" />
          <span className="font-semibold text-slate-300">Filter by Severity:</span>
          {['ALL', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Flagged: {filteredAnomalies.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Resource ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Service / Env</th>
                <th className="px-4 py-3">Detection Method</th>
                <th className="px-4 py-3 text-center">Robust MAD Z</th>
                <th className="px-4 py-3 text-right">Baseline Cost</th>
                <th className="px-4 py-3 text-right">Current Cost</th>
                <th className="px-4 py-3 text-center">Severity</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAnomalies.map((anom, idx) => (
                <tr key={`${anom.resource_id}-${idx}`} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono text-blue-300 font-semibold">{anom.resource_id}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{anom.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{anom.service}</span>
                    <span className="text-[10px] text-slate-400 block">{anom.environment.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{anom.detection_method}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-amber-400">{anom.robust_mad_z_score}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">${anom.baseline_cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-red-400">${anom.current_cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      anom.severity === 'High'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {anom.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedAnomaly(anom)}
                      className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-1.5 rounded transition"
                      title="Inspect detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAnomaly && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Statistical Anomaly Breakdown</h3>
              </div>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Resource ID:</span>
                <span className="font-mono text-blue-300 font-bold">{selectedAnomaly.resource_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Detection Method:</span>
                <span className="text-white font-medium">{selectedAnomaly.detection_method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Standard Z-Score:</span>
                <span className="font-mono font-bold text-amber-400">{selectedAnomaly.z_score}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Robust MAD Z-Score:</span>
                <span className="font-mono font-bold text-amber-400">{selectedAnomaly.robust_mad_z_score}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Baseline Cost:</span>
                <span className="font-mono text-slate-300">${selectedAnomaly.baseline_cost.toFixed(2)}/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Cost:</span>
                <span className="font-mono font-bold text-red-400">${selectedAnomaly.current_cost.toFixed(2)}/day</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Deviation Amount:</span>
                <span className="font-mono font-bold text-red-400">+${selectedAnomaly.deviation_amount.toFixed(2)}/day</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => {
                  const rid = selectedAnomaly.resource_id;
                  setSelectedAnomaly(null);
                  onSelectResource(rid);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Resource Deep Dive &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
