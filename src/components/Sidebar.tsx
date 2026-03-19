import React from 'react';
import {
  LayoutDashboard,
  Trash2,
  Zap,
  MousePointer,
  Settings2,
  FileText,
  Terminal,
  Download,
  Shield,
} from 'lucide-react';
import { TabId } from '../types';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'cleanup', label: 'Limpeza de Disco', icon: <Trash2 size={18} /> },
  { id: 'power', label: 'Energia Máxima', icon: <Zap size={18} /> },
  { id: 'inputlag', label: 'Input Lag', icon: <MousePointer size={18} /> },
  { id: 'services', label: 'Serviços', icon: <Settings2 size={18} /> },
  { id: 'reports', label: 'Relatórios', icon: <FileText size={18} /> },
  { id: 'terminal', label: 'Terminal', icon: <Terminal size={18} /> },
  { id: 'scripts', label: 'Exportar Scripts', icon: <Download size={18} /> },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">TurboBoost</h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Win10 Optimizer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Monitorando Sistema</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
