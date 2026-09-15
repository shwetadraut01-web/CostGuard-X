import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  theme?: 'light' | 'dark';
}

const colorBadgeStyles: Record<string, { dark: string; light: string }> = {
  blue: {
    dark: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    light: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  indigo: {
    dark: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    light: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  amber: {
    dark: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    light: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  emerald: {
    dark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    light: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  red: {
    dark: 'bg-red-500/10 text-red-400 border-red-500/20',
    light: 'bg-rose-50 text-rose-800 border-rose-200'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  color = 'blue',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const badgeStyle = colorBadgeStyles[color] || colorBadgeStyles.blue;

  return (
    <div className={`${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow'
    } border rounded-xl p-5 transition duration-150`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {title}
        </span>
        <div className={`p-2.5 rounded-lg border ${isDark ? badgeStyle.dark : badgeStyle.light}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-2xl font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendType === 'positive'
              ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border border-emerald-200')
              : trendType === 'negative'
              ? (isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-rose-50 text-rose-800 border border-rose-200')
              : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
          }`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className={`mt-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
