#!/bin/sh
# Algori - Verificacao de Pre-requisitos para macOS/Linux
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
echo " Verificacao de Pre-requisitos - Algori"
echo "========================================"
echo ""

# 1. Verificar sistema operacional
check "Verificando sistema operacional..."
os=$(uname -s)
case "$os" in
    Linux*)   os_name="Linux" ;;
    Darwin*)  os_name="macOS" ;;
    *)        error "Sistema operacional nao suportado: $os"; all_passed=false ;;
esac
info "Sistema operacional: $os_name"

# 2. Verificar arquitetura
check "Verificando arquitetura do processador..."
arch=$(uname -m)
case "$arch" in
    x86_64|amd64)   arch_name="x64" ;;
    aarch64|arm64)   arch_name="arm64" ;;
    *)               error "Arquitetura nao suportada: $arch"; all_passed=false ;;
esac
info "Arquitetura compativel: $arch_name"

# 3. Verificar espaco em disco
check "Verificando espaco em disco..."
if command -v df >/dev/null 2>&1; then
    free_space=$(df -h / | awk 'NR==2 {print $4}')
    info "Espaco disponivel: $free_space"
else
    warn "Nao foi possivel verificar espaco em disco"
fi

# 4. Verificar conexao com a internet
check "Verificando conexao com a internet..."
if command -v curl >/dev/null 2>&1; then
    if curl -fsSL --connect-timeout 5 https://github.com >/dev/null 2>&1; then
        info "Conexao com a internet: OK"
    else
        warn "Sem conexao com a internet"
        echo "  O download do Algori pode falhar."
    fi
elif command -v wget >/dev/null 2>&1; then
    if wget -q --spider --timeout=5 https://github.com 2>/dev/null; then
        info "Conexao com a internet: OK"
    else
        warn "Sem conexao com a internet"
        echo "  O download do Algori pode falhar."
    fi
else
    warn "curl ou wget nao encontrado"
    echo "  Nao foi possivel verificar conexao com a internet."
fi

# 5. Verificar permissoes
check "Verificando permissoes..."
if [ "$(id -u)" -eq 0 ]; then
    info "Executando como root"
else
    info "Executando como usuario normal"
    echo "  Verifique se voce tem permissao para escrever no diretorio de instalacao."
fi

# 6. Verificar se o Algori ja esta instalado
check "Verificando se Algori ja esta instalado..."
if command -v algori >/dev/null 2>&1; then
    installed_version=$(algori --version 2>/dev/null || echo "desconhecida")
    algori_path=$(which algori)
    warn "Algori ja esta instalado: $installed_version"
    echo "  Localizacao: $algori_path"
else
    info "Algori nao encontrado (instalacao necessaria)"
fi

# 7. Verificar dependencias do sistema (Linux)
if [ "$os_name" = "Linux" ]; then
    check "Verificando dependencias do sistema..."
    if command -v ldd >/dev/null 2>&1; then
        if ldd --version 2>&1 | grep -q "glibc"; then
            info "glibc detectado"
        else
            warn "glibc nao detectado"
            echo "  Algori requer glibc para funcionar."
        fi
    fi
fi

# Resultado final
echo ""
echo "========================================"
if [ "$all_passed" = true ]; then
    echo " Todos os pre-requisitos atendidos!"
    echo " Voce pode instalar o Algori normalmente."
else
    echo " Alguns pre-requisitos nao foram atendidos."
    echo " Verifique as mensagens acima antes de instalar."
fi
echo "========================================"
echo ""
