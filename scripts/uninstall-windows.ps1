# Algori - Desinstalacao Limpa para Windows
# Uso: .\scripts\uninstall-windows.ps1

$ErrorActionPreference = "Stop"

function Write-Info { param([string]$Message) Write-Host "[info]  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[error] $Message" -ForegroundColor Red }
function Write-Check { param([string]$Message) Write-Host "[check] $Message" -ForegroundColor Cyan }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Desinstalacao do Algori" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se o Algori esta instalado
Write-Check "Verificando se Algori esta instalado..."
$algoriPath = Get-Command -Name "algori" -ErrorAction SilentlyContinue

if ($algoriPath) {
    $installedVersion = & algori --version 2>$null
    Write-Info "Algori encontrado: $installedVersion"
    Write-Host "  Localizacao: $($algoriPath.Source)" -ForegroundColor Gray
} else {
    Write-Warn "Algori nao encontrado no PATH"
}

# 2. Perguntar se o usuario tem certeza
Write-Host ""
$confirm = Read-Host "Tem certeza que deseja desinstalar o Algori? (s/N)"

if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Info "Desinstalacao cancelada."
    exit 0
}

Write-Host ""

# 3. Remover executavel do diretorio de instalacao
Write-Check "Removendo executavel..."
$installDir = Join-Path $env:LOCALAPPDATA "Algori"

if (Test-Path $installDir) {
    Remove-Item -Path $installDir -Recurse -Force
    Write-Info "Diretorio removido: $installDir"
} else {
    Write-Warn "Diretorio de instalacao nao encontrado: $installDir"
}

# 4. Remover do PATH do usuario
Write-Check "Removendo do PATH do usuario..."
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -like "*Algori*") {
    $newPath = ($currentPath -split ";" | Where-Object { $_ -notlike "*Algori*" }) -join ";"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = ($env:Path -split ";" | Where-Object { $_ -notlike "*Algori*" }) -join ";"
    Write-Info "Removido do PATH do usuario"
} else {
    Write-Warn "Algori nao encontrado no PATH do usuario"
}

# 5. Remover atalho da area de trabalho
Write-Check "Removendo atalho da area de trabalho..."
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Algori.lnk"

if (Test-Path $shortcutPath) {
    Remove-Item -Path $shortcutPath -Force
    Write-Info "Atalho removido: $shortcutPath"
} else {
    Write-Warn "Atalho nao encontrado na area de trabalho"
}

# 6. Remover do Menu Iniciar
Write-Check "Removendo do Menu Iniciar..."
$startMenuPath = [Environment]::GetFolderPath("Programs")
$algoriStartMenu = Join-Path $startMenuPath "Algori"

if (Test-Path $algoriStartMenu) {
    Remove-Item -Path $algoriStartMenu -Recurse -Force
    Write-Info "Removido do Menu Iniciar: $algoriStartMenu"
} else {
    Write-Warn "Algori nao encontrado no Menu Iniciar"
}

# 7. Verificar limpeza completa
Write-Check "Verificando limpeza completa..."
$remainingFiles = @()

if (Test-Path $installDir) {
    $remainingFiles += $installDir
}

if (Test-Path $shortcutPath) {
    $remainingFiles += $shortcutPath
}

if (Test-Path $algoriStartMenu) {
    $remainingFiles += $algoriStartMenu
}

if ($remainingFiles.Count -eq 0) {
    Write-Info "Limpeza completa realizada!"
} else {
    Write-Warn "Alguns arquivos nao foram removidos:"
    foreach ($file in $remainingFiles) {
        Write-Host "  - $file" -ForegroundColor Gray
    }
}

# Resultado final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Algori foi desinstalado com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "Obrigado por usar o Algori!"
Write-Info "Visite: https://github.com/wanfranklin/algori"
Write-Host ""
