export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
  processes: number;
  uptime: string;
  networkUp: number;
  networkDown: number;
}

export interface MetricHistory {
  time: string;
  cpu: number;
  memory: number;
}

export type ProductPlan = 'starter' | 'pro' | 'enterprise';

export interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  category: 'cleanup' | 'power' | 'input_lag' | 'services' | 'registry' | 'network';
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  permanent: boolean;
  reversible: boolean;
  powershellCommand: string;
  revertCommand?: string;
  estimatedGain: string;
  actualGain?: string;
  allowedPlans?: ProductPlan[];
}

export interface PerformanceReport {
  timestamp: string;
  tasksCompleted: number;
  tasksFailed: number;
  cpuBefore: number;
  cpuAfter: number;
  memoryBefore: number;
  memoryAfter: number;
  diskSpaceFreed: string;
  inputLagReduction: string;
  overallScore: number;
  previousScore: number;
}

export interface RestorePoint {
  id: string;
  name: string;
  timestamp: string;
  description: string;
}

export type TabId = 'dashboard' | 'cleanup' | 'power' | 'inputlag' | 'services' | 'reports' | 'terminal' | 'scripts';

export interface TerminalLine {
  id: number;
  text: string;
  type: 'command' | 'output' | 'success' | 'error' | 'warning' | 'info';
}
