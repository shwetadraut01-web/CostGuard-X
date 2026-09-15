import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BookOpen, CheckCircle2, ShieldCheck, Cpu, Code2 } from 'lucide-react';

import type { Language } from '../utils/i18n';

interface MethodologyProps {
  language?: Language;
  theme?: 'light' | 'dark';
}

export const MethodologyPage: React.FC<MethodologyProps> = ({ language: _language = 'en', theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [methodology, setMethodology] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getMethodology();
        setMethodology(res);
      } catch (err) {
        console.error("Failed to load methodology:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Academic Methodology & Technical Specifications
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Transparent mathematical documentation of statistical algorithms, waste fingerprints, counterfactual equations, and FinOps constraints.
        </p>
      </div>

      {/* No-ML Constraint Banner */}
      <div className={`${
        isDark ? 'bg-blue-950/40 border-blue-800/60 text-slate-300' : 'bg-blue-50 border-blue-200 text-slate-800'
      } border rounded-xl p-5 space-y-2`}>
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300 font-bold text-sm">
          <ShieldCheck className="h-5 w-5 text-blue-500" />
          <span>Strict Deterministic & Statistical Rationale (No-ML)</span>
        </div>
        <p className="text-xs leading-relaxed">
          CostGuard-X intentionally avoids black-box machine learning models (Random Forest, XGBoost, Deep Learning, Isolation Forest). Cloud FinOps requires absolute mathematical explainability where cloud engineers can trace exactly why spend was flagged and how savings were derived.
        </p>
      </div>

      {/* Statistical Methods */}
      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-4`}>
        <h3 className={`text-sm font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Cpu className="h-4 w-4 text-amber-500" />
          <span>1. Time-Series Statistical Anomaly Detection</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className={`${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          } border p-4 rounded-lg space-y-2`}>
            <div className="font-semibold text-blue-600 dark:text-blue-300">Standard Z-Score</div>
            <div className="font-mono bg-slate-900 text-amber-400 p-2 rounded font-bold border border-slate-800">
              Z = (X - μ) / σ
            </div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Measures standard deviations from historical rolling mean μ. Flags values exceeding Z &gt; 2.0 (warning) or Z &gt; 3.0 (critical).
            </p>
          </div>

          <div className={`${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          } border p-4 rounded-lg space-y-2`}>
            <div className="font-semibold text-blue-600 dark:text-blue-300">Robust Z-Score via MAD</div>
            <div className="font-mono bg-slate-900 text-amber-400 p-2 rounded font-bold border border-slate-800">
              Robust Z = 0.6745 * (X - Median) / MAD
            </div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Uses Median Absolute Deviation MAD = Median(|X - Median|). Immune to outlier distortion in non-Gaussian cloud billing datasets.
            </p>
          </div>
        </div>
      </div>

      {/* Waste Fingerprints Matrix */}
      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-4`}>
        <h3 className={`text-sm font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <BookOpen className="h-4 w-4 text-rose-500" />
          <span>2. Configurable Waste Fingerprint Categories</span>
        </h3>

        <div className="space-y-2 text-xs">
          {methodology?.waste_fingerprints ? (
            methodology.waste_fingerprints.map((item: string, idx: number) => (
              <div key={idx} className={`${
                isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              } border p-3 rounded-lg flex items-center space-x-2`}>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))
          ) : (
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading fingerprint rules...</p>
          )}
        </div>
      </div>

      {/* Counterfactual Math */}
      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-3 text-xs`}>
        <h3 className={`text-sm font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Code2 className="h-4 w-4 text-indigo-500" />
          <span>3. Counterfactual Cost Calculation Equations</span>
        </h3>
        <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Counterfactual daily spend (C_cf) is calculated by applying scenario scaling factors:
        </p>
        <div className="font-mono bg-slate-900 text-emerald-400 p-3 rounded-lg font-bold space-y-1 border border-slate-800">
          <div>Avoidable Daily = Current Daily - C_cf</div>
          <div>Avoidable Monthly = Avoidable Daily * 30</div>
          <div>Savings % = (Avoidable Monthly / Current Monthly) * 100</div>
        </div>
      </div>
    </div>
  );
};
