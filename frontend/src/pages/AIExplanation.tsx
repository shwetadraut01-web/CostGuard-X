import React, { useState } from 'react';
import { api } from '../services/api';
import type { WasteCase } from '../types';
import { Sparkles, Code2, Send } from 'lucide-react';

import type { Language } from '../utils/i18n';

interface AIExplanationProps {
  wasteCases: WasteCase[];
  language?: Language;
}

export const AIExplanationPage: React.FC<AIExplanationProps> = ({ wasteCases, language: _language = 'en' }) => {
  const [selectedCase, setSelectedCase] = useState<WasteCase | null>(wasteCases[0] || null);
  const [explanationResult, setExplanationResult] = useState<any>(selectedCase?.ai_explanation || null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (item: WasteCase) => {
    setSelectedCase(item);
    setLoading(true);
    try {
      const payload = {
        resource_id: item.resource_id,
        category: item.category,
        service: item.service,
        environment: item.environment,
        current_daily_cost: item.daily_cost,
        confidence_score: item.confidence.score,
        estimated_monthly_savings: item.counterfactual.potential_avoidable_monthly,
        evidence: item.recommendation.evidence
      };
      const res = await api.getExplanation(payload);
      setExplanationResult(res.ai_explanation);
    } catch (err) {
      console.error("Failed to generate explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">AI & Deterministic Explanation Layer</h2>
        <p className="text-xs text-slate-400">
          Translates structured analytical findings into business explanations using Amazon Bedrock or deterministic template fallback.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">Select Waste Case to Explain:</label>
        <div className="flex space-x-2">
          {wasteCases.filter(w => w.is_waste).map((w) => (
            <button
              key={w.resource_id}
              onClick={() => handleGenerate(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCase?.resource_id === w.resource_id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {w.resource_id} ({w.category})
            </button>
          ))}
        </div>
      </div>

      {selectedCase && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Generated Business Explanation</h3>
                </div>
                {explanationResult && (
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    explanationResult.source.includes('Bedrock')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  }`}>
                    {explanationResult.source}
                  </span>
                )}
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 min-h-[160px] flex items-center justify-center">
                {loading ? (
                  <div className="text-slate-400 text-xs animate-pulse flex items-center space-x-2">
                    <Send className="h-4 w-4 animate-spin text-blue-400" />
                    <span>Generating business language explanation...</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {explanationResult?.explanation || "Select a resource above to generate an explanation."}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Grounding Guarantee:</div>
              <p>
                The explanation engine receives ONLY pre-calculated structured data. The LLM is prohibited from hallucinating cost numbers, metrics, or resources.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Code2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Structured Data Input (Passed to Explainer)</h3>
            </div>
            <pre className="bg-slate-950 text-blue-300 text-[11px] font-mono p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[300px]">
              {JSON.stringify(explanationResult?.structured_data || {
                resource_id: selectedCase.resource_id,
                service: selectedCase.service,
                environment: selectedCase.environment,
                current_daily_cost: selectedCase.daily_cost,
                category: selectedCase.category,
                confidence_score: selectedCase.confidence.score,
                estimated_monthly_savings: selectedCase.counterfactual.potential_avoidable_monthly,
                evidence: selectedCase.recommendation.evidence
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
