#!/bin/sh
set -e

# Build do pacote Debian do Algori
# Uso: ./packaging/debian/build.sh [versão] [arquitetura]

VERSION="${1:-1.0.0}"
ARCH="${2:-amd64}"
DIST_DIR="dist"
BUILD_DIR="packaging/debian/build"

echo "📦 Build do pacote Debian v${VERSION} (${ARCH})"

# Limpar build anterior
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/DEBIAN" "$BUILD_DIR/usr/bin" "$BUILD_DIR/usr/share/doc/algori"

# Copiar executável
if [ ! -f "$DIST_DIR/algori-linux-${ARCH#amd64}" ]; then
  echo "❌ Executável não encontrado: $DIST_DIR/algori-linux-${ARCH#amd64}"
  echo "   Execute primeiro: ./scripts/build.sh"
  exit 1
fi

cp "$DIST_DIR/algori-linux-${ARCH#amd64}" "$BUILD_DIR/usr/bin/algori"
chmod 755 "$BUILD_DIR/usr/bin/algori"

# Criar control
cat > "$BUILD_DIR/DEBIAN/control" << EOF
Package: algori
Version: ${VERSION}
Section: utils
Priority: optional
Architecture: ${ARCH}
Depends: libc6 (>= 2.14)
Maintainer: Wanfranklin Alves <wanfranklin@users.noreply.github.com>
Homepage: https://github.com/wanfranklin/algori
Description: Linguagem de programação em português
 Algori é uma linguagem de pseudocódigo educacional
 com palavras reservadas em português para aprendizado
 de algoritmos e lógica de programação.
EOF

# Criar postinst
cat > "$BUILD_DIR/DEBIAN/postinst" << 'EOF'
#!/bin/sh
echo "Algori instalado com sucesso!"
echo "Execute: algori --help"
EOF
chmod 755 "$BUILD_DIR/DEBIAN/postinst"

# Copiar docs
cp packaging/debian/usr/share/doc/algori/copyright "$BUILD_DIR/usr/share/doc/algori/"
cp packaging/debian/usr/share/doc/algori/README.md "$BUILD_DIR/usr/share/doc/algori/"

# Build
dpkg-deb --build "$BUILD_DIR" "${DIST_DIR}/algori_${VERSION}_${ARCH}.deb"

echo "✅ Pacote criado: ${DIST_DIR}/algori_${VERSION}_${ARCH}.deb"
echo ""
echo "📦 Instalar:"
echo "   sudo dpkg -i ${DIST_DIR}/algori_${VERSION}_${ARCH}.deb"
