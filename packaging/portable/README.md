# Algori - Modo Portátil (USB)

Execute o Algori de qualquer computador Windows sem instalar nada.

## Como Usar

### Passo 1: Preparar o USB

1. Conecte um USB no computador
2. Copie a pasta `packaging/portable/` para o USB
3. Execute `algori-portable.ps1` no PowerShell

### Passo 2: Usar em outro computador

1. Conecte o USB no computador
2. Abra o PowerShell ou Prompt de Comando
3. Navegue até a pasta do USB
4. Execute:

```powershell
.\algori\algori.exe arquivo
```

## Estrutura do USB

```
USB/
├── algori/
│   ├── algori.exe        # Executável do Algori
│   ├── exemplos/         # Exercícios prontos
│   │   └── ola.algori
│   └── projetos/         # Seus projetos
├── algori-portable.ps1   # Script de configuração
└── README.txt            # Instruções
```

## Exemplo

```powershell
# No PowerShell
cd E:\
.\algori\algori.exe .\algori\exemplos\ola
```

Saída:

```
Olá, Mundo!
Este é um exemplo do Algori em modo portátil!
Você pode criar seus próprios programas aqui.
Qual é o seu nome?
```

## Vantagens

| Vantagem | Descrição |
|----------|-----------|
| **Não instala nada** | Rode em qualquer computador |
| **Leve** | Ocupa menos de 10 MB |
| **Portátil** | Leve seus projetos para qualquer lugar |
| **Rápido** | Sem necessidade de internet |

## Limitações

- Não adiciona ao PATH do sistema
- Não cria atalhos
- Não mantém configurações entre sessões

## Solução de Problemas

### O PowerShell não executa o script

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Acesso negado

Execute o PowerShell como administrador.

### USB não é reconhecido

Tente outra porta USB ou outro computador.

## Versão

Algori v1.1.1

## Licença

GPL-3.0-or-later
