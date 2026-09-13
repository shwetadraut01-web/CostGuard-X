import React, { useState } from 'react';
import type { WasteCase } from '../types';
import { Flame, ArrowRight, HelpCircle } from 'lucide-react';

interface WasteIntelligenceProps {
  wasteCases: WasteCase[];
  onSelectResource: (resourceId: string) => void;
}

export const WasteIntelligencePage: React.FC<WasteIntelligenceProps> = ({
  wasteCases,
  onSelectResource
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredCases = wasteCases.filter(w => {
    if (!w.is_waste) return false;
    if (selectedCategory === 'ALL') return true;
    return w.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = [
    'ALL',
    'Idle Resource',
    'Over-provisioning',
    'Non-production Waste',
    'Abnormal Storage Growth',
    'Cost Spike'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Waste Intelligence & Fingerprinting</h2>
        <p className="text-xs text-slate-400">
          Rule-based explainable waste categories, transparent 0-100 confidence matrix, and safety-aware advisory recommendations.
        </p>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCases.map((item) => (
          <div
            key={item.resource_id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-blue-300">{item.resource_id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center space-x-1">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{item.category}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {item.environment.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Service: <span className="text-slate-200 font-semibold">{item.service} ({item.instance_type})</span> | App: <span className="text-slate-200 font-semibold">{item.application}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Waste Confidence</div>
                <div className="text-lg font-black text-amber-400">
                  {item.confidence.score}/100 <span className="text-xs font-normal text-slate-400">({item.confidence.confidence_level})</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-3.5 border border-slate-700/50 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                <span>Analytical Evidence & Justification:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300 pl-5 list-disc">
                {item.recommendation.evidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="md:col-span-2 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Primary Advisory Action</div>
                <p className="text-xs text-emerald-300 font-semibold">
                  {item.recommendation.primary_recommendation}
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  {item.recommendation.advisory_notice}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Est. Avoidable Spend</div>
                  <div className="text-base font-extrabold text-emerald-400">
                    ${item.counterfactual.potential_avoidable_monthly}/mo
                  </div>
                </div>
                <button
                  onClick={() => onSelectResource(item.resource_id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1"
                >
                  <span>Investigate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
