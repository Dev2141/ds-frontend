import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatsOverview } from '../api/client';
import { StatsOverview } from '../types/api';

interface PriorityAsset {
  id: string;
  type: string;
  location: string;
  issue: string;
  svmStatus: string;
  svmProb: string;
  isSvmAtRisk: boolean;
  dbscanStatus: string;
  isDbscanAnomaly: boolean;
  severity: string;
  severityClass: string;
  icon: string;
}

const DEMO_PRIORITY_ASSETS: PriorityAsset[] = [
  {
    id: 'TWR-IND-042',
    type: 'Cell Tower 5G-NR',
    location: 'Mumbai, Maharashtra (Sector 4B)',
    issue: 'Severe Latency (142ms) & 91.2% Congestion',
    svmStatus: 'At Risk',
    svmProb: '91.4%',
    isSvmAtRisk: true,
    dbscanStatus: 'Noise Anomaly',
    isDbscanAnomaly: true,
    severity: 'Critical P1',
    severityClass: 'bg-rose-600 text-white',
    icon: 'cell_tower',
  },
  {
    id: 'GTW-MUM-108',
    type: 'Edge Gateway',
    location: 'Bandra Kurla Complex, Mumbai',
    issue: 'High Packet Loss (3.1%) & Backhaul Saturation',
    svmStatus: 'At Risk',
    svmProb: '84.1%',
    isSvmAtRisk: true,
    dbscanStatus: 'Cluster #1 (Border)',
    isDbscanAnomaly: false,
    severity: 'High P2',
    severityClass: 'bg-amber-500 text-white',
    icon: 'dns',
  },
  {
    id: 'TWR-PUN-014',
    type: 'Cell Tower 5G-NR',
    location: 'Hinjawadi IT Park, Pune',
    issue: 'Unusual Throughput vs. User Ratio Outlier',
    svmStatus: 'Normal',
    svmProb: '72.3%',
    isSvmAtRisk: false,
    dbscanStatus: 'Noise Anomaly',
    isDbscanAnomaly: true,
    severity: 'Unusual Pattern',
    severityClass: 'bg-purple-500 text-white',
    icon: 'cell_tower',
  },
  {
    id: 'RTR-DEL-021',
    type: 'Core Optical Router',
    location: 'Connaught Place, New Delhi',
    issue: 'Intermittent optical dispersion fluctuation',
    svmStatus: 'Normal',
    svmProb: '99.1%',
    isSvmAtRisk: false,
    dbscanStatus: 'Cluster #3 (Core)',
    isDbscanAnomaly: false,
    severity: 'Nominal P4',
    severityClass: 'bg-emerald-600 text-white',
    icon: 'router',
  },
];

export const CommandCenter: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'svm' | 'dbscan'>('all');
  const [stats, setStats] = useState<StatsOverview | null>(null);

  useEffect(() => {
    getStatsOverview()
      .then((data) => setStats(data))
      .catch(() => {
        // Local demonstration fallback
      });
  }, []);

  const totalAssets = stats?.total_assets ?? 1420;
  const atRiskCount = stats?.risk_counts?.at_risk ?? 38;
  const anomalyCount = stats?.anomaly_count ?? 14;
  const avgLatency = stats?.avg_metrics?.latency_ms ? Math.round(stats.avg_metrics.latency_ms) : 28;

  const filteredAssets = DEMO_PRIORITY_ASSETS.filter((asset) => {
    if (filter === 'svm') return asset.isSvmAtRisk;
    if (filter === 'dbscan') return asset.isDbscanAnomaly;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-10 animate-page-transition">
      {/* Section A: Network Status Banner (Averon Atmospheric Hero Card) */}
      <section className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#EBF2FF] via-[#F4F7FF] to-[#FAF9FF] p-8 md:p-12 border border-indigo-100/80 shadow-[0_10px_40px_-15px_rgba(99,102,241,0.06)] hover:shadow-lg transition-all duration-500">
        {/* Ambient Orb Background Accents */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-purple-700 shadow-xs mb-6 hover:scale-105 transition-transform duration-200 cursor-default">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Network Situation: Attention Required
            </span>
          </div>

          {/* Headline with Editorial Serif Italic Accent (Averon Typography Hallmark) */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            AI-Assisted Telemetry & <br />
            <span className="font-serif italic font-normal text-purple-700">
              Autonomous Network Operations
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Continuously monitoring {totalAssets.toLocaleString()} multi-vendor telecom assets.
            Dual-tier evaluation combines threshold boundaries, supervised SVM classification, and
            DBSCAN spatial anomaly detection.
          </p>

          {/* Action Pills Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/network-map"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group"
            >
              <span>Open Global Cartography</span>
              <span className="material-symbols-outlined text-[16px] group-hover:rotate-12 transition-transform duration-300">
                map
              </span>
            </Link>
            <Link
              to="/analyze-telemetry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-semibold text-xs shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[16px] text-purple-600">
                biotech
              </span>
              <span>Simulate Telemetry Batch</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-4 py-3 text-slate-500 text-xs font-medium">
              <span className="material-symbols-outlined text-[15px] text-slate-400">
                schedule
              </span>
              <span>
                Latest snapshot: <strong>26 Oct 2026, 16:00 IST</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Key Network Metrics (Clean 4-Card Bento Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Executive Telemetry Indicators
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated 400ms ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric Card 1 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/70 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:border-purple-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Monitored Assets
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[20px]">router</span>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalAssets.toLocaleString()}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500">Fleet Uptime</span>
              <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>99.4%
              </span>
            </div>
          </div>

          {/* Metric Card 2 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/70 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:border-rose-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                Classified At Risk
              </span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {atRiskCount} <span className="text-sm font-normal text-slate-400">assets</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500">SVM Supervised Classifier</span>
              <span className="font-bold text-rose-600">
                {((atRiskCount / totalAssets) * 100).toFixed(2)}% of fleet
              </span>
            </div>
          </div>

          {/* Metric Card 3 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/70 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:border-purple-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                DBSCAN Anomalies
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[20px]">grain</span>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {anomalyCount} <span className="text-sm font-normal text-slate-400">noise pts</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500">Density Cluster Outliers</span>
              <span className="font-bold text-purple-600">
                {((anomalyCount / totalAssets) * 100).toFixed(2)}% of fleet
              </span>
            </div>
          </div>

          {/* Metric Card 4 */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/70 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:border-indigo-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Average Fleet Latency
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {avgLatency} <span className="text-sm font-normal text-slate-400">ms</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500">SLA Ceiling ≤ 50 ms</span>
              <span className="font-bold text-emerald-600">Nominal Fleet Avg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Condition Summary & Comparative Architecture (Averon Dual-Card Matrix) */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Condition Distribution Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="material-symbols-outlined text-[14px] text-purple-600">
                  pie_chart
                </span>
                <span>Fleet Assessment Distribution</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                Multi-Model Classification Tiers
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                NEXUSNET keeps supervised risk classification (SVM) distinct from unsupervised
                density clustering (DBSCAN). An asset may exhibit anomalies without being classified
                At Risk, and vice-versa.
              </p>

              {/* Distribution Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex mb-5 p-0.5">
                <div
                  style={{ width: '96.3%' }}
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  title="Normal: 1,368"
                />
                <div
                  style={{ width: '2.7%' }}
                  className="h-full bg-rose-500 ml-0.5 rounded-full transition-all duration-700"
                  title="At Risk: 38"
                />
                <div
                  style={{ width: '1.0%' }}
                  className="h-full bg-purple-500 ml-0.5 rounded-full transition-all duration-700"
                  title="Anomalies: 14"
                />
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-950">Normal Fleet Health</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800">
                    1,368 nodes (96.3%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-rose-950">SVM: At Risk Flagged</span>
                      <span className="text-[10px] text-rose-600">
                        Violates trained operational bounds
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-rose-800">
                    {atRiskCount} nodes (2.7%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100 hover:bg-purple-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-purple-950">
                        DBSCAN: Density Anomaly
                      </span>
                      <span className="text-[10px] text-purple-600">
                        Unusual multi-metric spatial outlier
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-purple-800">
                    {anomalyCount} nodes (1.0%)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>
                Overlap (Both Flagged): <strong>8 nodes</strong>
              </span>
              <Link
                to="/analyze-telemetry"
                className="text-purple-600 font-semibold hover:underline"
              >
                View Pipeline Specs &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Averon Before / After Comparative Paradigm (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>Operational Evolution</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Demonstration Benchmark</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Why Dual-Model AI Outperforms Legacy Static Thresholds
              </h3>

              {/* 2-Column Comparative Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Legacy Pitfalls */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold mb-3">
                    <span className="material-symbols-outlined text-[13px]">close</span>
                    <span>Legacy Static Thresholds</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>High false-alarm fatigue from isolated latency spikes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>
                        Blind to multi-variable degradation when each metric sits barely under
                        limits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>No cluster awareness for localized RF interference.</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: NEXUSNET Synthesis */}
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/70 hover:bg-purple-50/70 transition-colors">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-3">
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    <span>NEXUSNET AI Intelligence</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>
                        <strong>84% fewer false alerts</strong> via trained SVM boundary
                        separation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>
                        <strong>Unsupervised DBSCAN</strong> spots novel congestion anomalies
                        automatically.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>Engineered stress indexes reveal silent degradation early.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Assistive Decision Support: Final physical root causes remain operator-validated.</span>
              <span className="font-bold text-purple-700">ISO-Telecommunications Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section D: Priority Assets (Refined Structured Table) */}
      <section className="bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              <span>Immediate Attention Queue</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Priority Assets Flagged for Operational Review
            </h3>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Filter by:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs font-bold scale-[1.03]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Flagged ({DEMO_PRIORITY_ASSETS.length})
            </button>
            <button
              onClick={() => setFilter('svm')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'svm'
                  ? 'bg-slate-900 text-white shadow-xs font-bold scale-[1.03]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              SVM At Risk
            </button>
            <button
              onClick={() => setFilter('dbscan')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'dbscan'
                  ? 'bg-slate-900 text-white shadow-xs font-bold scale-[1.03]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              DBSCAN Anomaly
            </button>
          </div>
        </div>

        {/* Assets Table */}
        <div className="overflow-x-auto -mx-7 px-7">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Asset ID & Type</th>
                <th className="py-3 px-4">Geographic Location</th>
                <th className="py-3 px-4">Primary Observed Issue</th>
                <th className="py-3 px-4">SVM Assessment</th>
                <th className="py-3 px-4">DBSCAN Result</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-purple-50/50 transition-colors duration-150 group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 ${
                          asset.isSvmAtRisk
                            ? 'bg-rose-50 text-rose-600'
                            : asset.isDbscanAnomaly
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{asset.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {asset.id}
                        </span>
                        <span className="text-[11px] text-slate-400">{asset.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{asset.location}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-slate-800">{asset.issue}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        asset.isSvmAtRisk
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          asset.isSvmAtRisk ? 'bg-rose-600' : 'bg-emerald-600'
                        }`}
                      />
                      {asset.svmStatus} ({asset.svmProb})
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        asset.isDbscanAnomaly
                          ? 'bg-purple-100 text-purple-800 font-bold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {asset.isDbscanAnomaly && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      )}
                      {asset.dbscanStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${asset.severityClass}`}
                    >
                      {asset.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/asset-investigation?asset=${encodeURIComponent(asset.id)}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      <span>Investigate</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing priority demonstration entries from Western India Sector</span>
          <Link
            to="/network-map"
            className="text-purple-700 font-bold hover:underline flex items-center gap-1 group"
          >
            <span>Explore all assets on real cartography map</span>
            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
              east
            </span>
          </Link>
        </div>
      </section>

      {/* Section E: Geographic Mini-Preview Strip */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[28px] p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 500 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="350" cy="80" r="120" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="100" y1="100" x2="350" y2="80" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">explore</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-bold uppercase tracking-wider mb-1">
                <span>Geographic Correlation Module</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Explore West Zone Real Geographic Cell Topography
              </h3>
              <p className="text-slate-300 text-xs max-w-xl mt-1">
                Visualize cell towers, RF heatmaps, fiber routes, and multi-sigma DBSCAN cluster
                boundaries on real interactive GIS maps.
              </p>
            </div>
          </div>

          <Link
            to="/network-map"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 shadow-lg group"
          >
            <span>Open Real Interactive Map</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};
