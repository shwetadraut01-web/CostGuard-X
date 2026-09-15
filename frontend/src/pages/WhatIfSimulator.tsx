import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WhatIfSimulation } from '../types';
import { Sliders, PiggyBank, AlertCircle } from 'lucide-react';

import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface WhatIfSimulatorProps {
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const WhatIfSimulatorPage: React.FC<WhatIfSimulatorProps> = ({
  currency: _currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [runtimeHours, setRuntimeHours] = useState<number>(10);
  const [downsizePct, setDownsizePct] = useState<number>(40);
  const [storagePct, setStoragePct] = useState<number>(65);
  const [simulation, setSimulation] = useState<WhatIfSimulation | null>(null);

  const runSimulation = async () => {
    try {
      const res = await api.runWhatIf(runtimeHours, downsizePct, storagePct);
      setSimulation(res.simulation);
    } catch (err) {
      console.error("Failed to run what-if simulation:", err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [runtimeHours, downsizePct, storagePct]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Interactive "What-If" Scenario Simulator
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Adjust hypothetical runtime and right-sizing parameters to project potential avoidable cloud spend across all identified waste resources.
        </p>
      </div>

      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-6 space-y-6`}>
        <div className={`flex items-center space-x-2 text-sm font-semibold border-b pb-3 ${
          isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'
        }`}>
          <Sliders className="h-4 w-4 text-blue-500" />
          <span>Scenario Adjustment Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Non-Prod Operating Hours:</span>
              <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{runtimeHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={runtimeHours}
              onChange={(e) => setRuntimeHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Schedule off-hours shutdown outside work day.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Instance Downsize Savings:</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{downsizePct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downsizePct}
              onChange={(e) => setDownsizePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated savings when downsizing over-provisioned tiers.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Storage Archival Discount:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{storagePct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="85"
              step="5"
              value={storagePct}
              onChange={(e) => setStoragePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Savings from S3 Glacier policies or deleting unattached volumes.</p>
          </div>
        </div>
      </div>

      {simulation && (
        <div className={`${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-md'
        } border rounded-xl p-6 space-y-6`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <PiggyBank className="h-5 w-5 text-emerald-500" />
              <span>Projected Counterfactual Savings Summary</span>
            </h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 ${
              isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <AlertCircle className="h-3.5 w-3.5" />
              <span>ESTIMATE ONLY</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className={`${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'} p-4 rounded-xl border`}>
              <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Monthly Spend</div>
              <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>${simulation.total_current_monthly_cost.toLocaleString()}</div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'} p-4 rounded-xl border`}>
              <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Counterfactual Spend</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mt-1">${simulation.total_counterfactual_monthly_cost.toLocaleString()}</div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-emerald-50/50 border-emerald-200'} p-4 rounded-xl border`}>
              <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>Potential Avoidable Spend</div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">${simulation.total_potential_avoidable_monthly.toLocaleString()}/mo</div>
            </div>

            <div className={`${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-emerald-50/50 border-emerald-200'} p-4 rounded-xl border`}>
              <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>Overall Percentage Saving</div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{simulation.overall_percentage_savings}%</div>
            </div>
          </div>

          <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Per-Resource Counterfactual Breakdown</h4>
            <div className="overflow-x-auto">
              <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <thead className={`${
                  isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                } uppercase font-semibold text-[10px] tracking-wider border-b`}>
                  <tr>
                    <th className="px-4 py-2.5">Resource ID</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-right">Current Monthly</th>
                    <th className="px-4 py-2.5 text-right">Avoidable Monthly</th>
                    <th className="px-4 py-2.5 text-right">Savings %</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {simulation.resources.map((res: any, idx: number) => (
                    <tr key={idx} className={`${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className={`px-4 py-2.5 font-mono font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{res.resource_id}</td>
                      <td className={`px-4 py-2.5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{res.category}</td>
                      <td className="px-4 py-2.5 text-right font-mono">${res.current_monthly_cost}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">${res.potential_avoidable_monthly}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">{res.percentage_savings}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
