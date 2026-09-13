export interface SummaryKPIs {
  total_spend: number;
  recent_7d_spend: number;
  spend_pct_change_7d: number;
  total_resources: number;
  total_services: number;
  total_anomalies: number;
  total_waste_cases: number;
  total_avoidable_monthly_spend: number;
  avg_waste_confidence: number;
}

export interface ServiceCost {
  service: string;
  cost: number;
  percentage: number;
}

export interface EnvironmentCost {
  environment: string;
  cost: number;
  percentage: number;
}

export interface RegionCost {
  region: string;
  cost: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  cost: number;
}

export interface AnomalyRecord {
  resource_id: string;
  timestamp: string;
  service: string;
  region: string;
  environment: string;
  application: string;
  anomaly_status: string;
  anomaly_score: number;
  detection_method: string;
  z_score: number;
  robust_mad_z_score: number;
  baseline_cost: number;
  current_cost: number;
  deviation_amount: number;
  severity: "High" | "Medium" | "Low";
}

export interface CounterfactualSavings {
  current_daily_cost: number;
  current_monthly_cost: number;
  counterfactual_daily_cost: number;
  counterfactual_monthly_cost: number;
  potential_avoidable_daily: number;
  potential_avoidable_monthly: number;
  percentage_savings: number;
  scenario_description: string;
  disclaimer: string;
}

export interface ConfidenceResult {
  score: number;
  confidence_level: "High" | "Medium" | "Low";
  positive_factors: string[];
  negative_factors: string[];
}

export interface AdvisoryRecommendation {
  resource_id: string;
  category: string;
  confidence_score: number;
  risk_level: string;
  advisory_notice: string;
  primary_recommendation: string;
  suggested_actions: string[];
  estimated_monthly_savings: number;
  evidence: string[];
  safety_guideline: string;
}

export interface AIExplanation {
  source: string;
  model_id: string;
  explanation: string;
  structured_data: any;
}

export interface WasteCase {
  resource_id: string;
  service: string;
  instance_type: string;
  environment: string;
  application: string;
  category: string;
  is_waste: boolean;
  daily_cost: number;
  cpu_utilization: number;
  memory_utilization: number;
  runtime_hours: number;
  counterfactual: CounterfactualSavings;
  confidence: ConfidenceResult;
  recommendation: AdvisoryRecommendation;
  ai_explanation: AIExplanation;
}

export interface WhatIfSimulation {
  total_current_monthly_cost: number;
  total_counterfactual_monthly_cost: number;
  total_potential_avoidable_monthly: number;
  overall_percentage_savings: number;
  resources: any[];
}
