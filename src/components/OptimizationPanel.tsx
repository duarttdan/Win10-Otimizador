import { useState } from 'react';
import { Zap } from 'lucide-react';
import TaskCard from './TaskCard';
import ConfirmModal from './ConfirmModal';
import CommandModal from './CommandModal';
import { OptimizationTask, TerminalLine } from '../types';

interface OptimizationPanelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: OptimizationTask[];
  onTaskUpdate: (taskId: string, updates: Partial<OptimizationTask>) => void;
  onLog: (line: Omit<TerminalLine, 'id'>) => void;
  onOptimized: () => void;
  onRestorePoint: (name: string) => void;
}

export default function OptimizationPanel({
  title,
  description,
  icon,
  tasks,
  onTaskUpdate,
  onLog,
  onOptimized,
  onRestorePoint,
}: OptimizationPanelProps) {
  const [confirmModal, setConfirmModal] = useState<OptimizationTask | null>(null);
  const [commandModal, setCommandModal] = useState<OptimizationTask | null>(null);
  const [createRestore, setCreateRestore] = useState(true);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const simulateTask = async (task: OptimizationTask) => {
    if (createRestore && (task.risk === 'high' || task.risk === 'critical')) {
      onRestorePoint(`Antes de: ${task.name}`);
      onLog({ text: `[RESTORE] Ponto de restauração criado: "Antes de: ${task.name}"`, type: 'info' });
      await new Promise(r => setTimeout(r, 800));
    }

    onTaskUpdate(task.id, { status: 'running' });
    onLog({ text: `> Executando: ${task.name}...`, type: 'command' });

    await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));

    const success = Math.random() > 0.05;
    if (success) {
      onTaskUpdate(task.id, {
        status: 'completed',
        actualGain: task.estimatedGain,
      });
      onLog({ text: `[OK] ${task.name} concluído com sucesso`, type: 'success' });
      onOptimized();
    } else {
      onTaskUpdate(task.id, { status: 'failed' });
      onLog({ text: `[ERRO] ${task.name} falhou - nenhuma alteração foi feita`, type: 'error' });
    }
  };

  const handleRun = (task: OptimizationTask) => {
    if (task.risk === 'high' || task.risk === 'critical' || task.risk === 'medium') {
      setConfirmModal(task);
    } else {
      simulateTask(task);
    }
  };

  const handleConfirm = () => {
    if (confirmModal) {
      simulateTask(confirmModal);
      setConfirmModal(null);
    }
  };

  const handleRevert = async (task: OptimizationTask) => {
    onTaskUpdate(task.id, { status: 'running' });
    onLog({ text: `> Revertendo: ${task.name}...`, type: 'warning' });
    await new Promise(r => setTimeout(r, 1000));
    onTaskUpdate(task.id, { status: 'pending', actualGain: undefined });
    onLog({ text: `[OK] ${task.name} revertido ao estado original`, type: 'success' });
  };

  const handleRunAll = async () => {
    const pending = tasks.filter(t => t.status === 'pending');
    onLog({ text: `\n═══ Executando ${pending.length} tarefas em sequência ═══`, type: 'info' });

    if (createRestore) {
      onRestorePoint(`Antes de otimização: ${title}`);
      onLog({ text: `[RESTORE] Ponto de restauração criado: "Otimização: ${title}"`, type: 'info' });
      await new Promise(r => setTimeout(r, 800));
    }

    for (const task of pending) {
      await simulateTask(task);
    }
    onLog({ text: `═══ Todas as tarefas concluídas ═══\n`, type: 'info' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        <button
          onClick={handleRunAll}
          disabled={completedCount === tasks.length}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={16} />
          Executar Tudo
        </button>
      </div>

      {/* Progress */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Progresso</span>
          <span className="text-xs text-slate-300 font-medium">{completedCount}/{tasks.length} concluídas</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onRun={handleRun}
            onRevert={handleRevert}
            onShowCommand={setCommandModal}
          />
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          title={confirmModal.name}
          description={confirmModal.description}
          risk={confirmModal.risk}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(null)}
          createRestore={createRestore}
          onToggleRestore={() => setCreateRestore(!createRestore)}
        />
      )}

      {/* Command Modal */}
      {commandModal && (
        <CommandModal
          isOpen={!!commandModal}
          task={commandModal}
          onClose={() => setCommandModal(null)}
        />
      )}
    </div>
  );
}
