#!/bin/sh
set -eu

# Algori - Atualizador para macOS/Linux
# Uso: curl -fsSL https://raw.githubusercontent.com/AlgoriLabs/algori/main/scripts/update.sh | sh

ALGORI_REPO="AlgoriLabs/algori"
GITHUB_API="https://api.github.com/repos/${ALGORI_REPO}/releases/latest"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { printf "${GREEN}[info]${NC}  %s\n" "$1"; }
warn()  { printf "${YELLOW}[warn]${NC}  %s\n" "$1"; }
error() { printf "${RED}[error]${NC} %s\n" "$1"; exit 1; }
step()  { printf "${CYAN}[passo]${NC} %s\n" "$1"; }

# Buscar versão mais recente do GitHub
fetch_latest_version() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$GITHUB_API" 2>/dev/null | grep '"tag_name"' | sed -E 's/.*"tag_name": *"v?([^"]+)".*/\1/'
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$GITHUB_API" 2>/dev/null | grep '"tag_name"' | sed -E 's/.*"tag_name": *"v?([^"]+)".*/\1/'
  fi
}

# Obter versão instalada
get_installed_version() {
  if command -v algori >/dev/null 2>&1; then
    algori --version 2>/dev/null | sed -E 's/[^0-9.]//g' || echo ""
  else
    echo ""
  fi
}

# Comparar versões (retorna 1 se $1 > $2)
version_gt() {
  printf '%s\n%s' "$2" "$1" | sort -V | head -n1 | grep -q "$2"
}

# Detectar plataforma
detect_platform() {
  os=$(uname -s)
  arch=$(uname -m)

  case "$os" in
    Linux*)   os_name="linux" ;;
    Darwin*)  os_name="macos" ;;
    *)        error "Sistema operacional não suportado: $os" ;;
  esac

  case "$arch" in
    x86_64|amd64)   arch_name="x64" ;;
    aarch64|arm64)   arch_name="arm64" ;;
    *)               error "Arquitetura não suportada: $arch" ;;
  esac

  platform="${os_name}-${arch_name}"
}

# Determinar diretório de instalação
get_install_dir() {
  if [ -w /usr/local/bin ]; then
    echo "/usr/local/bin"
  elif [ -d "$HOME/.local/bin" ]; then
    echo "$HOME/.local/bin"
  else
    mkdir -p "$HOME/.local/bin"
    echo "$HOME/.local/bin"
  fi
}

# Download e instalação
download_and_install() {
  version=$1
  filename="algori-${platform}"
  url="https://github.com/${ALGORI_REPO}/releases/download/v${version}/${filename}"
  install_dir=$(get_install_dir)
  tmpdir=$(mktemp -d)
  tmpfile="${tmpdir}/${filename}"

  step "Baixando v${version}..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$tmpfile" "$url" || error "Falha no download."
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$tmpfile" "$url" || error "Falha no download."
  else
    error "curl ou wget não encontrado."
  fi

  step "Instalando em ${install_dir}/algori..."
  chmod +x "$tmpfile"
  mv "$tmpfile" "${install_dir}/algori"

  rm -rf "$tmpdir" 2>/dev/null || true
}

main() {
  echo ""
  info "Algori - Atualizador"
  echo ""

  # Verificar se está instalado
  installed_version=$(get_installed_version)
  if [ -z "$installed_version" ]; then
    warn "Algori não encontrado. Execute o instalador primeiro:"
    warn "  curl -fsSL https://raw.githubusercontent.com/AlgoriLabs/algori/main/install.sh | sh"
    exit 1
  fi

  step "Versão instalada: v${installed_version}"

  # Buscar versão mais recente
  info "Verificando atualizações..."
  latest_version=$(fetch_latest_version)
  if [ -z "$latest_version" ]; then
    error "Não foi possível verificar a versão mais recente."
  fi

  step "Versão mais recente: v${latest_version}"

  # Comparar versões
  if [ "$installed_version" = "$latest_version" ]; then
    echo ""
    info "Você já está na versão mais recente!"
    exit 0
  fi

  if ! version_gt "$latest_version" "$installed_version"; then
    echo ""
    info "Você já está na versão mais recente!"
    exit 0
  fi

  # Pedir confirmação
  echo ""
  warn "Nova versão disponível: v${installed_version} → v${latest_version}"
  printf "${YELLOW}Deseja atualizar? (s/N): ${NC}"
  read -r confirm

  case "$confirm" in
    s|S|sim|SIM|Sim)
      echo ""
      detect_platform
      download_and_install "$latest_version"
      echo ""
      info "Atualizado com sucesso! v${installed_version} → v${latest_version}"
      info "Execute: algori --version"
      ;;
    *)
      echo ""
      info "Atualização cancelada."
      ;;
  esac
}

main "$@"
