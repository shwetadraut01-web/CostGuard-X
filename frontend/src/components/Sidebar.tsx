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
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import type { Language } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  anomaliesCount?: number;
  wasteCount?: number;
  language: Language;
  theme?: 'light' | 'dark';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  anomaliesCount = 0,
  wasteCount = 0,
  language,
  theme = 'light'
}) => {
  const t = (key: string) => getTranslation(language, key);
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'overview', key: 'nav.overview', icon: LayoutDashboard },
    { id: 'dashboard', key: 'nav.dashboard', icon: BarChart3 },
    { id: 'explorer', key: 'nav.explorer', icon: Search },
    { id: 'anomalies', key: 'nav.anomalies', icon: AlertTriangle, badge: anomaliesCount },
    { id: 'waste', key: 'nav.waste', icon: Flame, badge: wasteCount },
    { id: 'resource', key: 'nav.resource', icon: HardDrive },
    { id: 'simulator', key: 'nav.simulator', icon: Sliders },
    { id: 'ai-explanation', key: 'nav.ai_explanation', icon: Sparkles },
    { id: 'methodology', key: 'nav.methodology', icon: BookOpen },
  ];

  return (
    <aside className={`w-64 ${
      isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-300' : 'bg-white border-r border-slate-200 text-slate-700 shadow-sm'
    } min-h-screen flex flex-col justify-between p-4 shrink-0 transition-colors duration-150`}>
      <div>
        <div className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider ${
          isDark ? 'text-slate-500' : 'text-slate-400 font-bold'
        }`}>
          FinOps Modules
        </div>
        <nav className="mt-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = t(item.key);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? (isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm' : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs')
                    : (isDark ? 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900')
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${
                    isActive ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`} />
                  <span className="truncate">{label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.id === 'anomalies'
                      ? (isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-800 border border-amber-200')
                      : (isDark ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-rose-50 text-rose-800 border border-rose-200')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`${
        isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      } rounded-xl p-3.5 border text-xs mt-6`}>
        <div className={`flex items-center space-x-2 font-semibold mb-1 ${
          isDark ? 'text-slate-300' : 'text-slate-800'
        }`}>
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>{t('footer.advisory_title')}</span>
        </div>
        <p className={`text-[11px] leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('footer.advisory_desc')}
        </p>
      </div>
    </aside>
  );
};
