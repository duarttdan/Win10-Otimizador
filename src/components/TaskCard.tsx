import { Play, Check, X, RotateCcw, Loader2, Lock } from 'lucide-react';
import { OptimizationTask } from '../types';

interface TaskCardProps {
  task: OptimizationTask;
  onRun: (task: OptimizationTask) => void;
  onRevert: (task: OptimizationTask) => void;
  onShowCommand: (task: OptimizationTask) => void;
  allowed: boolean;
}

const riskColors = {
  low: { badge: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400' },
  medium: { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  high: { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  critical: { badge: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
};

const riskLabels = { low: 'Baixo', medium: 'Médio', high: 'Alto', critical: 'Crítico' };

const statusConfig = {
  pending: { icon: <Play size={14} />, label: 'Executar', btnClass: 'bg-blue-500 hover:bg-blue-600' },
  running: { icon: <Loader2 size={14} className="animate-spin" />, label: 'Executando...', btnClass: 'bg-yellow-500 cursor-not-allowed' },
  completed: { icon: <Check size={14} />, label: 'Concluído', btnClass: 'bg-green-600 cursor-default' },
  failed: { icon: <X size={14} />, label: 'Falhou', btnClass: 'bg-red-600 cursor-default' },
  skipped: { icon: <X size={14} />, label: 'Pulado', btnClass: 'bg-slate-600 cursor-default' },
};

export default function TaskCard({ task, onRun, onRevert, onShowCommand }: TaskCardProps) {
  const rc = riskColors[task.risk];
  const sc = statusConfig[task.status];

  return (
    <div className={`bg-slate-800/40 border rounded-xl p-4 transition-all hover:border-slate-600/60 ${
      task.status === 'completed' ? 'border-green-500/20' : task.status === 'failed' ? 'border-red-500/20' : 'border-slate-700/40'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="text-sm font-semibold text-white">{task.name}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rc.badge} font-medium`}>
              {riskLabels[task.risk]}
            </span>
            {task.permanent && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Lock size={8} /> Permanente
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2">{task.description}</p>
          <p className="text-[11px] text-slate-500">
            📈 Ganho estimado: <span className="text-slate-300">{task.estimatedGain}</span>
          </p>
          {task.actualGain && (
            <p className="text-[11px] text-green-400 mt-1">
              ✅ Resultado: {task.actualGain}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => task.status === 'pending' && allowed && onRun(task)}
            disabled={task.status === 'running' || !allowed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium transition-colors ${!allowed ? 'bg-slate-500 cursor-not-allowed' : sc.btnClass}`}
          >
            {sc.icon}
            {sc.label}
          </button>

          {task.status === 'completed' && task.reversible && (
            <button
              onClick={() => onRevert(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-700 hover:bg-slate-600 font-medium transition-colors"
            >
              <RotateCcw size={12} />
              Reverter
            </button>
          )}

          {!allowed && (
            <div className="text-[10px] text-amber-300 mt-1">Plano insuficiente: disponível apenas para Pro/Enterprise</div>
          )}
          <button
            onClick={() => onShowCommand(task)}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Ver comando →
          </button>
        </div>
      </div>
    </div>
  );
}
