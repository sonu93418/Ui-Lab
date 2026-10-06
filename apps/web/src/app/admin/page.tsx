'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Activity,
  Box,
  Palette,
  Users,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'audit'>('overview');

  const stats = {
    totalComponents: 19,
    totalThemes: 8,
    totalDownloads: 4892,
    activeUsers: 1420,
    apiStatus: 'Healthy',
    dbStatus: 'Connected',
  };

  const auditEvents = [
    { action: 'CREATE_COMPONENT', resource: 'Component', target: 'modal', user: 'admin@uigen.dev', time: '10 mins ago' },
    { action: 'UPDATE_THEME', resource: 'Theme', target: 'violet', user: 'admin@uigen.dev', time: '42 mins ago' },
    { action: 'PUBLISH_VERSION', resource: 'ComponentVersion', target: 'button v1.0.0', user: 'system', time: '2 hours ago' },
    { action: 'SYSTEM_SEED', resource: 'Database', target: 'Full Registry', user: 'admin@uigen.dev', time: '5 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin Backoffice
            </span>
            <span className="text-xs font-mono text-muted-foreground">Connected to Express API (:4000)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Administration</h1>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:4000/api/health"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-border text-xs text-zinc-300 hover:text-white transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>API Health Check</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Components</span>
            <Box className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalComponents}</div>
          <p className="text-[11px] text-emerald-400">Published & synced to CLI</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Design Themes</span>
            <Palette className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalThemes}</div>
          <p className="text-[11px] text-zinc-400">Tailwind token themes</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">CLI Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400">+18% this week</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Backend Status</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Online</span>
          </div>
          <p className="text-[11px] text-zinc-400">Node/Express + MongoDB</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-muted-foreground hover:text-white'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-muted-foreground hover:text-white'
          }`}
        >
          Audit Log
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decoupled Backend Service details */}
          <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              Decoupled Backend Architecture
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The backend service is completely separated into <code className="text-indigo-300">apps/api</code>, running as an independent Express.js microservice.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">Port:</span>
                <span className="text-white">4000</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">Database:</span>
                <span className="text-white">MongoDB (Mongoose ODM)</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">Auth Engine:</span>
                <span className="text-white">JWT Access (15m) + Argon2id</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">Rate Limiter:</span>
                <span className="text-white">200 req / 15m (Express-Rate-Limit)</span>
              </div>
            </div>
          </div>

          {/* CLI Registry Synchronization */}
          <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              CLI Registry Sync Endpoint
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The CLI synchronizes its manifest against the registry cache endpoint:
            </p>
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400">GET /api/v1/registry/index</span>
                <span className="text-zinc-500">200 OK</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Returns lightweight catalog schema containing slugs, categories, dependencies, and version checksums for offline-first CLI caching.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-panel rounded-2xl border border-border/70 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 border-b border-border/60 text-muted-foreground uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Target</th>
                <th className="p-4">Triggered By</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-zinc-300">
              {auditEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-medium text-indigo-400">{evt.action}</td>
                  <td className="p-4">{evt.resource}</td>
                  <td className="p-4 font-mono text-zinc-200">{evt.target}</td>
                  <td className="p-4 text-muted-foreground">{evt.user}</td>
                  <td className="p-4 text-muted-foreground">{evt.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
