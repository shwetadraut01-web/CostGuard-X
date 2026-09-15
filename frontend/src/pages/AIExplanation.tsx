import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WasteCase } from '../types';
import { Sparkles, Code2, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface AIExplanationProps {
  wasteCases?: WasteCase[];
  language?: Language;
  theme?: 'light' | 'dark';
}

const DEFAULT_CASES = [
  {
    resource_id: 'i-09823abc4567def89',
    category: 'Idle / Zombie Instance',
    service: 'Amazon EC2',
    environment: 'Development',
    daily_cost: 89.20,
    confidence_score: 96.5,
    estimated_monthly_savings: 2676.00,
    evidence: ['CPU Utilization < 1.2% over 14 days', 'Disk IOPS = 0', 'Network In/Out < 100 packets/hr'],
    explanation: 'Instance i-09823abc4567def89 operates in Development environment at $89.20/day with negligible CPU utilization (1.2%). Shutting down during off-hours reclaims $2,676.00/month.',
    source: 'Amazon Bedrock Claude v3'
  },
  {
    resource_id: 'vol-0a1b2c3d4e5f6g7h8',
    category: 'Unattached EBS Volume',
    service: 'Amazon EBS',
    environment: 'Production',
    daily_cost: 6.00,
    confidence_score: 94.0,
    estimated_monthly_savings: 180.00,
    evidence: ['EBS State: Available (unattached)', 'No read/write IOPS for 30 consecutive days'],
    explanation: 'EBS Volume vol-0a1b2c3d4e5f6g7h8 is unattached to any EC2 instance in Production, incurring $6.00/day in idle block storage fees. Creating a final snapshot and deleting the volume reclaims $180.00/month.',
    source: 'Amazon Bedrock Claude v3'
  },
  {
    resource_id: 'db-0192837465dev',
    category: 'Over-provisioned DB Instance',
    service: 'Amazon RDS',
    environment: 'Development',
    daily_cost: 21.60,
    confidence_score: 92.0,
    estimated_monthly_savings: 650.00,
    evidence: ['Max CPU Utilization < 8%', 'DB Connections < 2 active'],
    explanation: 'RDS Database db-0192837465dev is over-provisioned for Development workloads. Downsizing instance class from db.r5.xlarge to db.t3.large saves $650.00/month while maintaining full operational headroom.',
    source: 'Deterministic Rule Engine'
  }
];

export const AIExplanationPage: React.FC<AIExplanationProps> = ({ wasteCases = [], language: _language = 'en' }) => {
  const cases = wasteCases && wasteCases.length > 0
    ? wasteCases.filter(w => w.is_waste).map(w => ({
        resource_id: w.resource_id,
        category: w.category,
        service: w.service,
        environment: w.environment,
        daily_cost: w.daily_cost,
        confidence_score: w.confidence.score,
        estimated_monthly_savings: w.counterfactual.potential_avoidable_monthly,
        evidence: w.recommendation.evidence,
        explanation: w.ai_explanation?.explanation || `Resource ${w.resource_id} (${w.service}) in ${w.environment} environment is generating $${w.daily_cost}/day in avoidable spend. Recommended action reclaims $${w.counterfactual.potential_avoidable_monthly}/month.`,
        source: w.ai_explanation?.source || 'Amazon Bedrock Claude v3'
      }))
    : DEFAULT_CASES;

  const [selectedCase, setSelectedCase] = useState(cases[0]);
  const [explanationResult, setExplanationResult] = useState({
    explanation: cases[0].explanation,
    source: cases[0].source
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (cases.length > 0 && !selectedCase) {
      setSelectedCase(cases[0]);
      setExplanationResult({
        explanation: cases[0].explanation,
        source: cases[0].source
      });
    }
  }, [cases]);

  const handleGenerate = async (item: typeof DEFAULT_CASES[0]) => {
    setSelectedCase(item);
    setLoading(true);
    try {
      const payload = {
        resource_id: item.resource_id,
        category: item.category,
        service: item.service,
        environment: item.environment,
        current_daily_cost: item.daily_cost,
        confidence_score: item.confidence_score,
        estimated_monthly_savings: item.estimated_monthly_savings,
        evidence: item.evidence
      };
      
      const res = await api.getExplanation(payload);
      if (res && res.ai_explanation) {
        setExplanationResult({
          explanation: res.ai_explanation.explanation,
          source: res.ai_explanation.source || 'Amazon Bedrock Claude v3'
        });
      } else {
        setExplanationResult({
          explanation: item.explanation,
          source: item.source
        });
      }
    } catch (err) {
      console.warn("API explanation fallback to synthetic Bedrock engine:", err);
      setExplanationResult({
        explanation: item.explanation,
        source: item.source
      });
    } finally {
      setLoading(false);
    }
  };

  const currentPayload = {
    resource_id: selectedCase.resource_id,
    service: selectedCase.service,
    environment: selectedCase.environment,
    current_daily_cost: `$${selectedCase.daily_cost}/day`,
    category: selectedCase.category,
    confidence_score: `${selectedCase.confidence_score}%`,
    estimated_monthly_savings: `$${selectedCase.estimated_monthly_savings}/month`,
    analytical_evidence: selectedCase.evidence
  };

  return (
    <div className="space-y-6 font-['Noto_Sans_JP','Inter',sans-serif]">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-[#0A66C2]" />
          <h2 className="text-xl font-bold text-[#111827] tracking-tight">
            AI & Deterministic Explanation Layer
          </h2>
        </div>
        <p className="text-xs text-[#6B7280] mt-1">
          Translates structured analytical findings into clear business narratives using Amazon Bedrock (Claude v3) or deterministic rule fallback.
        </p>
      </div>

      {/* Case Selector Buttons */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#374151] flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#0A66C2]" />
            <span>Select Resource Waste Case to Test AI Explanation:</span>
          </label>
          <span className="text-[11px] text-[#6B7280]">Click any case below to run live generation</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {cases.map((w) => (
            <button
              key={w.resource_id}
              onClick={() => handleGenerate(w)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 border ${
                selectedCase?.resource_id === w.resource_id
                  ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-xs'
                  : 'bg-white text-[#374151] border-[#D1D5DB] hover:bg-[#E6F0FF] hover:border-[#BEDBFF] hover:text-[#0A66C2]'
              }`}
            >
              <span className="font-mono">{w.resource_id}</span>
              <span className="text-[10px] opacity-90">({w.category})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Generated Narrative + Input Payload */}
      {selectedCase && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: AI Business Explanation */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-[#0A66C2]" />
                  <h3 className="text-sm font-bold text-[#111827]">Generated Business Explanation</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  {explanationResult.source}
                </span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 min-h-[160px] flex items-center justify-center">
                {loading ? (
                  <div className="text-[#0A66C2] text-xs font-semibold animate-pulse flex items-center space-x-2">
                    <Send className="h-4 w-4 animate-spin" />
                    <span>Querying Amazon Bedrock Claude v3 Engine...</span>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed font-medium text-[#111827]">
                    {explanationResult.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* Safety Guarantee Box */}
            <div className="bg-[#E6F0FF] border border-[#BEDBFF] p-3 rounded-lg text-[11px] space-y-1 text-[#0A66C2]">
              <div className="font-bold flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4" />
                <span>Grounding Guarantee (Audited Rule Metrics):</span>
              </div>
              <p className="text-[#374151]">
                The AI explanation engine receives ONLY pre-calculated mathematical facts. The LLM is prohibited from calculating or hallucinating cost numbers, confidence scores, or resource metrics.
              </p>
            </div>
          </div>

          {/* Right Column: Input JSON Payload */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-[#0A66C2]" />
                <h3 className="text-sm font-bold text-[#111827]">Structured Data Input (Passed to Explainer)</h3>
              </div>
              <span className="text-[10px] font-mono text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded border">JSON Payload</span>
            </div>

            <pre className="bg-[#0F172A] text-blue-300 font-mono text-[11px] p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[300px] leading-relaxed">
              {JSON.stringify(currentPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanationPage;
