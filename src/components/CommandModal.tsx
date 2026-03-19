import { Copy, X, Terminal } from 'lucide-react';
import { OptimizationTask } from '../types';
import { useState } from 'react';

interface CommandModalProps {
  isOpen: boolean;
  task: OptimizationTask;
  onClose: () => void;
}

export default function CommandModal({ isOpen, task, onClose }: CommandModalProps) {
  const [copied, setCopied] = useState(false);
  const [showRevert, setShowRevert] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCommand = showRevert && task.revertCommand ? task.revertCommand : task.powershellCommand;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Terminal size={20} className="text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">{task.name}</h3>
            <p className="text-xs text-slate-400">Comando PowerShell (Execute como Administrador)</p>
          </div>
        </div>

        {task.revertCommand && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowRevert(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !showRevert ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Comando de Execução
            </button>
            <button
              onClick={() => setShowRevert(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showRevert ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Comando de Reversão
            </button>
          </div>
        )}

        <div className="relative">
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-green-400 terminal-font overflow-x-auto max-h-80 overflow-y-auto">
            {currentCommand}
          </pre>
          <button
            onClick={() => handleCopy(currentCommand)}
            className="absolute top-2 right-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <span className="text-xs text-green-400">Copiado!</span> : <Copy size={14} />}
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-3">
          💡 Copie e cole no PowerShell com privilégios de Administrador para executar no Windows.
        </p>
      </div>
    </div>
  );
}
