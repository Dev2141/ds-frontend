import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const NetworkTrends: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'24h' | '7d'>('24h');
  const [regionFilter, setRegionFilter] = useState('Western India');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCsv = () => {
    const csvContent =
      'timestamp,asset_id,sector,latency_ms,packet_loss_pct,traffic_load_pct,signal_dbm,status\n' +
      '2026-10-26T00:00:00Z,TWR-IND-042,Mumbai Sector 4B,32,0.3,45.0,-76,Normal\n' +
      '2026-10-26T06:00:00Z,TWR-IND-042,Mumbai Sector 4B,48,0.8,62.5,-80,Normal\n' +
      '2026-10-26T12:00:00Z,TWR-IND-042,Mumbai Sector 4B,92,2.4,84.1,-88,At Risk\n' +
      '2026-10-26T16:00:00Z,TWR-IND-042,Mumbai Sector 4B,142,4.8,91.2,-94,At Risk\n' +
      '2026-10-26T16:00:00Z,GTW-MUM-108,Bandra Kurla,118,3.1,88.5,-86,At Risk\n' +
      '2026-10-26T16:00:00Z,TWR-PUN-014,Hinjawadi Pune,68,1.2,76.8,-82,Attention\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexusnet_telemetry_trends_${timeWindow}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported telemetry snapshot (nexusnet_telemetry_trends_${timeWindow}.csv) successfully!`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-page-transition">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              file_download_done
            </span>
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Section A: Title & Dimension Filters (Averon Soft Dock) */}
      <section className="bg-white rounded-[28px] p-6 border border-slate-200/70 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[14px]">analytics</span>
              <span>Historical Telemetry & Anomaly Signals</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Multi-Dimensional Performance Trends
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Time Window:</span>
              <button
                onClick={() => setTimeWindow('24h')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  timeWindow === '24h'
                    ? 'bg-slate-900 text-white shadow-xs scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Last 24 Hours
              </button>
              <button
                onClick={() => setTimeWindow('7d')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  timeWindow === '7d'
                    ? 'bg-slate-900 text-white shadow-xs font-bold scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Last 7 Days
              </button>
            </div>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export Metrics CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-slate-400">Region:</span>
            <strong>{regionFilter}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-slate-400">Asset Category:</span>
            <strong>Cell Towers & Gateways</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-slate-400">Resolution:</span>
            <strong>{timeWindow === '24h' ? '15-Minute Aggregation' : '1-Hour Aggregation'}</strong>
          </div>
        </div>
      </section>

      {/* Section B: Primary Visualizations Grid (Averon Clear Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Latency Over Time */}
        <div className="bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-purple-200/80 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 group-hover:scale-125 transition-transform" />
                <h3 className="text-sm font-bold text-slate-900">
                  Round-Trip Latency Trajectory
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Peak: 142 ms (TWR-IND-042)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Comparing fleet median latency (28ms) against degraded anomaly spikes in Mumbai Sector 4B.
            </p>

            {/* SVG Time-Series Chart */}
            <div className="w-full h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

                {/* Configured Threshold Limit (50ms) */}
                <line
                  x1="0"
                  y1="100"
                  x2="500"
                  y2="100"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x="4" y="94" fill="#EF4444" fontSize="10" fontWeight="bold">
                  Configured Limit (50 ms)
                </text>

                {/* Median Baseline (Healthy 28ms) */}
                <path
                  d="M 0,125 Q 120,122 250,126 T 500,123"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                />

                {/* Degraded Tower Spike (TWR-IND-042) */}
                <path
                  d="M 0,124 Q 150,120 280,110 T 360,60 T 440,25 T 500,30"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Chart X Axis Labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              <span>00:00 IST</span>
              <span>06:00 IST</span>
              <span>12:00 IST</span>
              <span>16:00 IST (Spike)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" /> Fleet Average (28 ms)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" /> TWR-IND-042 (142 ms)
            </span>
          </div>
        </div>

        {/* Chart 2: Packet Loss Trajectory */}
        <div className="bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-purple-200/80 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600 group-hover:scale-125 transition-transform" />
                <h3 className="text-sm font-bold text-slate-900">
                  Packet Loss Rate Over Time
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Peak: 4.8% (Critical)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Tracking optical backhaul retransmissions vs 1.0% SLA threshold.
            </p>

            {/* SVG Packet Loss Chart */}
            <div className="w-full h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

                {/* SLA Ceiling (1.0%) */}
                <line
                  x1="0"
                  y1="115"
                  x2="500"
                  y2="115"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x="4" y="110" fill="#D97706" fontSize="10" fontWeight="bold">
                  SLA Breach Ceiling (1.0%)
                </text>

                {/* Baseline packet loss (0.2%) */}
                <path
                  d="M 0,140 Q 150,138 300,139 T 500,138"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Packet loss surge curve */}
                <path
                  d="M 0,138 Q 180,135 300,120 T 420,50 T 500,35"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              <span>00:00 IST</span>
              <span>06:00 IST</span>
              <span>12:00 IST</span>
              <span>16:00 IST (4.8%)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Nominal Nodes (0.2%)
            </span>
            <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" /> Flagged Nodes (4.8%)
            </span>
          </div>
        </div>
      </section>

      {/* Section C: Top Affected Locations & Flagged Assets */}
      <section className="bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Sectors with Greatest Number of Threshold Flags
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by cumulative severity in current 24-hour window
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sector 1: Mumbai West */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Mumbai West (Sector 4B)</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                21 Breaches
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Primary asset: <strong>TWR-IND-042</strong> (At Risk, DBSCAN Outlier). High subscriber load & backhaul latency.
            </p>
            <Link
              to="/asset-investigation?asset=TWR-IND-042"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 group"
            >
              <span>Inspect TWR-IND-042</span>
              <span className="material-symbols-outlined text-[13px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Sector 2: Bandra Kurla Complex */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Bandra Kurla Edge</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                9 Breaches
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Primary asset: <strong>GTW-MUM-108</strong> (At Risk). Optical trunk packet loss and buffer congestion.
            </p>
            <Link
              to="/asset-investigation?asset=GTW-MUM-108"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 group"
            >
              <span>Inspect GTW-MUM-108</span>
              <span className="material-symbols-outlined text-[13px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Sector 3: Pune Hinjawadi */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Pune Hinjawadi IT Park</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                6 Breaches
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Primary asset: <strong>TWR-PUN-014</strong> (DBSCAN Anomaly). High throughput-to-user outlier pattern.
            </p>
            <Link
              to="/asset-investigation?asset=TWR-PUN-014"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 group"
            >
              <span>Inspect TWR-PUN-014</span>
              <span className="material-symbols-outlined text-[13px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section D: Data Limitations Note */}
      <section className="p-5 rounded-2xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0">info</span>
        <span>
          <strong>Data Coverage Limitation:</strong> Time-series graphs display rolling 24-hour demonstration snapshots aggregated at 15-minute intervals. Historical records beyond the active cache are stored in long-term cold telemetry repositories.
        </span>
      </section>
    </div>
  );
};
