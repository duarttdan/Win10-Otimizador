import { FileText, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PerformanceReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportsPanelProps {
  reports: PerformanceReport[];
}

export default function ReportsPanel({ reports }: ReportsPanelProps) {
  if (reports.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Relatórios de Desempenho</h2>
            <p className="text-sm text-slate-400">Histórico de otimizações e ganhos de performance</p>
          </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-12 flex flex-col items-center justify-center">
          <FileText size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 text-sm">Nenhuma otimização executada ainda</p>
          <p className="text-slate-500 text-xs mt-1">Execute tarefas de otimização para gerar relatórios</p>
        </div>
      </div>
    );
  }

  const latest = reports[reports.length - 1];
  const cpuImprovement = latest.cpuBefore - latest.cpuAfter;
  const memImprovement = latest.memoryBefore - latest.memoryAfter;

  const chartData = reports.map((r, i) => ({
    name: `#${i + 1}`,
    score: r.overallScore,
    prevScore: r.previousScore,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Relatórios de Desempenho</h2>
          <p className="text-sm text-slate-400">{reports.length} relatório(s) gerado(s)</p>
        </div>
      </div>

      {/* Latest Report Summary */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400">Último relatório: {latest.timestamp}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU Redução</p>
            <div className="flex items-center gap-1">
              <TrendingDown size={14} className="text-green-400" />
              <span className="text-lg font-bold text-green-400">-{cpuImprovement}%</span>
            </div>
            <p className="text-[10px] text-slate-500">{latest.cpuBefore}% → {latest.cpuAfter}%</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Memória Redução</p>
            <div className="flex items-center gap-1">
              <TrendingDown size={14} className="text-green-400" />
              <span className="text-lg font-bold text-green-400">-{memImprovement}%</span>
            </div>
            <p className="text-[10px] text-slate-500">{latest.memoryBefore}% → {latest.memoryAfter}%</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tarefas</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{latest.tasksCompleted}</span>
              <CheckCircle size={14} className="text-green-400" />
              {latest.tasksFailed > 0 && (
                <>
                  <span className="text-lg font-bold text-red-400">{latest.tasksFailed}</span>
                  <XCircle size={14} className="text-red-400" />
                </>
              )}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Input Lag</p>
            <div className="flex items-center gap-1">
              <TrendingDown size={14} className="text-cyan-400" />
              <span className="text-lg font-bold text-cyan-400">{latest.inputLagReduction}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score Anterior</p>
            <span className="text-2xl font-bold text-slate-500">{latest.previousScore}</span>
          </div>
          <TrendingUp size={24} className="text-green-400" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score Atual</p>
            <span className="text-2xl font-bold text-green-400">{latest.overallScore}</span>
          </div>
          <div className="ml-auto">
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
              +{latest.overallScore - latest.previousScore} pontos
            </span>
          </div>
        </div>
      </div>

      {/* Score History Chart */}
      {reports.length > 1 && (
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Evolução do Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 60 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* All Reports */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Histórico Completo</h3>
        {reports.slice().reverse().map((report, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                report.overallScore >= 80 ? 'bg-green-500/15 text-green-400' : report.overallScore >= 60 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {report.overallScore}
              </div>
              <div>
                <p className="text-sm text-white">{report.timestamp}</p>
                <p className="text-[10px] text-slate-500">
                  {report.tasksCompleted} tarefas • Espaço liberado: {report.diskSpaceFreed}
                </p>
              </div>
            </div>
            <span className="text-xs text-green-400">
              +{report.overallScore - report.previousScore} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
