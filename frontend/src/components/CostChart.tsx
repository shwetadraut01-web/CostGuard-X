import React from 'react';
import Plot from 'react-plotly.js';

interface CostChartProps {
  data: any[];
  layout?: any;
  title?: string;
  style?: React.CSSProperties;
}

export const CostChart: React.FC<CostChartProps> = ({
  data,
  layout = {},
  title,
  style = { width: '100%', height: '350px' }
}) => {
  const defaultLayout = {
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 50, r: 30, t: title ? 40 : 20, b: 50 },
    font: {
      family: 'Inter, sans-serif',
      color: '#94a3b8',
      size: 11
    },
    xaxis: {
      gridcolor: '#1e293b',
      zerolinecolor: '#334155',
      tickfont: { color: '#94a3b8' }
    },
    yaxis: {
      gridcolor: '#1e293b',
      zerolinecolor: '#334155',
      tickfont: { color: '#94a3b8' }
    },
    legend: {
      font: { color: '#cbd5e1' }
    },
    title: title ? { text: title, font: { color: '#f8fafc', size: 14 } } : undefined,
    ...layout
  };

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
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
