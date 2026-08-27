#!/bin/bash

# Build multiplataforma para Algori
# Uso: ./scripts/build.sh

set -e

BUN="$HOME/.bun/bin/bun"
DIST_DIR="dist"
SRC="src/cli.ts"

echo "🔨 Building Algori executables..."

# Limpar dist
rm -rf $DIST_DIR
mkdir -p $DIST_DIR

# Build para plataforma atual
echo "📦 Building para plataforma atual..."
$BUN build $SRC --compile --outfile $DIST_DIR/algori

echo "✅ Build concluído!"
echo ""
echo "📁 Executável gerado:"
ls -lh $DIST_DIR/algori
echo ""
echo "🚀 Para instalar:"
echo "   sudo cp $DIST_DIR/algori /usr/local/bin/"
echo "   algori --version"
