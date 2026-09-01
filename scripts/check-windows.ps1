# Algori - Verificação de Pré-requisitos para Windows
# Uso: .\scripts\check-windows.ps1

$ErrorActionPreference = "Stop"

function Write-Info { param([string]$Message) Write-Host "[info]  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[error] $Message" -ForegroundColor Red }
function Write-Check { param([string]$Message) Write-Host "[check] $Message" -ForegroundColor Cyan }

$allPassed = $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Verificação de Pré-requisitos - Algori" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar arquitetura do processador
Write-Check "Verificando arquitetura do processador..."
$arch = $env:PROCESSOR_ARCHITECTURE
if ($arch -eq "AMD64" -or $arch -eq "ARM64") {
    Write-Info "Arquitetura compatível: $arch"
} else {
    Write-Error "Arquitetura não suportada: $arch"
    Write-Host "  Algori requer um processador x64 ou ARM64." -ForegroundColor Gray
    $allPassed = $false
}

# 2. Verificar versão do Windows
Write-Check "Verificando versão do Windows..."
$osVersion = [System.Environment]::OSVersion.Version
$osBuild = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").CurrentBuild

if ([int]$osBuild -ge 19041) {
    Write-Info "Windows 10/11 compatível (Build $osBuild)"
} else {
    Write-Warn "Windows pode não ser totalmente compatível (Build $osBuild)"
    Write-Host "  Recomendado: Windows 10 build 19041 ou superior" -ForegroundColor Gray
}

# 3. Verificar espaço em disco
Write-Check "Verificando espaço em disco..."
$drive = Get-PSDrive -Name ($env:SystemDrive.Substring(0,1))
$freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)

if ($freeSpaceGB -ge 0.1) {
    Write-Info "Espaço disponível: ${freeSpaceGB} GB"
} else {
    Write-Error "Espaço insuficiente: ${freeSpaceGB} GB"
    Write-Host "  Algori requer pelo menos 100 MB de espaço livre." -ForegroundColor Gray
    $allPassed = $false
}

# 4. Verificar conexão com a internet
Write-Check "Verificando conexão com a internet..."
try {
    $request = [System.Net.WebRequest]::Create("https://github.com")
    $request.Timeout = 5000
    $response = $request.GetResponse()
    $response.Close()
    Write-Info "Conexão com a internet: OK"
} catch {
    Write-Warn "Sem conexão com a internet"
    Write-Host "  O download do Algori pode falhar." -ForegroundColor Gray
}

# 5. Verificar permissões de administrador
Write-Check "Verificando permissões..."
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Info "Executando como administrador"
} else {
    Write-Info "Executando como usuário normal"
    Write-Host "  Instalação em modo usuário (sem privilégios de administrador)." -ForegroundColor Gray
}

# 6. Verificar se o Algori já está instalado
Write-Check "Verificando se Algori já está instalado..."
$algoriPath = Get-Command -Name "algori" -ErrorAction SilentlyContinue

if ($algoriPath) {
    $installedVersion = & algori --version 2>$null
    Write-Warn "Algori já está instalado: $installedVersion"
    Write-Host "  Localização: $($algoriPath.Source)" -ForegroundColor Gray
} else {
    Write-Info "Algori não encontrado (instalação necessária)"
}

# Resultado final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host " Todos os pré-requisitos atendidos!" -ForegroundColor Green
    Write-Host " Você pode instalar o Algori normalmente." -ForegroundColor Green
} else {
    Write-Host " Alguns pré-requisitos não foram atendidos." -ForegroundColor Yellow
    Write-Host " Verifique as mensagens acima antes de instalar." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
