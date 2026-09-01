# Algori - Atualizador para Windows
# Uso: irm https://raw.githubusercontent.com/wanfranklin/algori/main/scripts/update.ps1 | iex

$ErrorActionPreference = "Stop"

$ALGORI_REPO = "wanfranklin/algori"
$GITHUB_API = "https://api.github.com/repos/$ALGORI_REPO/releases/latest"

function Write-Info { param([string]$Message) Write-Host "[info]  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[error] $Message" -ForegroundColor Red; exit 1 }
function Write-Step { param([string]$Message) Write-Host "[passo] $Message" -ForegroundColor Cyan }

function Get-LatestVersion {
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $response = Invoke-RestMethod -Uri $GITHUB_API -UseBasicParsing
        return $response.tag_name -replace '^v', ''
    } catch {
        return $null
    }
}

function Get-InstalledVersion {
    try {
        $output = & algori --version 2>&1
        if ($output -match '(\d+\.\d+\.\d+)') {
            return $Matches[1]
        }
    } catch {}
    return $null
}

function Get-Architecture {
    $arch = $env:PROCESSOR_ARCHITECTURE
    switch ($arch) {
        "AMD64" { return "x64" }
        "ARM64" { return "arm64" }
        default { Write-Error "Arquitetura não suportada: $arch" }
    }
}

function Get-InstallDirectory {
    $localAppData = $env:LOCALAPPDATA
    $installDir = Join-Path $localAppData "Algori"
    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    }
    return $installDir
}

function Update-Algori {
    echo ""
    Write-Info "Algori - Atualizador"
    echo ""

    # Verificar versão instalada
    $installedVersion = Get-InstalledVersion
    if (-not $installedVersion) {
        Write-Warn "Algori não encontrado. Execute o instalador primeiro:"
        Write-Warn "  irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex"
        exit 1
    }

    Write-Step "Versão instalada: v$installedVersion"

    # Buscar versão mais recente
    Write-Info "Verificando atualizações..."
    $latestVersion = Get-LatestVersion
    if (-not $latestVersion) {
        Write-Error "Não foi possível verificar a versão mais recente."
    }

    Write-Step "Versão mais recente: v$latestVersion"

    # Comparar versões
    if ($installedVersion -eq $latestVersion) {
        echo ""
        Write-Info "Você já está na versão mais recente!"
        exit 0
    }

    $installed = [version]$installedVersion
    $latest = [version]$latestVersion
    if ($latest -le $installed) {
        echo ""
        Write-Info "Você já está na versão mais recente!"
        exit 0
    }

    # Pedir confirmação
    echo ""
    Write-Warn "Nova versão disponível: v$installedVersion → v$latestVersion"
    $confirm = Read-Host "Deseja atualizar? (s/N)"

    switch ($confirm.ToLower()) {
        { $_ -in 's', 'sim' } {
            echo ""
            $arch = Get-Architecture
            $filename = "algori-windows-$arch.exe"
            $url = "https://github.com/$ALGORI_REPO/releases/download/v$latestVersion/$filename"
            $installDir = Get-InstallDirectory
            $outputFile = Join-Path $installDir "algori.exe"

            Write-Step "Baixando v$latestVersion..."
            try {
                [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                Invoke-WebRequest -Uri $url -OutFile $outputFile -UseBasicParsing
            } catch {
                Write-Error "Falha no download. Verifique sua conexão."
            }

            Write-Step "Instalado em: $outputFile"
            echo ""
            Write-Info "Atualizado com sucesso! v$installedVersion → v$latestVersion"
            Write-Info "Execute: algori --version"
        }
        default {
            echo ""
            Write-Info "Atualização cancelada."
        }
    }
}

Update-Algori
