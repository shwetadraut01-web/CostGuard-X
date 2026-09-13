import React, { useState } from 'react';
import type { DailyTrend, ServiceCost, EnvironmentCost } from '../types';
import { CostChart } from '../components/CostChart';
import { Filter, Search } from 'lucide-react';

interface CostExplorerProps {
  dailyTrends: DailyTrend[];
  resourceSpend: any[];
  services: ServiceCost[];
  environments: EnvironmentCost[];
}

export const CostExplorerPage: React.FC<CostExplorerProps> = ({
  dailyTrends,
  resourceSpend,
  services,
  environments
}) => {
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
      line: { color: '#8b5cf6', width: 2 },
      name: 'Cumulative Cost ($)'
    }
  ];

  const dailyPlotData = [
    {
      x: dailyTrends.map(d => d.date),
      y: dailyTrends.map(d => d.cost),
      type: 'bar',
      marker: { color: '#3b82f6' },
      name: 'Daily Cost ($)'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Cost Explorer</h2>
        <p className="text-xs text-slate-400">Interactive cloud spend timeline, cumulative cost growth, and resource granularity.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <Filter className="h-4 w-4 text-blue-400" />
          <span>Filters:</span>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">AWS Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Services</option>
            {services.map(s => (
              <option key={s.service} value={s.service}>{s.service}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Environment</label>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Environments</option>
            {environments.map(e => (
              <option key={e.environment} value={e.environment}>{e.environment.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] text-slate-400 block mb-1">Search Resource ID</label>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. i-0dev1234..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg pl-9 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostChart data={dailyPlotData} title="Daily Cloud Spend Breakdown ($)" />
        <CostChart data={cumulativePlotData} title="Cumulative Spend Growth ($)" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Resource Granularity & Spend Allocation</h3>
          <span className="text-xs text-slate-400">{filteredResources.length} resources shown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Resource ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Environment</th>
                <th className="px-4 py-3 text-right">Total Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredResources.map((res) => (
                <tr key={res.resource_id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono text-blue-300 font-semibold">{res.resource_id}</td>
                  <td className="px-4 py-3">{res.service}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {res.environment.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">${res.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
