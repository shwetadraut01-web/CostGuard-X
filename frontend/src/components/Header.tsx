import React from 'react';
import { ShieldAlert, RefreshCw, DollarSign, Calendar, Layers, MapPin, CheckCircle, Building2, Lock } from 'lucide-react';
import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  account: string;
  onAccountChange: (acc: string) => void;
  region: string;
  onRegionChange: (reg: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onNavigate?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  account,
  onAccountChange,
  region,
  onRegionChange,
  dateRange,
  onDateRangeChange,
  onNavigate,
}) => {
  const t = (key: string) => getTranslation(language, key);
  const isJP = language === 'ja';

  return (
    <header className="bg-white border-b border-[#E5E7EB] text-[#111827] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] px-6 py-3 flex flex-wrap items-center justify-between gap-4 font-['Noto_Sans_JP','Inter',sans-serif]">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate && onNavigate('jp')}>
        <div className="bg-[#0A66C2] p-2 rounded-lg text-white shadow-xs">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-[#111827] tracking-tight">{t('header.title')}</h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#E6F0FF] text-[#0A66C2] border border-[#BEDBFF]">
              {isJP ? 'AWS FinOps Enterprise JP' : 'Enterprise FinOps'}
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280]">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Center: Enterprise Trust Badges */}
      <div className="hidden lg:flex items-center space-x-4 bg-[#F8FAFC] border border-[#E5E7EB] px-3.5 py-1 rounded-md text-[11px] font-medium text-[#374151]">
        <span className="flex items-center space-x-1 text-[#059669] font-bold">
          <CheckCircle className="h-3.5 w-3.5 text-[#059669]" />
          <span>{isJP ? '請求書対応' : 'Invoice Ready'}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center space-x-1 text-[#0A66C2] font-bold">
          <Building2 className="h-3.5 w-3.5 text-[#0A66C2]" />
          <span>{isJP ? '日本リージョン対応 (Tokyo / Osaka)' : 'Multi-Region (us-east-1, Tokyo, Osaka)'}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center space-x-1 text-[#4B5563] font-bold">
          <Lock className="h-3.5 w-3.5 text-[#4B5563]" />
          <span>{isJP ? 'SOC2準拠' : 'SOC2 Compliant'}</span>
        </span>
      </div>

      {/* Global Controls Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Account Selector */}
        <div className="flex items-center space-x-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#374151]">
          <Layers className="h-3.5 w-3.5 text-[#0A66C2]" />
          <select
            value={account}
            onChange={(e) => onAccountChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-medium text-[#111827]"
          >
            <option value="all" className="bg-white text-[#111827]">{t('header.all_accounts')}</option>
            <option value="715841367742" className="bg-white text-[#111827]">Prod (715841367742)</option>
            <option value="dev-109283" className="bg-white text-[#111827]">Dev (1092839948)</option>
          </select>
        </div>

        {/* Region Selector */}
        <div className="flex items-center space-x-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#374151]">
          <MapPin className="h-3.5 w-3.5 text-[#0A66C2]" />
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-medium text-[#111827]"
          >
            <option value="all" className="bg-white text-[#111827]">{t('header.all_regions')}</option>
            <option value="us-east-1" className="bg-white text-[#111827]">us-east-1 (N. Virginia)</option>
            <option value="ap-northeast-1" className="bg-white text-[#111827]">ap-northeast-1 (Tokyo)</option>
            <option value="ap-northeast-3" className="bg-white text-[#111827]">ap-northeast-3 (Osaka)</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center space-x-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#374151]">
          <Calendar className="h-3.5 w-3.5 text-[#0A66C2]" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-medium text-[#111827]"
          >
            <option value="30d" className="bg-white text-[#111827]">{isJP ? '過去30日間 (30 Days)' : 'Last 30 Days'}</option>
            <option value="7d" className="bg-white text-[#111827]">{isJP ? '過去7日間 (7 Days)' : 'Last 7 Days'}</option>
            <option value="60d" className="bg-white text-[#111827]">{isJP ? '過去60日間 (60 Days)' : 'Last 60 Days'}</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center space-x-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#374151]">
          <DollarSign className="h-3.5 w-3.5 text-[#059669]" />
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="bg-transparent outline-none cursor-pointer text-xs font-semibold text-[#111827]"
          >
            <option value="USD" className="bg-white text-[#111827]">USD ($ US Dollar)</option>
            <option value="INR" className="bg-white text-[#111827]">INR (₹ Indian Rupee)</option>
            <option value="EUR" className="bg-white text-[#111827]">EUR (€ Euro)</option>
            <option value="GBP" className="bg-white text-[#111827]">GBP (£ British Pound)</option>
            <option value="JPY" className="bg-white text-[#111827]">JPY (¥ Japanese Yen)</option>
            <option value="AUD" className="bg-white text-[#111827]">AUD (A$ Australian Dollar)</option>
            <option value="SGD" className="bg-white text-[#111827]">SGD (S$ Singapore Dollar)</option>
            <option value="CAD" className="bg-white text-[#111827]">CAD (C$ Canadian Dollar)</option>
          </select>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center border border-[#E5E7EB] rounded-md p-0.5 bg-gray-50">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition ${
              language === 'en' ? 'bg-[#0A66C2] text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('ja')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition ${
              language === 'ja' ? 'bg-[#0A66C2] text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            JP
          </button>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1.5 bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs px-3.5 py-1 rounded-md transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('header.refresh')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
