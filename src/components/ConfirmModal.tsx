import { AlertTriangle, Shield, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  onConfirm: () => void;
  onCancel: () => void;
  createRestore: boolean;
  onToggleRestore: () => void;
}

const riskConfig = {
  low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Baixo' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'Médio' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'Alto' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Crítico' },
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  risk,
  onConfirm,
  onCancel,
  createRestore,
  onToggleRestore,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const rc = riskConfig[risk];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${rc.bg}`}>
            <AlertTriangle size={20} className={rc.color} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Confirmar Ação</h3>
            <span className={`text-xs font-medium ${rc.color} ${rc.bg} ${rc.border} border px-2 py-0.5 rounded-full`}>
              Risco: {rc.label}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-white font-medium">{title}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>

        {(risk === 'high' || risk === 'critical') && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300">
                Esta ação pode afetar a estabilidade do sistema. Recomendamos criar um ponto de restauração antes de continuar.
              </p>
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 mb-6 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              createRestore
                ? 'bg-blue-500 border-blue-500'
                : 'border-slate-600 group-hover:border-slate-500'
            }`}
            onClick={onToggleRestore}
          >
            {createRestore && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-2" onClick={onToggleRestore}>
            <Shield size={14} className="text-blue-400" />
            <span className="text-sm text-slate-300">Criar ponto de restauração antes</span>
          </div>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
          >
            Confirmar e Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
