import React, { useState } from 'react';
import type { DailyTrend, ServiceCost, EnvironmentCost } from '../types';
import { CostChart } from '../components/CostChart';
import { Filter, Search } from 'lucide-react';

import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';

interface CostExplorerProps {
  dailyTrends: DailyTrend[];
  resourceSpend: any[];
  services: ServiceCost[];
  environments: EnvironmentCost[];
  currency?: CurrencyCode;
  language?: Language;
  theme?: 'light' | 'dark';
}

export const CostExplorerPage: React.FC<CostExplorerProps> = ({
  dailyTrends,
  resourceSpend,
  services,
  environments,
  currency: _currency = 'USD',
  language: _language = 'en',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedEnv, setSelectedEnv] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredResources = resourceSpend.filter(r => {
    const matchService = selectedService === 'ALL' || r.service.toLowerCase() === selectedService.toLowerCase();
    const matchEnv = selectedEnv === 'ALL' || r.environment.toLowerCase() === selectedEnv.toLowerCase();
    const matchSearch = searchTerm === '' || r.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchService && matchEnv && matchSearch;
  });

  let runningTotal = 0;
  const cumulativeDates = dailyTrends.map(d => d.date);
  const cumulativeCosts = dailyTrends.map(d => {
    runningTotal += d.cost;
    return runningTotal;
  });

  const cumulativePlotData = [
    {
      x: cumulativeDates,
      y: cumulativeCosts,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      line: { color: '#7c3aed', width: 2 },
      name: 'Cumulative Cost ($)'
    }
  ];

  const dailyPlotData = [
    {
      x: dailyTrends.map(d => d.date),
      y: dailyTrends.map(d => d.cost),
      type: 'bar',
      marker: { color: '#2563eb' },
      name: 'Daily Cost ($)'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Cost Explorer
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Interactive cloud spend timeline, cumulative cost growth, and resource granularity.
        </p>
      </div>

      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-4 flex flex-wrap items-center gap-4`}>
        <div className={`flex items-center space-x-2 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <Filter className="h-4 w-4 text-blue-500" />
          <span>Filters:</span>
        </div>

        <div>
          <label className={`text-[10px] block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AWS Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={`${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900 font-medium'
            } border text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500`}
          >
            <option value="ALL">All Services</option>
            {services.map(s => (
              <option key={s.service} value={s.service}>{s.service}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`text-[10px] block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Environment</label>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className={`${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900 font-medium'
            } border text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500`}
          >
            <option value="ALL">All Environments</option>
            {environments.map(e => (
              <option key={e.environment} value={e.environment}>{e.environment.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className={`text-[10px] block mb-1 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Search Resource ID</label>
          <div className="relative">
            <Search className={`h-3.5 w-3.5 absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="e.g. i-0dev1234..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              } border text-xs rounded-lg pl-9 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-500`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostChart data={dailyPlotData} title="Daily Cloud Spend Breakdown ($)" theme={theme} />
        <CostChart data={cumulativePlotData} title="Cumulative Spend Growth ($)" theme={theme} />
      </div>

      <div className={`${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } border rounded-xl p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Resource Granularity & Spend Allocation
          </h3>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{filteredResources.length} resources shown</span>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <thead className={`${
              isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
            } uppercase font-semibold text-[10px] tracking-wider border-b`}>
              <tr>
                <th className="px-4 py-3">Resource ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Environment</th>
                <th className="px-4 py-3 text-right">Total Cost ($)</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {filteredResources.map((res) => (
                <tr key={res.resource_id} className={`${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'} transition`}>
                  <td className={`px-4 py-3 font-mono font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{res.resource_id}</td>
                  <td className="px-4 py-3">{res.service}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                    } border`}>
                      {res.environment.toUpperCase()}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${res.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
