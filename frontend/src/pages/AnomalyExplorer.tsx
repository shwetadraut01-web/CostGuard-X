import React, { useState } from 'react';
import type { AnomalyRecord } from '../types';
import { AlertTriangle, Filter, Eye } from 'lucide-react';

import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface AnomalyExplorerProps {
  anomalies: AnomalyRecord[];
  onSelectResource: (resourceId: string) => void;
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const AnomalyExplorerPage: React.FC<AnomalyExplorerProps> = ({
  anomalies,
  onSelectResource,
  currency: _currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);

  const filteredAnomalies = anomalies.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Statistical Anomaly Explorer (No-ML)
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Flagged statistical anomalies detected using Moving Averages, Standard Z-score, and Robust Median Absolute Deviation (MAD Z-Score).
        </p>
      </div>

      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3 text-xs">
          <Filter className="h-4 w-4 text-blue-500" />
          <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Filter by Severity:</span>
          {['ALL', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white shadow'
                  : (isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Total Flagged: {filteredAnomalies.length}
        </div>
      </div>

      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-4`}>
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <thead className={`${
              isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
            } uppercase font-semibold text-[10px] tracking-wider border-b`}>
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
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {filteredAnomalies.map((anom, idx) => (
                <tr key={`${anom.resource_id}-${idx}`} className={`${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'} transition`}>
                  <td className={`px-4 py-3 font-mono font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{anom.resource_id}</td>
                  <td className={`px-4 py-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{anom.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{anom.service}</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{anom.environment.toUpperCase()}</span>
                  </td>
                  <td className={`px-4 py-3 max-w-xs truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{anom.detection_method}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400">{anom.robust_mad_z_score}</td>
                  <td className={`px-4 py-3 text-right font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>${anom.baseline_cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-600 dark:text-red-400">${anom.current_cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      anom.severity === 'High'
                        ? (isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-rose-50 text-rose-800 border border-rose-200')
                        : (isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-800 border border-amber-200')
                    }`}>
                      {anom.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedAnomaly(anom)}
                      className={`${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-blue-700'
                      } p-1.5 rounded transition`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
          } border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Statistical Anomaly Breakdown</h3>
              </div>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className={`${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'} text-xs font-bold px-2 py-1 rounded`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Resource ID:</span>
                <span className="font-mono text-blue-600 dark:text-blue-300 font-bold">{selectedAnomaly.resource_id}</span>
              </div>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Detection Method:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedAnomaly.detection_method}</span>
              </div>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Standard Z-Score:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{selectedAnomaly.z_score}</span>
              </div>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Robust MAD Z-Score:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{selectedAnomaly.robust_mad_z_score}</span>
              </div>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Baseline Cost:</span>
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>${selectedAnomaly.baseline_cost.toFixed(2)}/day</span>
              </div>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Current Cost:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-red-400">${selectedAnomaly.current_cost.toFixed(2)}/day</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Deviation Amount:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-red-400">+${selectedAnomaly.deviation_amount.toFixed(2)}/day</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => {
                  const rid = selectedAnomaly.resource_id;
                  setSelectedAnomaly(null);
                  onSelectResource(rid);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
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
