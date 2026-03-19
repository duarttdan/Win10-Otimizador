import { Cpu, MemoryStick, HardDrive, Thermometer, Activity, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import MetricCard from './MetricCard';
import { SystemMetrics, MetricHistory } from '../types';

interface DashboardProps {
  metrics: SystemMetrics;
  history: MetricHistory[];
  optimized: boolean;
  optimizationCount: number;
}

export default function Dashboard({ metrics, history, optimized, optimizationCount }: DashboardProps) {
  const score = optimized
    ? Math.min(98, 70 + optimizationCount * 3 + Math.floor(Math.random() * 5))
    : Math.max(35, 55 - Math.floor(Math.random() * 10));

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };



  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monitoramento em Tempo Real</h2>
          <p className="text-slate-400 text-sm mt-1">
            {optimized ? '✅ Sistema otimizado e monitorado' : '⚠️ Sistema não otimizado - performance reduzida'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border ${optimized ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <span className="text-xs font-medium uppercase tracking-wider">
              {optimized ? '🟢 Otimizado' : '🔴 Não Otimizado'}
            </span>
          </div>
        </div>
      </div>

      {/* Score + Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Performance Score */}
        <div className="lg:col-span-1 bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Score Geral</p>
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                className={`${score >= 80 ? 'stroke-green-500' : score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'}`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.64} 264`}
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-[10px] text-slate-500">/100</span>
            </div>
          </div>
          <p className={`text-sm font-medium mt-2 ${getScoreColor(score)}`}>
            {score >= 80 ? 'Excelente' : score >= 60 ? 'Bom' : 'Precisa Otimizar'}
          </p>
        </div>

        {/* Metric Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="CPU"
            value={metrics.cpu}
            unit="%"
            icon={<Cpu size={16} className="text-blue-400" />}
            color="bg-blue-500"
            percentage={metrics.cpu}
          />
          <MetricCard
            label="Memória"
            value={metrics.memory}
            unit="%"
            icon={<MemoryStick size={16} className="text-purple-400" />}
            color="bg-purple-500"
            percentage={metrics.memory}
          />
          <MetricCard
            label="Disco"
            value={metrics.disk}
            unit="%"
            icon={<HardDrive size={16} className="text-cyan-400" />}
            color="bg-cyan-500"
            percentage={metrics.disk}
          />
          <MetricCard
            label="Temperatura"
            value={metrics.temperature}
            unit="°C"
            icon={<Thermometer size={16} className="text-orange-400" />}
            color="bg-orange-500"
            percentage={metrics.temperature}
          />
          <MetricCard
            label="Processos"
            value={metrics.processes}
            icon={<Activity size={16} className="text-emerald-400" />}
            color="bg-emerald-500"
          />
          <MetricCard
            label="Uptime"
            value={metrics.uptime}
            icon={<Clock size={16} className="text-slate-400" />}
            color="bg-slate-500"
          />
          <MetricCard
            label="Upload"
            value={metrics.networkUp}
            unit="MB/s"
            icon={<ArrowUp size={16} className="text-green-400" />}
            color="bg-green-500"
          />
          <MetricCard
            label="Download"
            value={metrics.networkDown}
            unit="MB/s"
            icon={<ArrowDown size={16} className="text-indigo-400" />}
            color="bg-indigo-500"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CPU Chart */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <Cpu size={14} className="text-blue-400" /> CPU em Tempo Real
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history.slice(-30)}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Chart */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <MemoryStick size={14} className="text-purple-400" /> Memória em Tempo Real
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history.slice(-30)}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="memory" stroke="#a855f7" fill="url(#memGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
