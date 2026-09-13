import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import type { SummaryKPIs, ServiceCost, EnvironmentCost, DailyTrend, AnomalyRecord, WasteCase } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/Overview';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboard';
import { CostExplorerPage } from './pages/CostExplorer';
import { AnomalyExplorerPage } from './pages/AnomalyExplorer';
import { WasteIntelligencePage } from './pages/WasteIntelligence';
import { ResourceDetailsPage } from './pages/ResourceDetails';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulator';
import { AIExplanationPage } from './pages/AIExplanation';
import { MethodologyPage } from './pages/Methodology';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  const [kpis, setKpis] = useState<SummaryKPIs | null>(null);
  const [services, setServices] = useState<ServiceCost[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentCost[]>([]);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [resourceSpend, setResourceSpend] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [wasteCases, setWasteCases] = useState<WasteCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const summaryData = await api.getSummary();
      setKpis(summaryData.kpis);
      setServices(summaryData.cost_by_service || []);
      setEnvironments(summaryData.cost_by_environment || []);

      const trendData = await api.getCostTrends();
      setDailyTrends(trendData.daily_trends || []);
      setResourceSpend(trendData.resource_spend || []);

      const anomalyData = await api.getAnomalies();
      setAnomalies(anomalyData.anomalies || []);

      const wasteData = await api.getWasteCases();
      setWasteCases(wasteData.waste_cases || []);
    } catch (err) {
      console.error("Error loading API data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (tab: string, resourceId?: string) => {
    if (resourceId) {
      setSelectedResourceId(resourceId);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header onRefresh={loadData} isLoading={loading} />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          anomaliesCount={kpis?.total_anomalies}
          wasteCount={kpis?.total_waste_cases}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          {activeTab === 'overview' && (
            <OverviewPage
              kpis={kpis}
              wasteCases={wasteCases}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'dashboard' && (
            <ExecutiveDashboardPage
              kpis={kpis}
              services={services}
              environments={environments}
              dailyTrends={dailyTrends}
              wasteCases={wasteCases}
            />
          )}

          {activeTab === 'explorer' && (
            <CostExplorerPage
              dailyTrends={dailyTrends}
              resourceSpend={resourceSpend}
              services={services}
              environments={environments}
            />
          )}

          {activeTab === 'anomalies' && (
            <AnomalyExplorerPage
              anomalies={anomalies}
              onSelectResource={(rid) => handleNavigate('resource', rid)}
            />
          )}

          {activeTab === 'waste' && (
            <WasteIntelligencePage
              wasteCases={wasteCases}
              onSelectResource={(rid) => handleNavigate('resource', rid)}
            />
          )}

          {activeTab === 'resource' && (
            <ResourceDetailsPage
              resourceId={selectedResourceId || (wasteCases[0]?.resource_id || 'i-0dev123456789a')}
              onBack={() => setActiveTab('waste')}
            />
          )}

          {activeTab === 'simulator' && <WhatIfSimulatorPage />}

          {activeTab === 'ai-explanation' && <AIExplanationPage wasteCases={wasteCases} />}

          {activeTab === 'methodology' && <MethodologyPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
