import React, { useState } from 'react';
import type { WasteCase } from '../types';
import { Flame, ArrowRight, HelpCircle } from 'lucide-react';

import { formatCurrency, type CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface WasteIntelligenceProps {
  wasteCases: WasteCase[];
  onSelectResource: (resourceId: string) => void;
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const WasteIntelligencePage: React.FC<WasteIntelligenceProps> = ({
  wasteCases,
  onSelectResource,
  currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
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
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Waste Intelligence & Fingerprinting
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Rule-based explainable waste categories, transparent 0-100 confidence matrix, and safety-aware advisory recommendations.
        </p>
      </div>

      <div className={`flex items-center space-x-2 overflow-x-auto pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow'
                : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs')
            } border`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCases.map((item) => (
          <div
            key={item.resource_id}
            className={`${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm hover:shadow'
            } border rounded-xl p-5 space-y-4 transition`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className={`font-mono text-sm font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{item.resource_id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1 ${
                    isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <Flame className="h-3.5 w-3.5" />
                    <span>{item.category}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  } border`}>
                    {item.environment.toUpperCase()}
                  </span>
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Service: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.service} ({item.instance_type})</span> | App: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.application}</span>
                </div>
              </div>

              <div className={`${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/60 border-amber-200'
              } border px-4 py-2 rounded-xl text-right`}>
                <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-amber-800'}`}>Waste Confidence</div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {item.confidence.score}/100 <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>({item.confidence.confidence_level})</span>
                </div>
              </div>
            </div>

            <div className={`${
              isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            } rounded-lg p-3.5 border space-y-2`}>
              <div className={`text-xs font-semibold flex items-center space-x-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                <span>Analytical Evidence & Justification:</span>
              </div>
              <ul className={`space-y-1 text-xs pl-5 list-disc ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {item.recommendation.evidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="md:col-span-2 space-y-1">
                <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Primary Advisory Action</div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                  {item.recommendation.primary_recommendation}
                </p>
                <p className={`text-[11px] italic ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {item.recommendation.advisory_notice}
                </p>
              </div>

              <div className={`${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-emerald-50/50 border-emerald-200'
              } p-3 rounded-lg border flex items-center justify-between`}>
                <div>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>Est. Avoidable Spend</div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(item.counterfactual.potential_avoidable_monthly, currency)}/mo
                  </div>
                  <div className={`text-[10px] font-semibold ${isDark ? 'text-emerald-300/80' : 'text-emerald-800'}`}>
                    ({formatCurrency(item.counterfactual.potential_avoidable_monthly * 12, currency)}/yr)
                  </div>
                </div>
                <button
                  onClick={() => onSelectResource(item.resource_id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1 shadow-xs"
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
