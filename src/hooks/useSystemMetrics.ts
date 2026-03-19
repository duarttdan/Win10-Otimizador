import { useState, useEffect, useCallback, useRef } from 'react';
import { SystemMetrics, MetricHistory } from '../types';

function generateMetric(base: number, variance: number, min: number, max: number): number {
  const change = (Math.random() - 0.5) * variance;
  return Math.min(max, Math.max(min, base + change));
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function useSystemMetrics(optimized: boolean, aggressive: boolean) {
  const uptimeRef = useRef(Math.floor(Math.random() * 36000) + 3600);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 35,
    temperature: 52,
    processes: 142,
    uptime: formatUptime(uptimeRef.current),
    networkUp: 2.4,
    networkDown: 15.7,
  });

  const [history, setHistory] = useState<MetricHistory[]>([]);

  const updateMetrics = useCallback(() => {
    uptimeRef.current += 1;
    const cpuBase = aggressive ? 15 : optimized ? 25 : 45;
    const memBase = aggressive ? 35 : optimized ? 45 : 62;
    const tempBase = aggressive ? 42 : optimized ? 45 : 55;
    const processBase = aggressive ? 88 : optimized ? 95 : 142;

    setMetrics(prev => ({
      cpu: Math.round(generateMetric(prev.cpu * 0.7 + cpuBase * 0.3, aggressive ? 5 : 8, 5, 95)),
      memory: Math.round(generateMetric(prev.memory * 0.8 + memBase * 0.2, aggressive ? 4 : 4, 20, 90)),
      disk: Math.round(generateMetric(prev.disk, 2, 0, 100)),
      temperature: Math.round(generateMetric(tempBase, 3, 30, 90)),
      processes: Math.round(generateMetric(processBase, 5, 60, 220)),
      uptime: formatUptime(uptimeRef.current),
      networkUp: Number(generateMetric(aggressive ? 1.0 : optimized ? 1.2 : 2.4, 1, 0, 10).toFixed(1)),
      networkDown: Number(generateMetric(aggressive ? 7.5 : optimized ? 8.5 : 15.7, 3, 0, 50).toFixed(1)),
    }));
  }, [optimized]);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setHistory(prev => {
      const next = [...prev, { time: timeStr, cpu: metrics.cpu, memory: metrics.memory }];
      return next.slice(-60);
    });
  }, [metrics.cpu, metrics.memory]);

  return { metrics, history };
}
