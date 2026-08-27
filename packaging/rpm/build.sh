#!/bin/sh
set -e

# Build do pacote RPM do Algori
# Uso: ./packaging/rpm/build.sh [versão]

VERSION="${1:-1.0.0}"
DIST_DIR="dist"
BUILD_DIR="packaging/rpm/build"

echo "📦 Build do pacote RPM v${VERSION}"

# Verificar se rpmbuild está disponível
if ! command -v rpmbuild >/dev/null 2>&1; then
  echo "❌ rpmbuild não encontrado."
  echo "   Instale: sudo dnf install rpm-build"
  exit 1
fi

# Limpar build anterior
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}

# Copiar executável
if [ ! -f "$DIST_DIR/algori-linux-x64" ]; then
  echo "❌ Executável não encontrado: $DIST_DIR/algori-linux-x64"
  echo "   Execute primeiro: ./scripts/build.sh"
  exit 1
fi

cp "$DIST_DIR/algori-linux-x64" "$BUILD_DIR/BUILD/algori"
chmod 755 "$BUILD_DIR/BUILD/algori"

# Criar spec
cat > "$BUILD_DIR/SPECS/algori.spec" << EOF
Name:           algori
Version:        ${VERSION}
Release:        1%{?dist}
Summary:        Linguagem de programação em português
License:        GPLv3+
URL:            https://github.com/wanfranklin/algori
Source0:        %{name}-%{version}.tar.gz
BuildArch:      x86_64

%description
Algori é uma linguagem de pseudocódigo educacional com palavras
reservadas em português para aprendizado de algoritmos e lógica
de programação.

%prep
# Nada a preparar

%build
# Nada a construir

%install
mkdir -p %{buildroot}/usr/bin
install -m 755 %{_builddir}/algori %{buildroot}/usr/bin/%{name}

%files
/usr/bin/%{name}

%changelog
* Mon Aug 25 2026 Wanfranklin <wanfranklin@users.noreply.github.com> - ${VERSION}-1
- Initial release
EOF

# Build
rpmbuild --define "_topdir $(pwd)/$BUILD_DIR" -bb "$BUILD_DIR/SPECS/algori.spec"

# Copiar resultado
cp "$BUILD_DIR"/RPMS/x86_64/algori-*.rpm "$DIST_DIR/"

echo "✅ Pacote criado: ${DIST_DIR}/algori-${VERSION}-1.*.rpm"
echo ""
echo "📦 Instalar:"
echo "   sudo rpm -i ${DIST_DIR}/algori-${VERSION}-1.*.rpm"
