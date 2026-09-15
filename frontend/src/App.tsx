import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import type { SummaryKPIs, ServiceCost, EnvironmentCost, DailyTrend, AnomalyRecord, WasteCase } from './types';
import type { CurrencyCode } from './utils/currency';
import type { Language } from './utils/i18n';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboard';
import { CostExplorerPage } from './pages/CostExplorer';
import { AnomalyExplorerPage } from './pages/AnomalyExplorer';
import { WasteIntelligencePage } from './pages/WasteIntelligence';
import { ResourceDetailsPage } from './pages/ResourceDetails';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulator';
import { AIExplanationPage } from './pages/AIExplanation';
import { MethodologyPage } from './pages/Methodology';
import { JapaneseB2BPage } from './pages/JapaneseB2BPage';

const getInitialTab = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('overview')) return 'overview';
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('explorer')) return 'explorer';
    if (path.includes('anomalies')) return 'anomalies';
    if (path.includes('waste')) return 'waste';
  }
  // Primary default web application landing page is Japanese B2B pleasant light theme
  return 'jp';
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  // Global Enterprise State (Default Pleasant Japanese Light Theme)
  const theme = 'light';
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [account, setAccount] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30d');

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
    if (typeof window !== 'undefined' && window.history) {
      const targetPath = tab === 'jp' ? '/jp' : '/';
      window.history.pushState({}, '', targetPath);
    }
  };

  // Dedicated Full-Screen Standalone Japanese Enterprise B2B Dashboard
  if (activeTab === 'jp' || activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <JapaneseB2BPage
          kpis={kpis}
          wasteCases={wasteCases}
          onNavigate={handleNavigate}
          currency={currency}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-['Noto_Sans_JP','Inter',sans-serif] transition-colors duration-200">
      <Header
        onRefresh={loadData}
        isLoading={loading}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        account={account}
        onAccountChange={setAccount}
        region={region}
        onRegionChange={setRegion}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onNavigate={handleNavigate}
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          anomaliesCount={kpis?.total_anomalies}
          wasteCount={kpis?.total_waste_cases}
          language={language}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          {activeTab === 'dashboard' && (
            <ExecutiveDashboardPage
              kpis={kpis}
              services={services}
              environments={environments}
              dailyTrends={dailyTrends}
              wasteCases={wasteCases}
              currency={currency}
              language={language}
              theme={theme}
            />
          )}

          {activeTab === 'explorer' && (
            <CostExplorerPage
              dailyTrends={dailyTrends}
              resourceSpend={resourceSpend}
              services={services}
              environments={environments}
              currency={currency}
              language={language}
              theme={theme}
            />
          )}

          {activeTab === 'anomalies' && (
            <AnomalyExplorerPage
              anomalies={anomalies}
              onSelectResource={(rid) => handleNavigate('resource', rid)}
              currency={currency}
              language={language}
              theme={theme}
            />
          )}

          {activeTab === 'waste' && (
            <WasteIntelligencePage
              wasteCases={wasteCases}
              onSelectResource={(rid) => handleNavigate('resource', rid)}
              currency={currency}
              language={language}
              theme={theme}
            />
          )}

          {activeTab === 'resource' && (
            <ResourceDetailsPage
              resourceId={selectedResourceId || (wasteCases[0]?.resource_id || 'i-0dev123456789a')}
              onBack={() => setActiveTab('waste')}
              currency={currency}
              language={language}
              theme={theme}
            />
          )}

          {activeTab === 'simulator' && <WhatIfSimulatorPage currency={currency} language={language} theme={theme} />}

          {activeTab === 'ai-explanation' && <AIExplanationPage wasteCases={wasteCases} language={language} theme={theme} />}

          {activeTab === 'methodology' && <MethodologyPage language={language} theme={theme} />}
        </main>
      </div>
    </div>
  );
};

export default App;
