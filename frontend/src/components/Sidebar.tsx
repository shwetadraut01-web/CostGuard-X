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
  ShieldCheck,
  Building2
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
}) => {
  const t = (key: string) => getTranslation(language, key);

  const navItems = [
    { id: 'jp', key: 'nav.jp_b2b', icon: Building2, highlight: true },
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
    <aside className="w-64 bg-white border-r border-[#E5E7EB] text-[#374151] shadow-xs min-h-screen flex flex-col justify-between p-4 shrink-0 font-['Noto_Sans_JP','Inter',sans-serif]">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
          {language === 'ja' ? 'FinOps モジュール' : 'FinOps Modules'}
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#E6F0FF] text-[#0A66C2] border border-[#BEDBFF] shadow-xs font-bold'
                    : item.highlight
                    ? 'bg-blue-50/70 text-[#0A66C2] hover:bg-[#E6F0FF] border border-blue-200/60'
                    : 'hover:bg-gray-100 text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-[#0A66C2]' : item.highlight ? 'text-[#0A66C2]' : 'text-[#6B7280]'
                  }`} />
                  <span className="truncate">{label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.id === 'anomalies'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-[#DC2626] border border-rose-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3.5 text-xs mt-6 text-[#374151]">
        <div className="flex items-center space-x-2 font-bold mb-1 text-[#111827]">
          <ShieldCheck className="h-4 w-4 text-[#059669]" />
          <span>{t('footer.advisory_title')}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#6B7280]">
          {t('footer.advisory_desc')}
        </p>
      </div>
    </aside>
  );
};
