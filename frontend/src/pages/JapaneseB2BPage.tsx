import React, { useState } from 'react';
import {
  ShieldAlert,
  Download,
  CheckCircle,
  ArrowRight,
  Search,
  ChevronRight,
  Building2,
  Lock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import type { SummaryKPIs, WasteCase } from '../types';
import type { CurrencyCode } from '../utils/currency';
import type { Language } from '../utils/i18n';
import { formatCurrency } from '../utils/currency';
import { exportToPdf, exportToCsv } from '../utils/exportReport';

interface JapaneseB2BPageProps {
  kpis: SummaryKPIs | null;
  wasteCases: WasteCase[];
  onNavigate: (tab: string, resourceId?: string) => void;
  currency?: CurrencyCode;
  language?: Language;
}

export const JapaneseB2BPage: React.FC<JapaneseB2BPageProps> = ({
  kpis,
  wasteCases: _wasteCases,
  onNavigate,
  currency = 'USD',
  language: _language = 'en'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'EN' | 'JP'>('EN');

  const isJP = activeLang === 'JP';

  // Sample data with both English and Japanese descriptions
  const defaultWasteRows = [
    {
      resource_id: 'i-09823abc4567def89',
      service: 'Amazon EC2',
      env: 'Prod',
      waste_type_ja: 'アイドル / ゾンビインスタンス',
      waste_type_en: 'Idle / Zombie Instance',
      monthly_loss: 420.00,
      confidence: 96.5,
      confidence_label_ja: '高信頼性',
      confidence_label_en: 'High Confidence',
      recommended_action_ja: '夜間・休日自動停止スケジュールの適用',
      recommended_action_en: 'Apply night & weekend automated stop schedule',
      category: 'EC2'
    },
    {
      resource_id: 'vol-0a1b2c3d4e5f6g7h8',
      service: 'Amazon EBS',
      env: 'Prod',
      waste_type_ja: '未アタッチEBSボリューム',
      waste_type_en: 'Unattached EBS Volume',
      monthly_loss: 180.00,
      confidence: 94.0,
      confidence_label_ja: '高信頼性',
      confidence_label_en: 'High Confidence',
      recommended_action_ja: '最終EBSスナップショット作成後に安全削除',
      recommended_action_en: 'Create final EBS snapshot and safely delete',
      category: 'EBS'
    },
    {
      resource_id: 'db-0192837465dev',
      service: 'Amazon RDS',
      env: 'Dev',
      waste_type_ja: '過剰プロビジョニング',
      waste_type_en: 'Over-provisioned DB Instance',
      monthly_loss: 650.00,
      confidence: 92.0,
      confidence_label_ja: '高信頼性',
      confidence_label_en: 'High Confidence',
      recommended_action_ja: 'インスタンスクラスの1段階ダウンサイズ',
      recommended_action_en: 'Downsize DB instance class by 1 tier',
      category: 'RDS'
    },
    {
      resource_id: 'vol-0987654321snap',
      service: 'Amazon EBS',
      env: 'Staging',
      waste_type_ja: '孤立スナップショット',
      waste_type_en: 'Orphaned Snapshot',
      monthly_loss: 95.00,
      confidence: 88.5,
      confidence_label_ja: '中信頼性',
      confidence_label_en: 'Medium Confidence',
      recommended_action_ja: '90日以上経過した古スナップショットの消去',
      recommended_action_en: 'Purge snapshots older than 90 days',
      category: 'EBS'
    },
    {
      resource_id: 's3-archive-logs-2025',
      service: 'Amazon S3',
      env: 'Prod',
      waste_type_ja: '低頻度アクセスS3バケット',
      waste_type_en: 'Infrequently Accessed Storage',
      monthly_loss: 310.00,
      confidence: 91.0,
      confidence_label_ja: '高信頼性',
      confidence_label_en: 'High Confidence',
      recommended_action_ja: 'Glacier Instant Retrievalライフサイクル移行',
      recommended_action_en: 'Migrate lifecycle to Glacier Instant Retrieval',
      category: 'S3'
    },
    {
      resource_id: 'eip-0dev123456789a',
      service: 'Amazon EC2',
      env: 'Dev',
      waste_type_ja: '未割り当てElastic IP',
      waste_type_en: 'Unallocated Elastic IP',
      monthly_loss: 15.00,
      confidence: 99.0,
      confidence_label_ja: '高信頼性',
      confidence_label_en: 'High Confidence',
      recommended_action_ja: '未利用EIPのアソシエーション解除と解放',
      recommended_action_en: 'Disassociate and release unassigned Elastic IP',
      category: 'EC2'
    }
  ];

  const filteredRows = defaultWasteRows.filter((row) => {
    const matchFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'HIGH_CONF' ? row.confidence >= 90 : row.category === selectedFilter);
    const wasteType = isJP ? row.waste_type_ja : row.waste_type_en;
    const matchSearch =
      searchTerm === '' ||
      row.resource_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalSpend = kpis?.total_spend || 84250.6;
  const recent7d = kpis?.recent_7d_spend || 11420.8;
  const anomaliesCount = kpis?.total_anomalies || 8;
  const avoidableMonthly = kpis?.total_avoidable_monthly_spend || 3820.1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-['Noto_Sans_JP','Inter',sans-serif] text-xs">
      {/* Google Fonts Preconnect Injection */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Inter:wght@400;500;600;700&display=swap"
      />

      {/* 1. Header: White Sticky Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#0A66C2] p-2 rounded-lg text-white shadow-xs">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-[#111827] tracking-tight">CostGuard-X</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#E6F0FF] text-[#0A66C2] border border-[#BEDBFF]">
                AWS FinOps Enterprise
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              {isJP
                ? 'AWSクラウドコスト最適化プラットフォーム（決定論的統計分析エンジン）'
                : 'AWS Cloud Cost Waste Intelligence Platform (Deterministic Statistical Engine)'}
            </p>
          </div>
        </div>

        {/* Center: Enterprise Trust Badges */}
        <div className="hidden lg:flex items-center space-x-4 bg-[#F8FAFC] border border-[#E5E7EB] px-3.5 py-1.5 rounded-md text-[11px] font-medium text-[#374151]">
          <span className="flex items-center space-x-1 text-[#059669] font-bold">
            <CheckCircle className="h-3.5 w-3.5 text-[#059669]" />
            <span>{isJP ? '請求書対応' : 'Invoice Ready'}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center space-x-1 text-[#0A66C2] font-bold">
            <Building2 className="h-3.5 w-3.5 text-[#0A66C2]" />
            <span>{isJP ? '日本リージョン対応 (Tokyo / Osaka)' : 'Multi-Region Support (Global & JP)'}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center space-x-1 text-[#4B5563] font-bold">
            <Lock className="h-3.5 w-3.5 text-[#4B5563]" />
            <span>{isJP ? 'SOC2準拠' : 'SOC2 Compliant'}</span>
          </span>
        </div>

        {/* Right Controls: Timestamp, Language Switcher, Export Report */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-block text-[11px] text-[#6B7280] font-mono bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
            {isJP ? '最終更新: JST (2026-09-15 15:23 JST)' : 'Last Updated: JST (2026-09-15 15:23)'}
          </span>

          <div className="flex items-center border border-[#E5E7EB] rounded-md p-0.5 bg-gray-50">
            <button
              onClick={() => setActiveLang('EN')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                activeLang === 'EN' ? 'bg-[#0A66C2] text-white' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLang('JP')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                activeLang === 'JP' ? 'bg-[#0A66C2] text-white' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              JP
            </button>
          </div>

          <button
            onClick={() => exportToPdf(_wasteCases, kpis, currency)}
            className="bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs px-3.5 py-1.5 rounded-md shadow-xs transition flex items-center space-x-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isJP ? 'レポート出力' : 'Export Report'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 max-w-[1400px] mx-auto space-y-5">
        {/* 2. Hero Banner: Light Blue Background #E6F0FF */}
        <div className="bg-[#E6F0FF] border border-[#BEDBFF] rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="inline-flex items-center space-x-2 bg-white/80 border border-[#99C5FF] text-[#0A66C2] text-[11px] font-bold px-2.5 py-0.5 rounded">
              <Layers className="h-3.5 w-3.5" />
              <span>AWS Cloud Cost Waste Intelligence (Statistical Engine)</span>
            </div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">
              {isJP ? 'AWSコスト最適化インテリジェンス' : 'AWS Cloud Cost Waste Intelligence'}
            </h2>
            <p className="text-xs text-[#374151] leading-relaxed font-normal">
              {isJP
                ? 'CostGuard-Xは、時系列統計、堅牢なZスコア（MAD）、時系列イベント相関、構成可能な無駄の指紋認証、および反実仮想シナリオモデリングを使用してAWSクラウドコストと利用率メトリクスを分析し、削減可能な支出を正確に特定します。'
                : 'CostGuard-X analyzes AWS cloud cost and utilization metrics using time-series statistics, robust Z-scores (MAD), temporal event correlation, explainable waste fingerprinting, and counterfactual scenario modeling to pinpoint avoidable spend.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold px-4 py-2 rounded-md shadow-xs transition flex items-center space-x-1.5"
            >
              <span>{isJP ? 'エグゼクティブダッシュボード' : 'Executive Dashboard'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('waste')}
              className="bg-white hover:bg-gray-50 text-[#374151] border border-[#D1D5DB] text-xs font-bold px-3.5 py-2 rounded-md transition shadow-xs"
            >
              {isJP ? '無駄ケース一覧 (6件)' : 'Explore Waste Cases (6)'}
            </button>
          </div>
        </div>

        {/* 3. Metrics Row: 4 Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] max-h-[110px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {isJP ? '総クラウド費用' : 'TOTAL CLOUD SPEND'}
              </span>
              <span className="text-[10px] font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                {isJP ? '60日間集計' : '60-Day Aggregate'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#111827] font-mono">
                {formatCurrency(totalSpend, currency, true)}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280]">
              {isJP ? '全アクティブAWSアカウント合算' : 'All active AWS accounts aggregate'}
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] max-h-[110px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {isJP ? '直近7日間' : 'RECENT 7-DAY SPEND'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
                +14.2% {isJP ? '(費用増加)' : '(Spend Spike)'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#111827] font-mono">
                {formatCurrency(recent7d, currency, true)}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280]">
              {isJP ? '前週同期間との比較分析' : 'Compared to prior 7-day period'}
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] max-h-[110px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {isJP ? '統計的異常' : 'STATISTICAL ANOMALIES'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
                MAD Z-Score
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#111827] font-mono">
                {anomaliesCount} {isJP ? '件' : 'flagged'}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280]">
              {isJP ? '急激なコストスパイク及び乖離' : 'Cost spikes and statistical drift'}
            </p>
          </div>

          {/* Metric 4: BIG RED TEXT for Avoidable Savings */}
          <div className="bg-white border border-[#FCA5A5] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] max-h-[110px] flex flex-col justify-between bg-gradient-to-br from-white to-[#FEF2F2]">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#DC2626]">
                {isJP ? '削減可能額 (月間)' : 'POTENTIAL AVOIDABLE SPEND'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">
                {isJP ? '平均信頼度 91.4%' : 'Avg Confidence 91.4%'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#DC2626] font-mono tracking-tight">
                {formatCurrency(avoidableMonthly, currency, true)}/mo
              </span>
            </div>
            <p className="text-[10px] text-[#DC2626] font-semibold">
              {isJP ? '安全に削減可能な無駄コスト推計' : 'Estimated safe avoidable waste'}
            </p>
          </div>
        </div>

        {/* 4. Filter Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#374151] mr-1 flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4 text-[#0A66C2]" />
              <span>{isJP ? '絞り込みフィルター:' : 'Filter View:'}</span>
            </span>

            {[
              { id: 'ALL', label: isJP ? 'すべて (6件)' : 'All (6)' },
              { id: 'EC2', label: 'EC2 (2)' },
              { id: 'EBS', label: 'EBS (2)' },
              { id: 'RDS', label: 'RDS (1)' },
              { id: 'S3', label: 'S3 (1)' },
              { id: 'HIGH_CONF', label: isJP ? '高信頼度のみ (90%+)' : 'High Conf (90%+)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition border ${
                  selectedFilter === f.id
                    ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-xs'
                    : 'bg-white text-[#4B5563] border-[#D1D5DB] hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder={isJP ? "リソースIDまたは無駄タイプ検索..." : "Filter Resource ID or waste type..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-[#D1D5DB] text-xs text-[#111827] rounded-md pl-9 pr-3 py-1.5 w-full focus:outline-none focus:border-[#0A66C2] focus:bg-white"
            />
          </div>
        </div>

        {/* 5. Main Content: High-Density Table View */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111827] flex items-center space-x-1.5">
              <span>{isJP ? '無駄検知リソース一覧（高密度Excel型ビュー）' : 'High-Density Waste Findings Table'}</span>
              <span className="text-[10px] text-gray-500 font-normal">({filteredRows.length} {isJP ? '件表示中' : 'shown'})</span>
            </h3>
            <span
              onClick={() => exportToCsv(_wasteCases)}
              className="text-[11px] text-[#0A66C2] font-semibold cursor-pointer hover:underline"
            >
              {isJP ? '全件CSVデータ出力 →' : 'Export Full CSV →'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F3F4F6] text-[#4B5563] font-bold text-[11px] uppercase tracking-wider border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB]">{isJP ? 'リソースID' : 'Resource ID'}</th>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB]">{isJP ? 'サービス / 環境' : 'Service / Env'}</th>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB]">{isJP ? '無駄タイプ' : 'Waste Type'}</th>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB] text-right">{isJP ? '月間損失 (Avoidable)' : 'Monthly Loss (Avoidable)'}</th>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB] text-center">{isJP ? '信頼度' : 'Confidence'}</th>
                  <th className="px-4 py-2.5 border-r border-[#E5E7EB]">{isJP ? '推奨アクション' : 'Recommended Action'}</th>
                  <th className="px-4 py-2.5 text-center">{isJP ? '操作' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredRows.map((row) => (
                  <tr key={row.resource_id} className="hover:bg-[#F9FAFB] transition">
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB] font-mono text-[#0A66C2] font-bold">
                      {row.resource_id}
                    </td>
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB]">
                      <span className="font-semibold text-[#111827]">{row.service}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600 border border-gray-200">
                        {row.env}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB] font-semibold text-[#374151]">
                      {isJP ? row.waste_type_ja : row.waste_type_en}
                    </td>
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB] text-right font-mono font-extrabold text-[#DC2626]">
                      ${row.monthly_loss.toFixed(2)}/mo
                    </td>
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB] text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        {row.confidence}% ({isJP ? row.confidence_label_ja : row.confidence_label_en})
                      </span>
                    </td>
                    <td className="px-4 py-2.5 border-r border-[#E5E7EB] text-[#374151] font-medium max-w-sm truncate">
                      {isJP ? row.recommended_action_ja : row.recommended_action_en}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => onNavigate('resource', row.resource_id)}
                        className="bg-white hover:bg-[#E6F0FF] text-[#0A66C2] border border-[#0A66C2] text-xs font-bold px-3 py-1 rounded transition shadow-xs flex items-center space-x-1 mx-auto"
                      >
                        <span>{isJP ? '対応' : 'Inspect'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advisory Compliance Footer Rationale */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between text-xs text-[#6B7280]">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-[#059669]" />
            <span>
              <strong>CostGuard-X Safety Standard:</strong> {isJP ? '本プラットフォームは決定論的ルールエンジンに基づき推奨事項を生成し、ブラックボックスMLによる自動誤削除を防止します。' : 'Platform recommendations use deterministic rule engines to eliminate black-box ML risks and prevent unintended infrastructure mutations.'}
            </span>
          </div>
          <button
            onClick={() => onNavigate('methodology')}
            className="text-[#0A66C2] font-semibold hover:underline shrink-0"
          >
            {isJP ? '統計的手法仕様書を見る →' : 'View Methodology Specs →'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default JapaneseB2BPage;
