import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WhatIfSimulation } from '../types';
import { Sliders, PiggyBank, AlertCircle } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
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
        <h2 className="text-xl font-bold text-white tracking-tight">Interactive "What-If" Scenario Simulator</h2>
        <p className="text-xs text-slate-400">
          Adjust hypothetical runtime and right-sizing parameters to project potential avoidable cloud spend across all identified waste resources.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white border-b border-slate-800 pb-3">
          <Sliders className="h-4 w-4 text-blue-400" />
          <span>Scenario Adjustment Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Non-Prod Operating Hours:</span>
              <span className="font-bold font-mono text-blue-400">{runtimeHours} hrs/day</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={runtimeHours}
              onChange={(e) => setRuntimeHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-slate-400">Schedule off-hours shutdown outside work day.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Instance Downsize Savings:</span>
              <span className="font-bold font-mono text-indigo-400">{downsizePct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downsizePct}
              onChange={(e) => setDownsizePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-[10px] text-slate-400">Estimated savings when downsizing over-provisioned tiers.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Storage Archival Discount:</span>
              <span className="font-bold font-mono text-emerald-400">{storagePct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="85"
              step="5"
              value={storagePct}
              onChange={(e) => setStoragePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-400">Savings from S3 Glacier policies or deleting unattached volumes.</p>
          </div>
        </div>
      </div>

      {simulation && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-xl p-6 space-y-6 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-emerald-400" />
              <span>Projected Counterfactual Savings Summary</span>
            </h3>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full flex items-center space-x-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>ESTIMATE ONLY</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Monthly Spend</div>
              <div className="text-2xl font-bold text-white mt-1">${simulation.total_current_monthly_cost.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Counterfactual Spend</div>
              <div className="text-2xl font-bold text-indigo-300 mt-1">${simulation.total_counterfactual_monthly_cost.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Potential Avoidable Spend</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">${simulation.total_potential_avoidable_monthly.toLocaleString()}/mo</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall Percentage Saving</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{simulation.overall_percentage_savings}%</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Per-Resource Counterfactual Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5">Resource ID</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-right">Current Monthly</th>
                    <th className="px-4 py-2.5 text-right">Avoidable Monthly</th>
                    <th className="px-4 py-2.5 text-right">Savings %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {simulation.resources.map((res: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="px-4 py-2.5 font-mono text-blue-300 font-semibold">{res.resource_id}</td>
                      <td className="px-4 py-2.5 font-semibold text-white">{res.category}</td>
                      <td className="px-4 py-2.5 text-right font-mono">${res.current_monthly_cost}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">${res.potential_avoidable_monthly}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-400">{res.percentage_savings}%</td>
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
