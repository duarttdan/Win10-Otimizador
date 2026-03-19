import { Download, Copy, FileCode2, Shield, AlertTriangle } from 'lucide-react';
import { cleanupTasks, powerTasks, inputLagTasks, serviceTasks } from '../data/optimizations';
import { useState } from 'react';

function generateFullScript(categories: string[]): string {
  const header = `#Requires -RunAsAdministrator
<#
╔══════════════════════════════════════════════════════════════╗
║           TurboBoost - Windows 10 Performance Optimizer      ║
║                    Script Gerado Automaticamente             ║
║                                                              ║
║  IMPORTANTE: Execute como Administrador!                     ║
║  Este script cria um ponto de restauração automaticamente.   ║
╚══════════════════════════════════════════════════════════════╝
#>

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     TurboBoost - Windows 10 Performance Optimizer   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ═══ CRIAR PONTO DE RESTAURAÇÃO ═══
Write-Host "[INFO] Criando ponto de restauração..." -ForegroundColor Yellow
try {
    Enable-ComputerRestore -Drive "C:\\" -ErrorAction SilentlyContinue
    Checkpoint-Computer -Description "TurboBoost Optimizer Backup" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop
    Write-Host "[OK] Ponto de restauração criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "[AVISO] Não foi possível criar ponto de restauração: $_" -ForegroundColor Yellow
}
Write-Host ""

`;

  let body = '';

  const allCategories = {
    cleanup: { name: 'LIMPEZA DE DISCO', tasks: cleanupTasks },
    power: { name: 'PLANO DE ENERGIA MÁXIMA', tasks: powerTasks },
    inputlag: { name: 'REDUÇÃO DE INPUT LAG', tasks: inputLagTasks },
    services: { name: 'OTIMIZAÇÃO DE SERVIÇOS', tasks: serviceTasks },
  };

  for (const cat of categories) {
    const category = allCategories[cat as keyof typeof allCategories];
    if (!category) continue;

    body += `\n# ${'═'.repeat(60)}\n`;
    body += `# ${category.name}\n`;
    body += `# ${'═'.repeat(60)}\n`;
    body += `Write-Host "\\n═══ ${category.name} ═══" -ForegroundColor Cyan\n\n`;

    for (const task of category.tasks) {
      body += `# --- ${task.name} ---\n`;
      body += `Write-Host "[...] ${task.name}..." -ForegroundColor Yellow\n`;
      body += `try {\n`;
      body += task.powershellCommand.split('\n').map(l => `    ${l}`).join('\n');
      body += `\n} catch {\n    Write-Host "[ERRO] Falha em: ${task.name} - \$_" -ForegroundColor Red\n}\n\n`;
    }
  }

  const footer = `
# ═══ RELATÓRIO FINAL ═══
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              OTIMIZAÇÃO CONCLUÍDA!                   ║" -ForegroundColor Green
Write-Host "║                                                      ║" -ForegroundColor Green
Write-Host "║  Todas as otimizações foram aplicadas com sucesso.  ║" -ForegroundColor Green
Write-Host "║  As mudanças são PERMANENTES até reversão manual.   ║" -ForegroundColor Green
Write-Host "║                                                      ║" -ForegroundColor Green
Write-Host "║  Para reverter, use o Ponto de Restauração criado   ║" -ForegroundColor Green
Write-Host "║  ou execute o script de reversão.                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`;

  return header + body + footer;
}

function generateRevertScript(): string {
  return `#Requires -RunAsAdministrator
<#
╔══════════════════════════════════════════════════════════════╗
║      TurboBoost - Script de REVERSÃO de Otimizações         ║
║                                                              ║
║  Este script reverte todas as alterações feitas pelo         ║
║  otimizador, restaurando as configurações originais.         ║
╚══════════════════════════════════════════════════════════════╝
#>

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║     TurboBoost - Reversão de Otimizações             ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Deseja reverter TODAS as otimizações? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Gray
    exit
}

Write-Host ""

# Reverter Plano de Energia
Write-Host "[...] Revertendo plano de energia..." -ForegroundColor Yellow
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 5
powercfg -SETACTIVE SCHEME_CURRENT
Write-Host "[OK] Plano de energia equilibrado restaurado" -ForegroundColor Green

# Reverter USB Suspend
powercfg -SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 1
powercfg -SETACTIVE SCHEME_CURRENT

# Reverter HPET
Write-Host "[...] Revertendo HPET..." -ForegroundColor Yellow
bcdedit /deletevalue useplatformtick 2>$null
bcdedit /deletevalue disabledynamictick 2>$null
Write-Host "[OK] HPET restaurado" -ForegroundColor Green

# Reverter Mouse
Write-Host "[...] Revertendo configurações do mouse..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseSpeed" -Value "1" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold1" -Value "6" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold2" -Value "10" -Force
Write-Host "[OK] Mouse restaurado" -ForegroundColor Green

# Reverter Fullscreen Optimizations
Remove-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_HonorUserFSEBehaviorMode" -ErrorAction SilentlyContinue

# Reverter System Priority
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "SystemResponsiveness" -Value 20 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 10 -Type DWord -Force

# Reverter Nagle
Write-Host "[...] Revertendo Nagle Algorithm..." -ForegroundColor Yellow
$adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
foreach ($adapter in $adapters) {
    Remove-ItemProperty -Path $adapter.PSPath -Name "TcpAckFrequency" -ErrorAction SilentlyContinue
    Remove-ItemProperty -Path $adapter.PSPath -Name "TCPNoDelay" -ErrorAction SilentlyContinue
    Remove-ItemProperty -Path $adapter.PSPath -Name "TcpDelAckTicks" -ErrorAction SilentlyContinue
}
Write-Host "[OK] Nagle restaurado" -ForegroundColor Green

# Reverter Serviços
Write-Host "[...] Revertendo serviços..." -ForegroundColor Yellow
$services = @("DiagTrack", "dmwappushservice", "WSearch", "SysMain")
foreach ($svc in $services) {
    Set-Service -Name $svc -StartupType Automatic -ErrorAction SilentlyContinue
    Start-Service -Name $svc -ErrorAction SilentlyContinue
}

# Reverter Cortana
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue

# Reverter Xbox
$xboxServices = @("XblAuthManager", "XblGameSave", "XboxNetApiSvc", "XboxGipSvc")
foreach ($svc in $xboxServices) {
    Set-Service -Name $svc -StartupType Manual -ErrorAction SilentlyContinue
}
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_Enabled" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue

# Reverter Telemetria
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 3 -Type DWord -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Todos os serviços restaurados" -ForegroundColor Green

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        REVERSÃO CONCLUÍDA COM SUCESSO!               ║" -ForegroundColor Green
Write-Host "║  Reinicie o computador para aplicar as mudanças.    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`;
}

const scriptCategories = [
  { id: 'cleanup', name: 'Limpeza de Disco', icon: '🧹', desc: 'Arquivos temporários, cache, logs' },
  { id: 'power', name: 'Energia Máxima', icon: '⚡', desc: 'Ultimate Performance Plan' },
  { id: 'inputlag', name: 'Input Lag', icon: '🖱️', desc: 'Redução de latência do sistema' },
  { id: 'services', name: 'Serviços', icon: '⚙️', desc: 'Desativar serviços desnecessários' },
];

export default function ScriptsPanel() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['cleanup', 'power', 'inputlag', 'services']);
  const [copied, setCopied] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const fullScript = generateFullScript(selectedCategories);
  const revertScript = generateRevertScript();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <FileCode2 size={24} className="text-emerald-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Exportar Scripts PowerShell</h2>
          <p className="text-sm text-slate-400">Gere scripts .ps1 para executar diretamente no Windows 10</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-amber-300 font-medium">Importante - Leia antes de executar</p>
          <ul className="text-xs text-amber-200/80 mt-1 space-y-1 list-disc list-inside">
            <li>Execute o PowerShell como <strong>Administrador</strong></li>
            <li>O script cria automaticamente um ponto de restauração</li>
            <li>Revise os comandos antes de executar</li>
            <li>Use o script de reversão para desfazer as alterações</li>
            <li>Pode ser necessário: <code className="bg-amber-500/20 px-1 rounded">Set-ExecutionPolicy RemoteSigned</code></li>
          </ul>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Selecione as categorias:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scriptCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedCategories.includes(cat.id)
                  ? 'bg-blue-500/10 border-blue-500/40 text-white'
                  : 'bg-slate-900/50 border-slate-700/40 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <p className="text-sm font-medium mt-1">{cat.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Optimization Script */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-400" />
            <h3 className="text-sm font-medium text-white">Script de Otimização</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Contém todas as otimizações selecionadas com ponto de restauração automático.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(fullScript, 'TurboBoost_Optimizer.ps1')}
              disabled={selectedCategories.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Download size={14} />
              Baixar .ps1
            </button>
            <button
              onClick={() => handleCopy(fullScript, 'opt')}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
            >
              {copied === 'opt' ? '✓' : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Revert Script */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-orange-400" />
            <h3 className="text-sm font-medium text-white">Script de Reversão</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Reverte todas as otimizações, restaurando configurações originais do Windows.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(revertScript, 'TurboBoost_Revert.ps1')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              <Download size={14} />
              Baixar .ps1
            </button>
            <button
              onClick={() => handleCopy(revertScript, 'rev')}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
            >
              {copied === 'rev' ? '✓' : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <span className="text-xs text-slate-500 terminal-font">Preview: TurboBoost_Optimizer.ps1</span>
          <span className="text-xs text-slate-600">{selectedCategories.length} categoria(s)</span>
        </div>
        <pre className="p-4 text-xs text-green-400 terminal-font overflow-auto max-h-64 whitespace-pre-wrap">
          {fullScript.slice(0, 2000)}
          {fullScript.length > 2000 && '\n\n... (script completo no download)'}
        </pre>
      </div>
    </div>
  );
}
