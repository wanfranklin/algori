@echo off
REM Build do instalador Windows do Algori
REM Uso: packaging\windows\build.bat [versão]

setlocal enabledelayedexpansion

set VERSION=%1
if "%VERSION%"=="" set VERSION=1.1.0

set DIST_DIR=dist
set SCRIPT_DIR=%~dp0

echo Build do instalador Windows v%VERSION%

REM Verificar se o executável existe
if not exist "%DIST_DIR%\algori-windows-x64.exe" (
    echo Erro: Executavel não encontrado: %DIST_DIR%\algori-windows-x64.exe
    echo Execute primeiro: scripts\build.sh
    exit /b 1
)

REM Verificar se Inno Setup esta instalado
where iscc >nul 2>&1
if errorlevel 1 (
    echo Erro: Inno Setup não encontrado.
    echo Baixe em: https://jrsoftware.org/isinfo.php
    exit /b 1
)

REM Build
echo Compilando instalador...
iscc "%SCRIPT_DIR%algori.iss"

echo.
echo Instalador criado: %DIST_DIR%\algori-%VERSION%-setup.exe
echo.
echo Para instalar:
echo    %DIST_DIR%\algori-%VERSION%-setup.exe

endlocal
