import { useState, useCallback, useRef } from 'react';
import { Trash2, Zap, MousePointer, Settings2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OptimizationPanel from './components/OptimizationPanel';
import ReportsPanel from './components/ReportsPanel';
import TerminalPanel from './components/TerminalPanel';
import ScriptsPanel from './components/ScriptsPanel';
import { useSystemMetrics } from './hooks/useSystemMetrics';
import { cleanupTasks, powerTasks, inputLagTasks, serviceTasks } from './data/optimizations';
import {
  TabId,
  OptimizationTask,
  TerminalLine,
  PerformanceReport,
  RestorePoint,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [optimized, setOptimized] = useState(false);
  const [optimizationCount, setOptimizationCount] = useState(0);

  // Task states
  const [cleanup, setCleanup] = useState<OptimizationTask[]>(cleanupTasks);
  const [power, setPower] = useState<OptimizationTask[]>(powerTasks);
  const [inputLag, setInputLag] = useState<OptimizationTask[]>(inputLagTasks);
  const [services, setServices] = useState<OptimizationTask[]>(serviceTasks);

  // Terminal & Reports
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const lineIdRef = useRef(0);

  const [aggressiveMode, setAggressiveMode] = useState(false);
  const { metrics, history } = useSystemMetrics(optimized, aggressiveMode);

  const addTerminalLine = useCallback((line: Omit<TerminalLine, 'id'>) => {
    lineIdRef.current += 1;
    setTerminalLines(prev => [...prev, { ...line, id: lineIdRef.current }]);
  }, []);

  const createRestorePoint = useCallback((name: string) => {
    const rp: RestorePoint = {
      id: `rp-${Date.now()}`,
      name,
      timestamp: new Date().toLocaleString('pt-BR'),
      description: name,
    };
    setRestorePoints(prev => [...prev, rp]);
  }, []);

  const handleOptimized = useCallback(() => {
    setOptimizationCount(prev => {
      const next = prev + 1;
      if (next >= 3) setOptimized(true);

      // Generate report periodically
      if (next % 3 === 0 || next === 1) {
        const cpuBefore = 45 + Math.floor(Math.random() * 20);
        const memBefore = 60 + Math.floor(Math.random() * 15);
        const prevScore = reports.length > 0 ? reports[reports.length - 1].overallScore : 45;
        const newScore = Math.min(98, prevScore + 5 + Math.floor(Math.random() * 10));

        const report: PerformanceReport = {
          timestamp: new Date().toLocaleString('pt-BR'),
          tasksCompleted: next,
          tasksFailed: Math.random() > 0.8 ? 1 : 0,
          cpuBefore,
          cpuAfter: Math.max(10, cpuBefore - 10 - Math.floor(Math.random() * 15)),
          memoryBefore: memBefore,
          memoryAfter: Math.max(25, memBefore - 8 - Math.floor(Math.random() * 12)),
          diskSpaceFreed: `${(0.5 + Math.random() * 4).toFixed(1)} GB`,
          inputLagReduction: `-${5 + Math.floor(Math.random() * 25)}ms`,
          overallScore: newScore,
          previousScore: prevScore,
        };
        setReports(prev => [...prev, report]);
      }

      return next;
    });
  }, [reports]);

  const makeTaskUpdater = (setter: React.Dispatch<React.SetStateAction<OptimizationTask[]>>) => {
    return (taskId: string, updates: Partial<OptimizationTask>) => {
      setter(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    };
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
              metrics={metrics}
              history={history}
              optimized={optimized}
              optimizationCount={optimizationCount}
              aggressiveMode={aggressiveMode}
              onToggleAggressive={() => setAggressiveMode(prev => !prev)}
            />
        );
      case 'cleanup':
        return (
          <OptimizationPanel
            title="Limpeza de Disco"
            description="Remova arquivos temporários, cache, logs e libere espaço em disco"
            icon={<Trash2 size={24} className="text-red-400" />}
            tasks={cleanup}
            onTaskUpdate={makeTaskUpdater(setCleanup)}
            onLog={addTerminalLine}
            onOptimized={handleOptimized}
            onRestorePoint={createRestorePoint}
          />
        );
      case 'power':
        return (
          <OptimizationPanel
            title="Plano de Energia Máxima"
            description="Ative o Ultimate Performance Plan e maximize a potência do hardware"
            icon={<Zap size={24} className="text-yellow-400" />}
            tasks={power}
            onTaskUpdate={makeTaskUpdater(setPower)}
            onLog={addTerminalLine}
            onOptimized={handleOptimized}
            onRestorePoint={createRestorePoint}
          />
        );
      case 'inputlag':
        return (
          <OptimizationPanel
            title="Redução de Input Lag"
            description="Elimine latência do sistema, rede e periféricos para máxima responsividade"
            icon={<MousePointer size={24} className="text-cyan-400" />}
            tasks={inputLag}
            onTaskUpdate={makeTaskUpdater(setInputLag)}
            onLog={addTerminalLine}
            onOptimized={handleOptimized}
            onRestorePoint={createRestorePoint}
          />
        );
      case 'services':
        return (
          <OptimizationPanel
            title="Otimização de Serviços"
            description="Desative serviços desnecessários que consomem recursos em background"
            icon={<Settings2 size={24} className="text-purple-400" />}
            tasks={services}
            onTaskUpdate={makeTaskUpdater(setServices)}
            onLog={addTerminalLine}
            onOptimized={handleOptimized}
            onRestorePoint={createRestorePoint}
          />
        );
      case 'reports':
        return <ReportsPanel reports={reports} />;
      case 'terminal':
        return <TerminalPanel lines={terminalLines} />;
      case 'scripts':
        return <ScriptsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50">
            <div className="flex items-center gap-4">
              {restorePoints.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {restorePoints.length} ponto(s) de restauração
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Windows 10 Pro</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-green-400">v2.0</span>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
