# Algori - Modo Portátil (USB)
# Uso: .\algori-portable.ps1

$ErrorActionPreference = "Stop"

function Write-Info { param([string]$Message) Write-Host "[info]  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[warn]  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[error] $Message" -ForegroundColor Red }

$ALGORI_VERSION = if ($env:ALGORI_VERSION) { $env:ALGORI_VERSION } else { "1.1.0" }
$ALGORI_REPO = "wanfranklin/algori"
$GITHUB_URL = "https://github.com/$ALGORI_REPO/releases/download/v$ALGORI_VERSION"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Algori - Modo Portátil" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detectar diretório do script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$algoriDir = Join-Path $scriptDir "algori"

# Criar diretório algori se não existir
if (-not (Test-Path $algoriDir)) {
    New-Item -ItemType Directory -Path $algoriDir -Force | Out-Null
    Write-Info "Diretório criado: $algoriDir"
}

# Verificar arquitetura
$arch = $env:PROCESSOR_ARCHITECTURE
switch ($arch) {
    "AMD64" { $archName = "x64" }
    "ARM64" { $archName = "arm64" }
    default { Write-Error "Arquitetura não suportada: $arch"; exit 1 }
}

$filename = "algori-windows-$archName.exe"
$url = "$GITHUB_URL/$filename"
$outputFile = Join-Path $algoriDir "algori.exe"

# Verificar se já existe
if (Test-Path $outputFile) {
    Write-Warn "Algori já existe em: $outputFile"
    $update = Read-Host "Deseja atualizar? (s/N)"
    if ($update -ne "s" -and $update -ne "S") {
        Write-Info "Mantendo versão atual."
    } else {
        Write-Info "Baixando versão mais recente..."
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $url -OutFile $outputFile -UseBasicParsing
        Write-Info "Algori atualizado!"
    }
} else {
    Write-Info "Baixando Algori v$ALGORI_VERSION..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $outputFile -UseBasicParsing
    Write-Info "Algori baixado!"
}

# Criar estrutura de pastas
$pastas = @(
    (Join-Path $algoriDir "exemplos"),
    (Join-Path $algoriDir "projetos")
)

foreach ($pasta in $pastas) {
    if (-not (Test-Path $pasta)) {
        New-Item -ItemType Directory -Path $pasta -Force | Out-Null
    }
}

# Criar arquivo README no USB
$readmeContent = @"
# Algori - Modo Portátil

Este é o Algori em modo portátil. Você pode executar de qualquer computador Windows.

## Como Usar

1. Conecte este USB no computador
2. Abra o PowerShell ou Prompt de Comando
3. Navegue até esta pasta
4. Execute: .\algori\algori.exe arquivo.algori

## Estrutura

```
USB/
├── algori/
│   ├── algori.exe        # Executável do Algori
│   ├── exemplos/         # Exercícios prontos
│   └── projetos/         # Seus projetos
├── algori-portable.ps1   # Este script
└── README.txt            # Este arquivo
```

## Exemplo

```powershell
# No PowerShell
cd E:\algori
.\algori\algori.exe .\algori\exemplos\ola.algori
```

## Nota

Este modo não instala o Algori no computador. É ideal para:
- Usar em computadores de laboratório
- Levar seus projetos para qualquer lugar
- Testar em máquinas diferentes

## Versão

Algori v$ALGORI_VERSION
"@

$readmePath = Join-Path $scriptDir "README.txt"
$readmeContent | Out-File -FilePath $readmePath -Encoding UTF8

# Criar arquivo de exemplo
$exemploContent = @"
algori "OlaMundo"

mostrar("Olá, Mundo!")
mostrar("Este é um exemplo do Algori em modo portátil!")
mostrar("Você pode criar seus próprios programas aqui.")

mostrar("Qual é o seu nome?")
texto nome = capturar()
mostrar("Olá, " + nome + "!")
"@

$exemploPath = Join-Path (Join-Path $algoriDir "exemplos") "ola.algori"
$exemploContent | Out-File -FilePath $exemploPath -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Modo Portátil Configurado!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "Estrutura criada:"
Write-Info "  $algoriDir\algori.exe"
Write-Info "  $algoriDir\exemplos\"
Write-Info "  $algoriDir\projetos\"
Write-Host ""
Write-Info "Para usar:"
Write-Info "  1. Conecte este USB no computador"
Write-Info "  2. Abra o PowerShell"
Write-Info "  3. Execute: .\algori\algori.exe arquivo.algori"
Write-Host ""
Write-Info "Exemplo de exercício criado em:"
Write-Info "  $algoriDir\exemplos\ola.algori"
Write-Host ""
