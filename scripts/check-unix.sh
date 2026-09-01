#!/bin/sh
# Algori - Verificação de Pré-requisitos para macOS/Linux
# Uso: ./scripts/check-unix.sh

set -eu

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { printf "${GREEN}[info]${NC}  %s\n" "$1"; }
warn()  { printf "${YELLOW}[warn]${NC}  %s\n" "$1"; }
error() { printf "${RED}[error]${NC} %s\n" "$1"; }
check() { printf "${CYAN}[check]${NC} %s\n" "$1"; }

all_passed=true

echo ""
echo "========================================"
echo " Verificação de Pré-requisitos - Algori"
echo "========================================"
echo ""

# 1. Verificar sistema operacional
check "Verificando sistema operacional..."
os=$(uname -s)
case "$os" in
    Linux*)   os_name="Linux" ;;
    Darwin*)  os_name="macOS" ;;
    *)        error "Sistema operacional não suportado: $os"; all_passed=false ;;
esac
info "Sistema operacional: $os_name"

# 2. Verificar arquitetura
check "Verificando arquitetura do processador..."
arch=$(uname -m)
case "$arch" in
    x86_64|amd64)   arch_name="x64" ;;
    aarch64|arm64)   arch_name="arm64" ;;
    *)               error "Arquitetura não suportada: $arch"; all_passed=false ;;
esac
info "Arquitetura compatível: $arch_name"

# 3. Verificar espaço em disco
check "Verificando espaço em disco..."
if command -v df >/dev/null 2>&1; then
    free_space=$(df -h / | awk 'NR==2 {print $4}')
    info "Espaço disponível: $free_space"
else
    warn "Não foi possível verificar espaço em disco"
fi

# 4. Verificar conexão com a internet
check "Verificando conexão com a internet..."
if command -v curl >/dev/null 2>&1; then
    if curl -fsSL --connect-timeout 5 https://github.com >/dev/null 2>&1; then
        info "Conexão com a internet: OK"
    else
        warn "Sem conexão com a internet"
        echo "  O download do Algori pode falhar."
    fi
elif command -v wget >/dev/null 2>&1; then
    if wget -q --spider --timeout=5 https://github.com 2>/dev/null; then
        info "Conexão com a internet: OK"
    else
        warn "Sem conexão com a internet"
        echo "  O download do Algori pode falhar."
    fi
else
    warn "curl ou wget não encontrado"
    echo "  Não foi possível verificar conexão com a internet."
fi

# 5. Verificar permissões
check "Verificando permissões..."
if [ "$(id -u)" -eq 0 ]; then
    info "Executando como root"
else
    info "Executando como usuário normal"
    echo "  Verifique se você tem permissão para escrever no diretório de instalação."
fi

# 6. Verificar se o Algori já está instalado
check "Verificando se Algori já está instalado..."
if command -v algori >/dev/null 2>&1; then
    installed_version=$(algori --version 2>/dev/null || echo "desconhecida")
    algori_path=$(which algori)
    warn "Algori já está instalado: $installed_version"
    echo "  Localização: $algori_path"
else
    info "Algori não encontrado (instalação necessária)"
fi

# 7. Verificar dependências do sistema (Linux)
if [ "$os_name" = "Linux" ]; then
    check "Verificando dependências do sistema..."
    if command -v ldd >/dev/null 2>&1; then
        if ldd --version 2>&1 | grep -q "glibc"; then
            info "glibc detectado"
        else
            warn "glibc não detectado"
            echo "  Algori requer glibc para funcionar."
        fi
    fi
fi

# Resultado final
echo ""
echo "========================================"
if [ "$all_passed" = true ]; then
    echo " Todos os pré-requisitos atendidos!"
    echo " Você pode instalar o Algori normalmente."
else
    echo " Alguns pré-requisitos não foram atendidos."
    echo " Verifique as mensagens acima antes de instalar."
fi
echo "========================================"
echo ""
