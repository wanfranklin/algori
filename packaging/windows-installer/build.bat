@echo off
REM Build do instalador Windows do Algori (WPF)
REM Uso: packaging\windows-installer\build.bat

setlocal enabledelayedexpansion

echo ========================================
echo  Build do Instalador Algori (WPF)
echo ========================================
echo.

REM Verificar se dotnet esta instalado
where dotnet >nul 2>&1
if errorlevel 1 (
    echo Erro: .NET SDK não encontrado.
    echo Baixe em: https://dotnet.microsoft.com/download
    exit /b 1
)

REM Verificar versao do .NET
echo Verificando .NET SDK...
dotnet --version
echo.

REM Build para release
echo Compilando instalador...
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true

if errorlevel 1 (
    echo Erro ao compilar o instalador.
    exit /b 1
)

REM Verificar se o executável foi criado
set OUTPUT_DIR=bin\Release\net8.0-windows\win-x64\publish
set OUTPUT_FILE=%OUTPUT_DIR%\AlgoriInstaller.exe

if not exist "%OUTPUT_FILE%" (
    echo Erro: Executavel não encontrado: %OUTPUT_FILE%
    exit /b 1
)

echo.
echo ========================================
echo  Build concluido com sucesso!
echo ========================================
echo.
echo Executavel: %OUTPUT_FILE%
echo.
echo Para testar:
echo    %OUTPUT_FILE%
echo.

endlocal
