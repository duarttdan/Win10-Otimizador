import { OptimizationTask } from '../types';

export const cleanupTasks: OptimizationTask[] = [
  {
    id: 'clean-temp',
    name: 'Limpar Arquivos Temporários',
    description: 'Remove arquivos temporários do sistema (%TEMP%, Windows\\Temp)',
    category: 'cleanup',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Limpeza de Arquivos Temporários
Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Arquivos temporários removidos com sucesso" -ForegroundColor Green`,
    estimatedGain: '500MB - 5GB de espaço livre',
  },
  {
    id: 'clean-cache',
    name: 'Limpar Cache do Sistema',
    description: 'Remove cache de thumbnails, ícones, DNS e Windows Update',
    category: 'cleanup',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Limpeza de Cache do Sistema
Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\INetCache\\*" -Recurse -Force -ErrorAction SilentlyContinue
ipconfig /flushdns
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service -Name wuauserv -ErrorAction SilentlyContinue
Write-Host "[OK] Cache do sistema limpo com sucesso" -ForegroundColor Green`,
    estimatedGain: '200MB - 2GB de espaço livre',
  },
  {
    id: 'clean-logs',
    name: 'Limpar Logs do Sistema',
    description: 'Remove logs antigos do Event Viewer e logs de aplicações',
    category: 'cleanup',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Limpeza de Logs do Sistema
wevtutil el | ForEach-Object { wevtutil cl "$_" 2>$null }
Remove-Item -Path "C:\\Windows\\Logs\\CBS\\*.log" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\Logs\\DISM\\*.log" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\\CrashDumps\\*" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\Minidump\\*" -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Logs do sistema limpos com sucesso" -ForegroundColor Green`,
    estimatedGain: '100MB - 1GB de espaço livre',
  },
  {
    id: 'clean-prefetch',
    name: 'Limpar Prefetch',
    description: 'Limpa dados de prefetch para resetar otimização de inicialização',
    category: 'cleanup',
    risk: 'medium',
    status: 'pending',
    permanent: false,
    reversible: true,
    powershellCommand: `# Limpeza de Prefetch
Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Prefetch limpo com sucesso" -ForegroundColor Green`,
    revertCommand: `# O Windows recria automaticamente os dados de prefetch`,
    estimatedGain: '50MB - 200MB + reset de cache de inicialização',
  },
  {
    id: 'clean-recycle',
    name: 'Esvaziar Lixeira',
    description: 'Esvazia a lixeira de todos os drives',
    category: 'cleanup',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Esvaziar Lixeira
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Lixeira esvaziada com sucesso" -ForegroundColor Green`,
    estimatedGain: 'Variável - depende do conteúdo da lixeira',
  },
  {
    id: 'clean-delivery',
    name: 'Limpar Delivery Optimization',
    description: 'Remove arquivos de otimização de entrega do Windows Update',
    category: 'cleanup',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Limpar Delivery Optimization
Stop-Service -Name DoSvc -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\ServiceProfiles\\NetworkService\\AppData\\Local\\Microsoft\\Windows\\DeliveryOptimization\\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service -Name DoSvc -ErrorAction SilentlyContinue
Write-Host "[OK] Delivery Optimization limpo" -ForegroundColor Green`,
    estimatedGain: '500MB - 3GB de espaço livre',
  },
];

export const powerTasks: OptimizationTask[] = [
  {
    id: 'power-ultimate',
    name: 'Ativar Ultimate Performance Plan',
    description: 'Ativa o plano de energia de desempenho máximo (Ultimate Performance)',
    category: 'power',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Ativar Ultimate Performance Power Plan
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
$ultimatePlan = powercfg -list | Select-String "Ultimate" | ForEach-Object { ($_ -split '\\s+')[3] }
if ($ultimatePlan) {
    powercfg -setactive $ultimatePlan
    Write-Host "[OK] Ultimate Performance Plan ativado!" -ForegroundColor Green
} else {
    powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
    Write-Host "[OK] High Performance Plan ativado como fallback" -ForegroundColor Yellow
}`,
    revertCommand: `# Reverter para plano Equilibrado
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e
Write-Host "[OK] Plano Equilibrado restaurado" -ForegroundColor Green`,
    estimatedGain: '10-25% mais performance em CPU',
  },
  {
    id: 'power-usb-suspend',
    name: 'Desativar USB Selective Suspend',
    description: 'Impede que o Windows desligue portas USB para economizar energia',
    category: 'power',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar USB Selective Suspend
powercfg -SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
powercfg -SETDCVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
powercfg -SETACTIVE SCHEME_CURRENT
Write-Host "[OK] USB Selective Suspend desativado" -ForegroundColor Green`,
    revertCommand: `powercfg -SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 1
powercfg -SETACTIVE SCHEME_CURRENT`,
    estimatedGain: 'Elimina desconexões de USB e reduz latência de periféricos',
  },
  {
    id: 'power-pci-express',
    name: 'Desativar PCI Express Link State Power Management',
    description: 'Mantém links PCI Express sempre ativos para máxima performance da GPU',
    category: 'power',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar PCI Express Link State Power Management
powercfg -SETACVALUEINDEX SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0
powercfg -SETACTIVE SCHEME_CURRENT
Write-Host "[OK] PCI Express Power Management desativado" -ForegroundColor Green`,
    revertCommand: `powercfg -SETACVALUEINDEX SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 2
powercfg -SETACTIVE SCHEME_CURRENT`,
    estimatedGain: '5-15% mais performance em GPU',
  },
  {
    id: 'power-cpu-states',
    name: 'Configurar CPU para 100% Mínimo',
    description: 'Define estado mínimo do processador para 100%, eliminando throttling',
    category: 'power',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Configurar CPU Minimum State para 100%
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100
powercfg -SETACTIVE SCHEME_CURRENT
Write-Host "[OK] CPU configurada para 100% constante" -ForegroundColor Green`,
    revertCommand: `powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 5
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100
powercfg -SETACTIVE SCHEME_CURRENT`,
    estimatedGain: 'Elimina CPU throttling, resposta instantânea',
  },
];

export const inputLagTasks: OptimizationTask[] = [
  {
    id: 'input-game-mode',
    name: 'Otimizar Game Mode',
    description: 'Configura o Game Mode do Windows para prioridade máxima',
    category: 'input_lag',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Otimizar Game Mode
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AllowAutoGameMode" -Value 1 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Value 1 -Type DWord -Force
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" -Name "GPU Priority" -Value 8 -Type DWord -Force -ErrorAction SilentlyContinue
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" -Name "Priority" -Value 6 -Type DWord -Force -ErrorAction SilentlyContinue
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" -Name "Scheduling Category" -Value "High" -Type String -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Game Mode otimizado" -ForegroundColor Green`,
    revertCommand: `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AllowAutoGameMode" -Value 0 -Type DWord -Force`,
    estimatedGain: 'Redução de 5-15ms no input lag em jogos',
  },
  {
    id: 'input-hpet',
    name: 'Desativar HPET (High Precision Event Timer)',
    description: 'Remove HPET para reduzir latência de sistema',
    category: 'input_lag',
    risk: 'high',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar HPET
bcdedit /deletevalue useplatformclock 2>$null
bcdedit /set useplatformtick yes
bcdedit /set disabledynamictick yes
Write-Host "[OK] HPET desativado - reinicialização necessária" -ForegroundColor Yellow`,
    revertCommand: `bcdedit /deletevalue useplatformtick
bcdedit /deletevalue disabledynamictick
Write-Host "[OK] HPET restaurado ao padrão" -ForegroundColor Green`,
    estimatedGain: 'Redução de 2-10ms na latência do sistema',
  },
  {
    id: 'input-nagle',
    name: 'Desativar Algoritmo de Nagle',
    description: 'Desativa Nagle algorithm para reduzir latência de rede',
    category: 'input_lag',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Nagle Algorithm
$adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
foreach ($adapter in $adapters) {
    Set-ItemProperty -Path $adapter.PSPath -Name "TcpAckFrequency" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $adapter.PSPath -Name "TCPNoDelay" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $adapter.PSPath -Name "TcpDelAckTicks" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
}
Write-Host "[OK] Nagle Algorithm desativado em todas as interfaces" -ForegroundColor Green`,
    revertCommand: `$adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
foreach ($adapter in $adapters) {
    Remove-ItemProperty -Path $adapter.PSPath -Name "TcpAckFrequency" -ErrorAction SilentlyContinue
    Remove-ItemProperty -Path $adapter.PSPath -Name "TCPNoDelay" -ErrorAction SilentlyContinue
}`,
    estimatedGain: 'Redução de 10-50ms na latência de rede',
  },
  {
    id: 'input-mouse',
    name: 'Otimizar Precisão do Mouse',
    description: 'Desativa aceleração do mouse e otimiza polling para 1:1',
    category: 'input_lag',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Otimizar Mouse - Desativar aceleração
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseSpeed" -Value "0" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold1" -Value "0" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold2" -Value "0" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "SmoothMouseXCurve" -Value ([byte[]](0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xCC,0x0C,0x00,0x00,0x00,0x00,0x00,0x80,0x99,0x19,0x00,0x00,0x00,0x00,0x00,0x40,0x66,0x26,0x00,0x00,0x00,0x00,0x00,0x00,0x33,0x33,0x00,0x00,0x00,0x00,0x00)) -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "SmoothMouseYCurve" -Value ([byte[]](0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x38,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x70,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xA8,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0x00,0x00,0x00,0x00,0x00)) -Force
Write-Host "[OK] Aceleração do mouse desativada - movimento 1:1" -ForegroundColor Green`,
    revertCommand: `Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseSpeed" -Value "1" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold1" -Value "6" -Force
Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold2" -Value "10" -Force`,
    estimatedGain: 'Precisão 1:1 do mouse, zero aceleração',
  },
  {
    id: 'input-fullscreen-opt',
    name: 'Desativar Fullscreen Optimizations',
    description: 'Desativa otimizações de tela cheia que causam input lag',
    category: 'input_lag',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Fullscreen Optimizations globalmente
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -Value 2 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_HonorUserFSEBehaviorMode" -Value 1 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_FSEBehavior" -Value 2 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_DXGIHonorFSEWindowsCompatible" -Value 1 -Type DWord -Force
Write-Host "[OK] Fullscreen Optimizations desativadas globalmente" -ForegroundColor Green`,
    revertCommand: `Remove-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_HonorUserFSEBehaviorMode" -ErrorAction SilentlyContinue`,
    estimatedGain: 'Elimina stuttering em tela cheia',
  },
  {
    id: 'input-priority',
    name: 'Prioridade de Sistema para Multimídia',
    description: 'Configura prioridade de thread do sistema para performance multimídia',
    category: 'input_lag',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Configurar Multimedia System Priority
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "SystemResponsiveness" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 0xffffffff -Type DWord -Force
Write-Host "[OK] Prioridade multimídia configurada para máximo" -ForegroundColor Green`,
    revertCommand: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "SystemResponsiveness" -Value 20 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 10 -Type DWord -Force`,
    estimatedGain: 'Prioridade máxima para aplicações multimídia',
  },
];

export const serviceTasks: OptimizationTask[] = [
  {
    id: 'svc-telemetry',
    name: 'Desativar Telemetria do Windows',
    description: 'Desativa serviços de coleta de dados e telemetria da Microsoft',
    category: 'services',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Telemetria
$telemetryServices = @("DiagTrack", "dmwappushservice", "diagnosticshub.standardcollector.service")
foreach ($svc in $telemetryServices) {
    Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
    Set-Service -Name $svc -StartupType Disabled -ErrorAction SilentlyContinue
}
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0 -Type DWord -Force
Write-Host "[OK] Telemetria desativada" -ForegroundColor Green`,
    revertCommand: `$telemetryServices = @("DiagTrack", "dmwappushservice")
foreach ($svc in $telemetryServices) {
    Set-Service -Name $svc -StartupType Automatic -ErrorAction SilentlyContinue
    Start-Service -Name $svc -ErrorAction SilentlyContinue
}`,
    estimatedGain: '2-5% menos uso de CPU e disco',
  },
  {
    id: 'svc-search',
    name: 'Desativar Windows Search Indexing',
    description: 'Para o indexador de pesquisa que consome CPU e disco em background',
    category: 'services',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Windows Search
Stop-Service -Name "WSearch" -Force -ErrorAction SilentlyContinue
Set-Service -Name "WSearch" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "[OK] Windows Search Indexing desativado" -ForegroundColor Green`,
    revertCommand: `Set-Service -Name "WSearch" -StartupType Automatic
Start-Service -Name "WSearch"`,
    estimatedGain: '5-15% menos uso de disco e CPU',
  },
  {
    id: 'svc-superfetch',
    name: 'Desativar SysMain (Superfetch)',
    description: 'Desativa pré-carregamento de aplicações na memória (recomendado para SSD)',
    category: 'services',
    risk: 'medium',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar SysMain (Superfetch)
Stop-Service -Name "SysMain" -Force -ErrorAction SilentlyContinue
Set-Service -Name "SysMain" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "[OK] SysMain/Superfetch desativado" -ForegroundColor Green`,
    revertCommand: `Set-Service -Name "SysMain" -StartupType Automatic
Start-Service -Name "SysMain"`,
    estimatedGain: '5-10% menos uso de memória e disco',
  },
  {
    id: 'svc-cortana',
    name: 'Desativar Cortana',
    description: 'Desativa a Cortana e processos associados em background',
    category: 'services',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Cortana
New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force -ErrorAction SilentlyContinue | Out-Null
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 0 -Type DWord -Force
Write-Host "[OK] Cortana desativada" -ForegroundColor Green`,
    revertCommand: `Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 1 -Type DWord -Force`,
    estimatedGain: '1-3% menos uso de CPU e memória',
  },
  {
    id: 'svc-xbox',
    name: 'Desativar Serviços Xbox',
    description: 'Desativa Game Bar, DVR e serviços Xbox em background',
    category: 'services',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar Serviços Xbox
$xboxServices = @("XblAuthManager", "XblGameSave", "XboxNetApiSvc", "XboxGipSvc")
foreach ($svc in $xboxServices) {
    Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
    Set-Service -Name $svc -StartupType Disabled -ErrorAction SilentlyContinue
}
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "UseNexusForGameBarEnabled" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" -Name "AllowGameDVR" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Serviços Xbox desativados" -ForegroundColor Green`,
    revertCommand: `$xboxServices = @("XblAuthManager", "XblGameSave", "XboxNetApiSvc", "XboxGipSvc")
foreach ($svc in $xboxServices) {
    Set-Service -Name $svc -StartupType Manual -ErrorAction SilentlyContinue
}`,
    estimatedGain: '2-5% menos uso de CPU e memória',
  },
  {
    id: 'svc-onedrive',
    name: 'Desativar OneDrive em Background',
    description: 'Impede OneDrive de sincronizar em background automaticamente',
    category: 'services',
    risk: 'low',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Desativar OneDrive auto-start
Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "OneDrive" -Force -ErrorAction SilentlyContinue
New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" -Force -ErrorAction SilentlyContinue | Out-Null
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" -Name "DisableFileSyncNGSC" -Value 1 -Type DWord -Force
Write-Host "[OK] OneDrive em background desativado" -ForegroundColor Green`,
    revertCommand: `Remove-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" -Name "DisableFileSyncNGSC" -ErrorAction SilentlyContinue`,
    estimatedGain: '1-3% menos uso de rede e disco',
  },
  {
    id: 'svc-remove-bloatware',
    name: 'Remover Apps Bloatware (agressivo)',
    description: 'Remove aplicativos pré-instalados do Windows que não afetam uso normal',
    category: 'services',
    risk: 'high',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Remover Bloatware Windows 10
$apps = @(
    "Microsoft.BingNews",
    "Microsoft.XboxGameOverlay",
    "Microsoft.XboxGamingOverlay",
    "Microsoft.XboxIdentityProvider",
    "Microsoft.MicrosoftOfficeHub",
    "Microsoft.GetHelp",
    "Microsoft.Microsoft3DViewer",
    "Microsoft.YourPhone",
    "Microsoft.Get-started",
    "Microsoft.WindowsCamera",
    "Microsoft.ZuneMusic",
    "Microsoft.ZuneVideo"
)
foreach ($app in $apps) {
    Get-AppxPackage -Name $app -AllUsers | Remove-AppxPackage -ErrorAction SilentlyContinue
    Get-AppxProvisionedPackage -Online | Where-Object DisplayName -like "*$app*" | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
}
Write-Host "[OK] Bloatware removido (apps comuns)." -ForegroundColor Green`,
    estimatedGain: 'Libera recursos e limpa o Windows para desempenho agressivo',
  },
  {
    id: 'svc-aggressive-performance-registry',
    name: 'Configurações Performance Agressiva',
    description: 'Aplica ajustes de registro avançados para modo desempenho máximo',
    category: 'services',
    risk: 'critical',
    status: 'pending',
    permanent: true,
    reversible: true,
    powershellCommand: `# Ajustes de registro agressivos
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "DisableSleep" -Value 1 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" -Name "Win32PrioritySeparation" -Value 26 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "ClearPageFileAtShutdown" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value 0 -Type String -Force
Write-Host "[OK] Ajustes de performance agressiva aplicados" -ForegroundColor Yellow`,
    revertCommand: `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl" -Name "Win32PrioritySeparation" -Value 2 -Type DWord -Force
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value 400 -Type String -Force
Write-Host "[OK] Ajustes revertidos para padrão" -ForegroundColor Green`,
    estimatedGain: 'Maior responsividade e latência reduzida (modo agressivo)',
  },
  {
    id: 'svc-update-nvidia-driver',
    name: 'Atualizar Driver Nvidia (winget)',
    description: 'Baixa e instala automaticamente a versão mais recente do driver Nvidia via winget',
    category: 'services',
    risk: 'high',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Atualizar driver NVIDIA usando winget
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] winget não está disponível. Instale o App Installer e execute novamente." -ForegroundColor Red
    exit 1
}
try {
    winget install --id NVIDIA.GeForceExperience -e --source winget --accept-source-agreements --accept-package-agreements -h
    Write-Host "[OK] GeForce Experience instalado/atualizado" -ForegroundColor Green
    winget upgrade --id NVIDIA.NVIDIA-Display-Driver -e --source winget --accept-source-agreements --accept-package-agreements -h
    Write-Host "[OK] Driver Nvidia atualizado" -ForegroundColor Green
} catch {
    Write-Host "[AVISO] Falha ao atualizar Nvidia via winget: $_" -ForegroundColor Yellow
}
Write-Host "[INFO] Para atualização completa, reinicie e execute GeForce Experience." -ForegroundColor Cyan`,
    estimatedGain: 'Atualiza driver GPU Nvidia para máxima estabilidade e performance',
  },
  {
    id: 'svc-update-amd-driver',
    name: 'Atualizar Driver AMD (winget)',
    description: 'Baixa e instala automaticamente a última versão do driver AMD Radeon via winget',
    category: 'services',
    risk: 'high',
    status: 'pending',
    permanent: true,
    reversible: false,
    powershellCommand: `# Atualizar driver AMD usando winget
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] winget não está disponível. Instale o App Installer e execute novamente." -ForegroundColor Red
    exit 1
}
try {
    winget install --id AMD.AMDSoftware -e --source winget --accept-source-agreements --accept-package-agreements -h
    Write-Host "[OK] AMD Software: Adrenalin Edition instalado/atualizado" -ForegroundColor Green
    winget upgrade --id AMD.AMDSoftware -e --source winget --accept-source-agreements --accept-package-agreements -h
    Write-Host "[OK] Driver AMD atualizado" -ForegroundColor Green
} catch {
    Write-Host "[AVISO] Falha ao atualizar AMD via winget: $_" -ForegroundColor Yellow
}
Write-Host "[INFO] Reinicie o PC após a atualização do driver." -ForegroundColor Cyan`,
    estimatedGain: 'Atualiza driver GPU AMD para máxima performance e compatibilidade',
  },
];

export const allTasks = [...cleanupTasks, ...powerTasks, ...inputLagTasks, ...serviceTasks];
