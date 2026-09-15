import React from 'react';
import Plot from 'react-plotly.js';

interface CostChartProps {
  data: any[];
  layout?: any;
  title?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

export const CostChart: React.FC<CostChartProps> = ({
  data,
  layout = {},
  title,
  style = { width: '100%', height: '350px' },
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const zeroLineColor = isDark ? '#334155' : '#cbd5e1';
  const titleColor = isDark ? '#f8fafc' : '#0f172a';

  const defaultLayout = {
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 50, r: 30, t: title ? 40 : 20, b: 50 },
    font: {
      family: 'Inter, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
      color: textColor,
      size: 11
    },
    xaxis: {
      gridcolor: gridColor,
      zerolinecolor: zeroLineColor,
      tickfont: { color: textColor }
    },
    yaxis: {
      gridcolor: gridColor,
      zerolinecolor: zeroLineColor,
      tickfont: { color: textColor }
    },
    legend: {
      font: { color: isDark ? '#cbd5e1' : '#334155' }
    },
    title: title ? { text: title, font: { color: titleColor, size: 14 } } : undefined,
    ...layout
  };

  return (
    <div className={`w-full h-full ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    } border rounded-xl p-4 transition`}>
      <Plot
        data={data}
        layout={defaultLayout}
        useResizeHandler={true}
        style={style}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  );
};
