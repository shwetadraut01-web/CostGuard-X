import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Search,
  AlertTriangle,
  Flame,
  HardDrive,
  Sliders,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  anomaliesCount?: number;
  wasteCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  anomaliesCount = 0,
  wasteCount = 0
}) => {
  const navItems = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'dashboard', label: '2. Executive Dashboard', icon: BarChart3 },
    { id: 'explorer', label: '3. Cost Explorer', icon: Search },
    { id: 'anomalies', label: '4. Anomaly Explorer', icon: AlertTriangle, badge: anomaliesCount },
    { id: 'waste', label: '5. Waste Intelligence', icon: Flame, badge: wasteCount },
    { id: 'resource', label: '6. Resource Details', icon: HardDrive },
    { id: 'simulator', label: '7. What-If Simulator', icon: Sliders },
    { id: 'ai-explanation', label: '8. AI Explanation', icon: Sparkles },
    { id: 'methodology', label: '9. Methodology / About', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation Pages
        </div>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow'
                    : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.id === 'anomalies' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
          <BookOpen className="h-4 w-4 text-blue-400" />
          <span>FinOps Advisory</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          CostGuard-X provides read-only recommendations. No automatic AWS changes are executed.
        </p>
      </div>
    </aside>
  );
};
