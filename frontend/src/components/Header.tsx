import React from 'react';
import { ShieldAlert, RefreshCw, DollarSign, Calendar, Layers, MapPin, Sun, Moon } from 'lucide-react';
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
  theme = 'light',
  onThemeChange,
}) => {
  const t = (key: string) => getTranslation(language, key);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-md">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{t('header.title')}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Enterprise FinOps
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Global Control Bar */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Account Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={account}
            onChange={(e) => onAccountChange(e.target.value)}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
          >
            <option value="all" className="bg-slate-900 text-slate-200">{t('header.all_accounts')}</option>
            <option value="715841367742" className="bg-slate-900 text-slate-200">Prod (715841367742)</option>
            <option value="dev-109283" className="bg-slate-900 text-slate-200">Dev (1092839948)</option>
          </select>
        </div>

        {/* Region Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
          >
            <option value="all" className="bg-slate-900 text-slate-200">{t('header.all_regions')}</option>
            <option value="us-east-1" className="bg-slate-900 text-slate-200">us-east-1 (N. Virginia)</option>
            <option value="us-west-2" className="bg-slate-900 text-slate-200">us-west-2 (Oregon)</option>
            <option value="ap-northeast-1" className="bg-slate-900 text-slate-200">ap-northeast-1 (Tokyo)</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
          >
            <option value="30d" className="bg-slate-900 text-slate-200">Last 30 Days</option>
            <option value="7d" className="bg-slate-900 text-slate-200">Last 7 Days</option>
            <option value="60d" className="bg-slate-900 text-slate-200">Last 60 Days</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs font-medium"
          >
            <option value="USD" className="bg-slate-900 text-slate-200">USD ($)</option>
            <option value="JPY" className="bg-slate-900 text-slate-200">JPY (¥)</option>
            <option value="EUR" className="bg-slate-900 text-slate-200">EUR (€)</option>
            <option value="INR" className="bg-slate-900 text-slate-200">INR (₹)</option>
          </select>
        </div>

        {/* Japanese Theme Mode Toggle */}
        {onThemeChange && (
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-slate-300">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition ${
                theme === 'light' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Japanese Corporate Light Theme"
            >
              <Sun className="h-3 w-3" />
              <span>ライト (JP)</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition ${
                theme === 'dark' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark FinOps Theme"
            >
              <Moon className="h-3 w-3" />
              <span>ダーク</span>
            </button>
          </div>
        )}

        {/* Language Toggle */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-slate-300">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('ja')}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              language === 'ja' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            日本語
          </button>
        </div>

        {/* Action Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition shadow disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('header.refresh')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
