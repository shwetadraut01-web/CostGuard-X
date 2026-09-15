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
  const isDark = theme === 'dark';

  return (
    <header className={`${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    } border-b px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors duration-150`}>
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className={`text-lg font-bold tracking-tight flex items-center space-x-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>{t('header.title')}</span>
            <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              Enterprise FinOps
            </span>
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Global Control Bar */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Account Selector */}
        <div className={`flex items-center space-x-1.5 border rounded-lg px-2.5 py-1.5 ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <Layers className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <select
            value={account}
            onChange={(e) => onAccountChange(e.target.value)}
            className={`bg-transparent outline-none cursor-pointer text-xs font-semibold ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <option value="all" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>{t('header.all_accounts')}</option>
            <option value="715841367742" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>Prod (715841367742)</option>
            <option value="dev-109283" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>Dev (1092839948)</option>
          </select>
        </div>

        {/* Region Selector */}
        <div className={`flex items-center space-x-1.5 border rounded-lg px-2.5 py-1.5 ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <MapPin className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className={`bg-transparent outline-none cursor-pointer text-xs font-semibold ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <option value="all" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>{t('header.all_regions')}</option>
            <option value="us-east-1" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>us-east-1 (N. Virginia)</option>
            <option value="us-west-2" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>us-west-2 (Oregon)</option>
            <option value="ap-northeast-1" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>ap-northeast-1 (Tokyo)</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className={`flex items-center space-x-1.5 border rounded-lg px-2.5 py-1.5 ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <Calendar className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className={`bg-transparent outline-none cursor-pointer text-xs font-semibold ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <option value="30d" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>Last 30 Days</option>
            <option value="7d" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>Last 7 Days</option>
            <option value="60d" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>Last 60 Days</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div className={`flex items-center space-x-1.5 border rounded-lg px-2.5 py-1.5 ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className={`bg-transparent outline-none cursor-pointer text-xs font-semibold ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            <option value="USD" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>USD ($)</option>
            <option value="JPY" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>JPY (¥)</option>
            <option value="EUR" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>EUR (€)</option>
            <option value="INR" className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>INR (₹)</option>
          </select>
        </div>

        {/* Japanese Theme Mode Toggle */}
        {onThemeChange && (
          <div className={`flex items-center border rounded-lg p-0.5 ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <button
              onClick={() => onThemeChange('light')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
                theme === 'light' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Pleasant Japanese Light Theme"
            >
              <Sun className="h-3 w-3" />
              <span>ライト (JP)</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
                theme === 'dark' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dark FinOps Theme"
            >
              <Moon className="h-3 w-3" />
              <span>ダーク</span>
            </button>
          </div>
        )}

        {/* Language Toggle */}
        <div className={`flex items-center border rounded-lg p-0.5 ${
          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded text-xs font-semibold transition ${
              language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('ja')}
            className={`px-2 py-1 rounded text-xs font-semibold transition ${
              language === 'ja' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('header.refresh')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
