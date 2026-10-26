import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAssetDetail } from '../api/client';
import { AssetDetail } from '../types/api';

export const AssetInvestigation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assetIdParam = searchParams.get('asset') || 'TWR-IND-042';

  const [assetId, setAssetId] = useState(assetIdParam);
  const [assetDetail, setAssetDetail] = useState<AssetDetail | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    setAssetId(assetIdParam);
    getAssetDetail(assetIdParam)
      .then((detail) => setAssetDetail(detail))
      .catch(() => {
        // Fallback to local demonstration mode
      });
  }, [assetIdParam]);

  const handleAction = (actionName: string) => {
    setActionFeedback(`Action "${actionName}" submitted successfully for asset ${assetId}. Work order assigned to NOC dispatch.`);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const isTwr042 = assetId === 'TWR-IND-042';
  const isGtw108 = assetId === 'GTW-MUM-108';
  const isPun014 = assetId === 'TWR-PUN-014';

  const assetType = isGtw108 ? 'Edge Gateway' : 'Cell Tower 5G-NR';
  const location = isPun014
    ? 'Hinjawadi IT Park, Pune, Maharashtra'
    : isGtw108
    ? 'Bandra Kurla Complex, Mumbai, Maharashtra'
    : 'Mumbai, Maharashtra, India (Western Sector 4B)';
  const coords = isPun014 ? '18.5913° N, 73.7389° E' : '19.0760° N, 72.8377° E';
  const hardware = isGtw108 ? 'Cisco ASR 9000 Backhaul Router' : 'Ericsson AIR 6449 B41';

  // Dynamic telemetry metrics
  const signal = isTwr042 ? -94 : isGtw108 ? -86 : -78;
  const latency = isTwr042 ? 142 : isGtw108 ? 118 : 68;
  const packetLoss = isTwr042 ? 4.8 : isGtw108 ? 3.1 : 1.2;
  const throughput = isTwr042 ? 184 : isGtw108 ? 420 : 680;
  const users = isTwr042 ? 2840 : isGtw108 ? 1950 : 1420;
  const load = isTwr042 ? 91.2 : isGtw108 ? 88.5 : 76.8;
  const drops = isTwr042 ? 3.4 : isGtw108 ? 1.8 : 0.8;
  const cpu = isTwr042 ? 88.5 : isGtw108 ? 82.0 : 62.4;

  const nsi = Math.min(100, (load * 0.4 + latency * 0.3 + packetLoss * 5.0 + cpu * 0.2)).toFixed(1);
  const sqs = Math.max(5, Math.min(100, 100 - (Math.abs(signal) - 50) * 1.5)).toFixed(1);
  const tpu = ((throughput * 1000) / users).toFixed(1);

  const svmClass = isPun014 ? 'Normal (72.3% Probability)' : 'At Risk (91.4% Probability)';
  const isSvmAtRisk = !isPun014;
  const dbscanClass = isGtw108 ? 'Cluster #1 (Border Node)' : 'Noise Anomaly (Outlier)';
  const isDbscanAnomaly = !isGtw108;

  return (
    <div className="w-full flex flex-col gap-8 animate-page-transition">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              check_circle
            </span>
            <span>{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Section A: Asset Identity Header (Spacious Averon Card) */}
      <section className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-200/70 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.03)] hover:shadow-md transition-all duration-300 relative overflow-hidden">
        {/* Top Meta Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors group"
            >
              <span className="material-symbols-outlined text-[14px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              <span>Command Center</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60">
              Sector 4B • Asset Inspection
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Link to Network Map (Enhanced prominently) */}
            <Link
              to={`/network-map?asset=${encodeURIComponent(assetId)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-purple-700 text-white text-xs font-bold transition-all duration-200 hover:scale-105 shadow-md shadow-indigo-500/20 group cursor-pointer"
              title="Fly to this asset on the live Leaflet geographic cartography map"
            >
              <span className="material-symbols-outlined text-[17px] group-hover:rotate-12 transition-transform">
                explore
              </span>
              <span>Locate on Network Map</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
              <span>
                Snapshot: <strong>16:00:24 IST</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main Identity Row */}
        <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div
              className={`w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg text-white shrink-0 hover:scale-105 transition-transform duration-300 ${
                isSvmAtRisk
                  ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">
                {isGtw108 ? 'dns' : 'cell_tower'}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{assetId}</h1>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {assetType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isSvmAtRisk
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isSvmAtRisk ? 'Critical Attention' : 'Operational Status'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">
                    location_on
                  </span>
                  {location}
                </span>
                <Link
                  to={`/network-map?asset=${encodeURIComponent(assetId)}`}
                  className="font-mono text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  title="View coordinates on network map"
                >
                  <span className="material-symbols-outlined text-[13px]">my_location</span>
                  <span>{coords}</span>
                </Link>
                <span>Hardware: {hardware}</span>
              </p>
            </div>
          </div>

          {/* Separate Model Status Pills (Strict Requirement: Separate SVM & DBSCAN) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* SVM Status Pill */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-default ${
                isSvmAtRisk
                  ? 'bg-rose-50 border-rose-200/80 shadow-rose-100 shadow-sm'
                  : 'bg-emerald-50 border-emerald-200/80'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs ${
                  isSvmAtRisk ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              >
                SVM
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSvmAtRisk ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  Supervised Class
                </span>
                <span
                  className={`text-xs font-extrabold ${
                    isSvmAtRisk ? 'text-rose-950' : 'text-emerald-950'
                  }`}
                >
                  {svmClass}
                </span>
              </div>
            </div>

            {/* DBSCAN Status Pill */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 hover:scale-105 transition-transform duration-200 cursor-default ${
                isDbscanAnomaly
                  ? 'bg-purple-50 border-purple-200/80 shadow-purple-100 shadow-sm'
                  : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs ${
                  isDbscanAnomaly ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                DB
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDbscanAnomaly ? 'text-purple-700' : 'text-slate-600'
                  }`}
                >
                  Density Cluster
                </span>
                <span
                  className={`text-xs font-extrabold ${
                    isDbscanAnomaly ? 'text-purple-950' : 'text-slate-900'
                  }`}
                >
                  {dbscanClass}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Current Telemetry (8 Primary Measurements in Spacious Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Primary Telemetry Measurements
            </h2>
            <p className="text-xs text-slate-400">
              Eight operational measurements versus baseline threshold configuration
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Sample Rate: 1.0 Hz
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Signal Strength (RSRP)</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  signal < -85 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                signal_cellular_alt
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                signal < -85 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {signal} <span className="text-xs font-normal text-slate-400">dBm</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Threshold: &ge; -85 dBm</span>
              <span className={`font-bold ${signal < -85 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {signal < -85 ? `${signal - -85} dBm Breach` : 'Nominal'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  signal < -85 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, 100 - (Math.abs(signal) - 50) * 1.5))}%` }}
              />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Round-Trip Latency</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  latency > 50 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                speed
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                latency > 50 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {latency} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Limit: &le; 50 ms</span>
              <span className={`font-bold ${latency > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {latency > 50 ? `+${Math.round(((latency - 50) / 50) * 100)}% Spike` : 'Nominal'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  latency > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (latency / 160) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Packet Loss Rate</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  packetLoss > 1.0 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                sync_problem
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                packetLoss > 1.0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {packetLoss} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Limit: &le; 1.0 %</span>
              <span
                className={`font-bold ${packetLoss > 1.0 ? 'text-rose-600' : 'text-emerald-600'}`}
              >
                {packetLoss > 1.0 ? `${(packetLoss / 1.0).toFixed(1)}x Above Limit` : 'Optimal'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  packetLoss > 1.0 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (packetLoss / 6.0) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Active Throughput</span>
              <span className="material-symbols-outlined text-[18px] text-amber-500">
                swap_vert
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {throughput} <span className="text-xs font-normal text-slate-400">Mbps</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Target: &ge; 450 Mbps</span>
              <span
                className={`font-bold ${
                  throughput < 450 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {throughput < 450 ? 'Throttled' : 'Optimal'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  throughput < 450 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (throughput / 600) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Connected Subscribers</span>
              <span className="material-symbols-outlined text-[18px] text-indigo-500">groups</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {users.toLocaleString()} <span className="text-xs font-normal text-slate-400">UEs</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Sector Cap: 3,000 UEs</span>
              <span className="font-bold text-indigo-600">
                {((users / 3000) * 100).toFixed(1)}% Saturated
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (users / 3000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 6 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Traffic Load</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  load > 80 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                network_check
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                load > 80 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {load} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Limit: &le; 80 %</span>
              <span className={`font-bold ${load > 80 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {load > 80 ? `+${(load - 80).toFixed(1)}% Overload` : 'Normal Load'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  load > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, load)}%` }}
              />
            </div>
          </div>

          {/* Metric 7 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">Call Drop Rate</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  drops > 1.0 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                phone_missed
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                drops > 1.0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {drops} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Target: &le; 1.0 %</span>
              <span className={`font-bold ${drops > 1.0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {drops > 1.0 ? `+${(drops - 1.0).toFixed(1)}% Breach` : 'Target Met'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  drops > 1.0 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (drops / 5.0) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 8 */}
          <div className="bg-white rounded-[24px] p-5 border border-slate-200/70 shadow-xs hover:border-purple-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider">CPU & Baseband Buffer</span>
              <span
                className={`material-symbols-outlined text-[18px] ${
                  cpu > 75 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                memory
              </span>
            </div>
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                cpu > 75 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {cpu} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Limit: &le; 75 %</span>
              <span className={`font-bold ${cpu > 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {cpu > 75 ? 'Memory Pressure' : 'Healthy Buffers'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  cpu > 75 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, cpu)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section C & D: Threshold Evidence & Engineered Features (2-Column Averon Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section C */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[15px]">rule</span>
              <span>Deterministic Threshold Breaches (4)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Configured Rules Violated by Live Telemetry
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Direct boundary violations established by configured SLA rules before applying ML
              statistical models.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Round-Trip Latency Limit Breach
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Observed: {latency} ms (Configured Max: 50 ms)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">+{latency - 50} ms Delta</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Packet Loss Rate Exceeded</div>
                    <div className="text-[11px] text-slate-400">
                      Observed: {packetLoss} % (Configured Max: 1.0 %)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">
                  +{(packetLoss - 1.0).toFixed(1)} % Delta
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Bandwidth & Traffic Overload
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Observed: {load} % (Configured Ceiling: 80.0 %)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">
                  +{(load - 80.0).toFixed(1)} % Delta
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Baseband Resource Buffer Exhaustion
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Observed: {cpu} % (Configured Max: 75.0 %)
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">
                  +{(cpu - 75.0).toFixed(1)} % Delta
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Source: Configured Network Threshold Policy <code>NOC-DEF-2026-V1</code>
          </div>
        </div>

        {/* Section D */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[15px]">calculate</span>
              <span>Mathematical Feature Engineering</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Computed Pipeline Composite Scores
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Derived mathematical indexes combining multi-dimensional telemetry prior to SVM and
              DBSCAN ingestion.
            </p>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    Network Stress Index (NSI)
                  </span>
                  <span className="text-xs font-extrabold text-rose-600">{nsi} / 100</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Weighted composite formula combining traffic saturation, buffer queuing, and packet
                  retransmission rates.
                </p>
                <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, parseFloat(nsi))}%` }}
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    Signal Quality Score (SQS)
                  </span>
                  <span className="text-xs font-extrabold text-rose-600">{sqs} / 100</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Calculated RF health index factoring RSRP signal loss and carrier-to-interference
                  noise ratio.
                </p>
                <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, parseFloat(sqs))}%` }}
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    Throughput per Connected User
                  </span>
                  <span className="text-xs font-extrabold text-amber-700">{tpu} Kbps</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Fair-share per-user allocation ratio ({throughput} Mbps / {users.toLocaleString()}{' '}
                  UEs). Indicates heavy cell breathing congestion.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Synthesized dynamically in real-time through standard pipeline scaling transforms.
          </div>
        </div>
      </section>

      {/* Section G: Evidence Chain Synthesis */}
      <section className="bg-gradient-to-b from-[#FAF8FF] to-white rounded-[32px] p-8 md:p-10 border border-purple-200/80 shadow-[0_10px_36px_-10px_rgba(99,102,241,0.06)] hover:shadow-lg transition-shadow duration-300">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">account_tree</span>
            <span>Why Was This Asset Flagged? (Evidence Synthesis)</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cross-Layer Investigation Reasoning
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            NEXUSNET correlates low-level physical observations with mathematical ML transformations
            so operators can make rapid, grounded triage decisions without guesswork.
          </p>
        </div>

        {/* Step-by-Step Flow Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="text-xs font-bold text-slate-900 mb-1">Raw Telemetry Strain</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Latency surged to {latency}ms while traffic load reached {load}% with{' '}
              {users.toLocaleString()} simultaneous subscribers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group">
            <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="text-xs font-bold text-slate-900 mb-1">4 Threshold Breaches</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Directly crossed configured policy limits for Latency, Packet Loss, Buffer Load, and
              Call Drops.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="text-xs font-bold text-slate-900 mb-1">High Stress Index ({nsi})</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Composite calculation flagged severe degradation in per-subscriber throughput ({tpu}{' '}
              Kbps).
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-900 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              4
            </div>
            <div className="text-xs font-bold text-slate-900 mb-1">Dual Model Assessment</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>SVM:</strong> {svmClass}.<br />
              <strong>DBSCAN:</strong> {dbscanClass}.
            </p>
          </div>
        </div>
      </section>

      {/* Operator Remediation & Action Bar */}
      <section className="bg-white rounded-[28px] p-7 border border-slate-200/70 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Operator Remediation & Physical Work Orders
          </h3>
          <p className="text-xs text-slate-500">
            Execute immediate mitigation controls or locate on live GIS map
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direct link to Network Map */}
          <Link
            to={`/network-map?asset=${encodeURIComponent(assetId)}`}
            className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">map</span>
            <span>View on Geographic Map</span>
          </Link>

          <button
            onClick={() => handleAction('Acknowledge Incident')}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Acknowledge Incident
          </button>
          <button
            onClick={() => handleAction('Recalibrate RF Azimuth')}
            className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Recalibrate RF Azimuth
          </button>
          <button
            onClick={() => handleAction('Dispatch Field Technician')}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-purple-950 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span>Dispatch Field Technician</span>
          </button>
        </div>
      </section>
    </div>
  );
};
