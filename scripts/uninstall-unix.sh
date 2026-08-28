#!/bin/sh
# Algori - Desinstalacao Limpa para macOS/Linux
# Uso: ./scripts/uninstall-unix.sh

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

echo ""
echo "========================================"
echo " Desinstalacao do Algori"
echo "========================================"
echo ""

# 1. Verificar se o Algori esta instalado
check "Verificando se Algori esta instalado..."
if command -v algori >/dev/null 2>&1; then
    installed_version=$(algori --version 2>/dev/null || echo "desconhecida")
    algori_path=$(which algori)
    info "Algori encontrado: $installed_version"
    echo "  Localizacao: $algori_path"
else
    warn "Algori nao encontrado no PATH"
fi

# 2. Perguntar se o usuario tem certeza
echo ""
printf "Tem certeza que deseja desinstalar o Algori? (s/N): "
read confirm

if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    info "Desinstalacao cancelada."
    exit 0
fi

echo ""

# 3. Remover executavel
check "Removendo executavel..."
if [ -f /usr/local/bin/algori ]; then
    sudo rm -f /usr/local/bin/algori
    info "Executavel removido: /usr/local/bin/algori"
elif [ -f "$HOME/.local/bin/algori" ]; then
    rm -f "$HOME/.local/bin/algori"
    info "Executavel removido: $HOME/.local/bin/algori"
else
    warn "Executavel nao encontrado"
fi

# 4. Remover do PATH (se foi adicionado manualmente)
check "Verificando PATH..."
if grep -q "algori" "$HOME/.bashrc" 2>/dev/null; then
    sed -i '/algori/d' "$HOME/.bashrc"
    info "Removido do .bashrc"
fi

if grep -q "algori" "$HOME/.zshrc" 2>/dev/null; then
    sed -i '/algori/d' "$HOME/.zshrc"
    info "Removido do .zshrc"
fi

if grep -q "algori" "$HOME/.profile" 2>/dev/null; then
    sed -i '/algori/d' "$HOME/.profile"
    info "Removido do .profile"
fi

# 5. Remover configuracoes locais (se existirem)
check "Removendo configuracoes locais..."
if [ -d "$HOME/.algori" ]; then
    rm -rf "$HOME/.algori"
    info "Configuracoes removidas: $HOME/.algori"
else
    info "Nenhuma configuracao local encontrada"
fi

# 6. Verificar limpeza completa
check "Verificando limpeza completa..."
remaining_files=()

if [ -f /usr/local/bin/algori ]; then
    remaining_files+=("/usr/local/bin/algori")
fi

if [ -f "$HOME/.local/bin/algori" ]; then
    remaining_files+=("$HOME/.local/bin/algori")
fi

if [ ${#remaining_files[@]} -eq 0 ]; then
    info "Limpeza completa realizada!"
else
    warn "Alguns arquivos nao foram removidos:"
    for file in "${remaining_files[@]}"; do
        echo "  - $file"
    done
fi

# Resultado final
echo ""
echo "========================================"
echo " Algori foi desinstalado com sucesso!"
echo "========================================"
echo ""
info "Obrigado por usar o Algori!"
info "Visite: https://github.com/wanfranklin/algori"
echo ""
