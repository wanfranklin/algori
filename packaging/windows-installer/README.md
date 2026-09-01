# Instalador Windows (WPF/C#)

Instalador visual para o Algori com interface gráfica amigável.

## Como Funciona

O instalador oferece uma experiência simples e intuitiva:

1. **Tela de Boas-vindas** - Apresentação do Algori
2. **Local de Instalação** - Escolha onde instalar
3. **Instalação** - Download e configuração automática
4. **Concluído** - Confirmação e opções pós-instalação

## Interface

```
┌─────────────────────────────────────────────────────┐
│  🧠 Algori                                          │
│  Linguagem de programação em português              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Bem-vindo!                                         │
│                                                     │
│  Este assistente vai instalar o Algori no seu       │
│  computador.                                        │
│                                                     │
│  O Algori é uma linguagem de programação com        │
│  palavras-chave em português, ideal para aprender   │
│  lógica e algoritmos.                               │
│                                                     │
│  Requisitos do sistema:                             │
│  • Windows 10 ou posterior                          │
│  • 100 MB de espaço em disco                        │
│  • Conexão com a internet (para download)           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Algori v1.1.1              [← Voltar] [Próximo →] │
│  GPL-3.0-or-later                                    │
└─────────────────────────────────────────────────────┘
```

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download) ou superior
- Windows 10 ou posterior

## Build

### Opção 1: Usando o script

```cmd
packaging\windows-installer\build.bat
```

### Opção 2: Usando dotnet CLI

```cmd
cd packaging\windows-installer
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
```

### Opção 3: Usando Visual Studio

1. Abra o arquivo `AlgoriInstaller.csproj`
2. Selecione "Release" no dropdown
3. Clique em "Build > Publish Solution"
4. Selecione "Folder" e escolha um destino

## Testar

```cmd
cd bin\Release\net8.0-windows\win-x64\publish
AlgoriInstaller.exe
```

## Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| Interface gráfica | Visual moderno e intuitivo |
| Download automático | Baixa o Algori do GitHub |
| Instalação silenciosa | Não precisa de interação |
| PATH automático | Adiciona ao PATH do sistema |
| Atalhos | Cria atalhos no desktop e Menu Iniciar |
| Verificação | Verifica se a instalação foi bem-sucedida |

## Estrutura

```
windows-installer/
├── AlgoriInstaller.csproj    # Projeto .NET
├── App.xaml                  # Recursos da aplicação
├── App.xaml.cs               # Código da aplicação
├── MainWindow.xaml           # Interface principal
├── MainWindow.xaml.cs        # Lógica da interface
├── build.bat                 # Script de build
└── README.md                 # Esta documentação
```

## Personalização

### Alterar versão

Edite o arquivo `MainWindow.xaml.cs`:

```csharp
private const string VERSION = "1.1.1";
```

### Alterar URL de download

Edite o arquivo `MainWindow.xaml.cs`:

```csharp
private const string GITHUB_URL = "https://github.com/wanfranklin/algori/releases/download/v1.1.1";
```

### Alterar diretório padrão

Edite o arquivo `MainWindow.xaml.cs`:

```csharp
private string installPath = @"C:\Program Files\Algori";
```

## Distribuir

### Criar instalador compactado

```cmd
cd bin\Release\net8.0-windows\win-x64\publish
powershell Compress-Archive -Path AlgoriInstaller.exe -DestinationPath AlgoriInstaller.zip
```

### Publicar no GitHub Releases

1. Crie uma nova release no GitHub
2. Adicione o arquivo `AlgoriInstaller.exe`
3. Adicione o arquivo `AlgoriInstaller.zip`

## Solução de Problemas

### Erro: .NET SDK não encontrado

Instale o [.NET 8 SDK](https://dotnet.microsoft.com/download).

### Erro: Acesso negado

Execute como administrador.

### Erro: Download falhou

Verifique sua conexão com a internet.

## Licença

GPL-3.0-or-later
