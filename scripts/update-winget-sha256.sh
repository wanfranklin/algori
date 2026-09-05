#!/bin/bash
# Script para atualizar SHA256 no manifesto WinGet
# Uso: ./scripts/update-winget-sha256.sh <version>

set -e

VERSION=${1:-"1.1.0"}
MANIFEST="packaging/winget/AlgoriLabs.algori.yaml"
INSTALLER_URL="https://github.com/AlgoriLabs/algori/releases/download/v${VERSION}/algori-${VERSION}-setup.exe"

echo "Calculando SHA256 para v${VERSION}..."

# Baixar instalador temporariamente
TMPFILE=$(mktemp)
curl -fsSL -o "$TMPFILE" "$INSTALLER_URL"

# Calcular SHA256
SHA256=$(shasum -a 256 "$TMPFILE" | cut -d' ' -f1)

# Limpar
rm -f "$TMPFILE"

echo "SHA256: $SHA256"

# Atualizar manifesto
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/PLACEHOLDER_SETUP_EXE/$SHA256/" "$MANIFEST"
else
    sed -i "s/PLACEHOLDER_SETUP_EXE/$SHA256/" "$MANIFEST"
fi

echo "Manifesto atualizado: $MANIFEST"
echo ""
echo "Proximo passo: Submeter manifesto ao repositorio winget-pkgs"
echo "Documentacao: https://github.com/microsoft/winget-pkgs/blob/master/README.md"
