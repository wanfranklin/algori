# Algori - Instalador PowerShell para Windows
# Uso: irm https://raw.githubusercontent.com/wanfranklin/algori/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

$ALGORI_VERSION = if ($env:ALGORI_VERSION) { $env:ALGORI_VERSION } else { "" }
$ALGORI_REPO = "wanfranklin/algori"
$GITHUB_API = "https://api.github.com/repos/$ALGORI_REPO/releases/latest"

function Write-Info { param([string]$Message) Write-Host "[info]  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[error] $Message" -ForegroundColor Red; exit 1 }

function Get-LatestVersion {
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $response = Invoke-RestMethod -Uri $GITHUB_API -UseBasicParsing
        return $response.tag_name -replace '^v', ''
    } catch {
        return $null
    }
}

function Get-Architecture {
    $arch = $env:PROCESSOR_ARCHITECTURE
    switch ($arch) {
        "AMD64" { return "x64" }
        "ARM64" { return "arm64" }
        default { Write-Error "Arquitetura nao suportada: $arch" }
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

function Add-ToPath {
    param([string]$Directory)

    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$Directory*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$Directory", "User")
        $env:Path = "$env:Path;$Directory"
        Write-Info "Adicionado ao PATH: $Directory"
    } else {
        Write-Info "Diretorio ja esta no PATH"
    }
}

function Install-Algori {
    # Buscar versão mais recente se não especificada
    if (-not $ALGORI_VERSION) {
        Write-Info "Verificando versão mais recente..."
        $ALGORI_VERSION = Get-LatestVersion
        if (-not $ALGORI_VERSION) {
            Write-Error "Não foi possível buscar a versão mais recente. Defina a variável ALGORI_VERSION manualmente."
        }
        Write-Info "Versão mais recente: v$ALGORI_VERSION"
    }

    $GITHUB_URL = "https://github.com/$ALGORI_REPO/releases/download/v$ALGORI_VERSION"

    Write-Info "Instalando Algori v$ALGORI_VERSION..."
    Write-Host ""

    $arch = Get-Architecture
    $filename = "algori-windows-$arch.exe"
    $url = "$GITHUB_URL/$filename"

    Write-Info "Plataforma detectada: windows-$arch"

    $installDir = Get-InstallDirectory
    $outputFile = Join-Path $installDir "algori.exe"

    Write-Info "Baixando $url..."
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $url -OutFile $outputFile -UseBasicParsing
    } catch {
        Write-Error "Falha no download. Verifique sua conexao com a internet."
    }

    Write-Info "Instalado em: $outputFile"

    Add-ToPath -Directory $installDir

    Write-Host ""
    Write-Info "Instalacao concluida!"
    Write-Info "Execute: algori --help"
    Write-Host ""
    Write-Warn "IMPORTANTE: Feche e abra um novo terminal para usar o algori."
}

Install-Algori
