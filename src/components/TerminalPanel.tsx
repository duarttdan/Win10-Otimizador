import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { TerminalLine } from '../types';

interface TerminalPanelProps {
  lines: TerminalLine[];
}

const typeColors = {
  command: 'text-cyan-400',
  output: 'text-slate-300',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export default function TerminalPanel({ lines }: TerminalPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Terminal size={24} className="text-green-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Terminal de Atividade</h2>
          <p className="text-sm text-slate-400">Log em tempo real de todas as operações</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="text-xs text-slate-500 ml-2 terminal-font">TurboBoost Terminal — PowerShell</span>
        </div>

        {/* Terminal Body */}
        <div ref={scrollRef} className="p-4 h-[500px] overflow-y-auto terminal-font text-sm">
          {lines.length === 0 ? (
            <div className="text-slate-600">
              <p>Windows PowerShell</p>
              <p>Copyright (C) Microsoft Corporation. Todos os direitos reservados.</p>
              <p className="mt-2">TurboBoost Optimizer v2.0 — Aguardando comandos...</p>
              <p className="mt-1 cursor-blink">PS C:\TurboBoost&gt; </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="text-slate-600 mb-2">
                <p>TurboBoost Optimizer v2.0 — Log de Atividade</p>
                <p>{'═'.repeat(50)}</p>
              </div>
              {lines.map(line => (
                <p key={line.id} className={`${typeColors[line.type]} leading-relaxed`}>
                  {line.text}
                </p>
              ))}
              <p className="text-slate-500 mt-2 cursor-blink">PS C:\TurboBoost&gt; </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
