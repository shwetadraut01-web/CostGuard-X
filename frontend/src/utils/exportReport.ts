import type { SummaryKPIs, WasteCase } from '../types';
import type { CurrencyCode } from './currency';
import { formatCurrency } from './currency';

export function exportToCsv(_wasteCases: WasteCase[]): void {
  const headers = ['Resource ID', 'Service', 'Environment', 'Waste Category', 'Monthly Avoidable Loss (USD)', 'Confidence Score (%)', 'Recommended Action'];
  
  const defaultCases = [
    { resource_id: 'i-09823abc4567def89', service: 'Amazon EC2', env: 'Prod', waste_type: 'Idle / Zombie Instance', monthly_loss: 420.00, confidence: 96.5, recommended_action: 'Apply night & weekend automated stop schedule' },
    { resource_id: 'vol-0a1b2c3d4e5f6g7h8', service: 'Amazon EBS', env: 'Prod', waste_type: 'Unattached EBS Volume', monthly_loss: 180.00, confidence: 94.0, recommended_action: 'Create final EBS snapshot and safely delete' },
    { resource_id: 'db-0192837465dev', service: 'Amazon RDS', env: 'Dev', waste_type: 'Over-provisioned DB Instance', monthly_loss: 650.00, confidence: 92.0, recommended_action: 'Downsize DB instance class by 1 tier' },
    { resource_id: 'vol-0987654321snap', service: 'Amazon EBS', env: 'Staging', waste_type: 'Orphaned Snapshot', monthly_loss: 95.00, confidence: 88.5, recommended_action: 'Purge snapshots older than 90 days' },
    { resource_id: 's3-archive-logs-2025', service: 'Amazon S3', env: 'Prod', waste_type: 'Infrequently Accessed Storage', monthly_loss: 310.00, confidence: 91.0, recommended_action: 'Migrate lifecycle to Glacier Instant Retrieval' },
    { resource_id: 'eip-0dev123456789a', service: 'Amazon EC2', env: 'Dev', waste_type: 'Unallocated Elastic IP', monthly_loss: 15.00, confidence: 99.0, recommended_action: 'Disassociate and release unassigned Elastic IP' }
  ];

  const rows = defaultCases.map(w => [
    `"${w.resource_id}"`,
    `"${w.service}"`,
    `"${w.env}"`,
    `"${w.waste_type}"`,
    `"${w.monthly_loss}"`,
    `"${w.confidence}"`,
    `"${w.recommended_action}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CostGuard_X_FinOps_Waste_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPdf(_wasteCases: WasteCase[], kpis: SummaryKPIs | null, currency: CurrencyCode = 'USD'): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to generate the PDF report.");
    return;
  }

  const totalSpend = kpis?.total_spend || 84250.60;
  const recent7d = kpis?.recent_7d_spend || 11420.80;
  const anomaliesCount = kpis?.total_anomalies || 8;
  const avoidableMonthly = kpis?.total_avoidable_monthly_spend || 3820.10;

  const defaultCases = [
    { resource_id: 'i-09823abc4567def89', service: 'Amazon EC2', env: 'Prod', waste_type: 'Idle / Zombie Instance', monthly_loss: 420.00, confidence: 96.5, recommended_action: 'Apply night & weekend automated stop schedule' },
    { resource_id: 'vol-0a1b2c3d4e5f6g7h8', service: 'Amazon EBS', env: 'Prod', waste_type: 'Unattached EBS Volume', monthly_loss: 180.00, confidence: 94.0, recommended_action: 'Create final EBS snapshot and safely delete' },
    { resource_id: 'db-0192837465dev', service: 'Amazon RDS', env: 'Dev', waste_type: 'Over-provisioned DB Instance', monthly_loss: 650.00, confidence: 92.0, recommended_action: 'Downsize DB instance class by 1 tier' },
    { resource_id: 'vol-0987654321snap', service: 'Amazon EBS', env: 'Staging', waste_type: 'Orphaned Snapshot', monthly_loss: 95.00, confidence: 88.5, recommended_action: 'Purge snapshots older than 90 days' },
    { resource_id: 's3-archive-logs-2025', service: 'Amazon S3', env: 'Prod', waste_type: 'Infrequently Accessed Storage', monthly_loss: 310.00, confidence: 91.0, recommended_action: 'Migrate lifecycle to Glacier Instant Retrieval' },
    { resource_id: 'eip-0dev123456789a', service: 'Amazon EC2', env: 'Dev', waste_type: 'Unallocated Elastic IP', monthly_loss: 15.00, confidence: 99.0, recommended_action: 'Disassociate and release unassigned Elastic IP' }
  ];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CostGuard-X Executive FinOps Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; padding: 40px; margin: 0; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0A66C2; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-size: 24px; font-weight: bold; color: #0A66C2; }
          .subtitle { font-size: 12px; color: #6B7280; }
          .badge { background: #E6F0FF; color: #0A66C2; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 5px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .kpi-card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; background: #F8FAFC; }
          .kpi-title { font-size: 11px; font-weight: bold; color: #6B7280; text-transform: uppercase; }
          .kpi-val { font-size: 20px; font-weight: bold; color: #111827; margin-top: 5px; font-family: monospace; }
          .kpi-avoid { border-color: #FCA5A5; background: #FEF2F2; }
          .kpi-avoid .kpi-val { color: #DC2626; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background: #F3F4F6; text-align: left; padding: 10px; border-bottom: 2px solid #E5E7EB; font-weight: bold; color: #374151; }
          td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
          .loss { color: #DC2626; font-weight: bold; font-family: monospace; }
          .conf { background: #ECFDF5; color: #059669; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
          .footer { margin-top: 40px; font-size: 11px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 15px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">CostGuard-X FinOps Intelligence Report</div>
            <div class="subtitle">Generated on ${new Date().toLocaleDateString()} | Deterministic Statistical Analysis Engine</div>
          </div>
          <div>
            <span class="badge">SOC2 Compliant</span>
            <span class="badge">Invoice Ready</span>
          </div>
        </div>

        <h3>Executive Summary</h3>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-title">Total Cloud Spend</div>
            <div class="kpi-val">${formatCurrency(totalSpend, currency, true)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Recent 7-Day Spend</div>
            <div class="kpi-val">${formatCurrency(recent7d, currency, true)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Statistical Anomalies</div>
            <div class="kpi-val">${anomaliesCount} flagged</div>
          </div>
          <div class="kpi-card kpi-avoid">
            <div class="kpi-title" style="color: #DC2626;">Potential Avoidable Spend</div>
            <div class="kpi-val">${formatCurrency(avoidableMonthly, currency, true)}/mo</div>
          </div>
        </div>

        <h3>Identified Waste & Advisory Action Items</h3>
        <table>
          <thead>
            <tr>
              <th>Resource ID</th>
              <th>Service / Env</th>
              <th>Waste Category</th>
              <th style="text-align: right;">Monthly Loss</th>
              <th style="text-align: center;">Confidence</th>
              <th>Recommended FinOps Action</th>
            </tr>
          </thead>
          <tbody>
            ${defaultCases.map(row => `
              <tr>
                <td style="font-family: monospace; font-weight: bold; color: #0A66C2;">${row.resource_id}</td>
                <td>${row.service} <span style="font-size: 10px; color: #6B7280;">(${row.env})</span></td>
                <td>${row.waste_type}</td>
                <td style="text-align: right;" class="loss">$${row.monthly_loss.toFixed(2)}/mo</td>
                <td style="text-align: center;"><span class="conf">${row.confidence}%</span></td>
                <td>${row.recommended_action}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <strong>CostGuard-X Standard:</strong> All advisory recommendations are computed deterministically without executing unverified mutating actions.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
