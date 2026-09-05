import * as vscode from 'vscode';
import { execSync } from 'child_process';

let terminal: vscode.Terminal | undefined;
let outputChannel: vscode.OutputChannel;

function isAlgoriInstalled(): boolean {
    try {
        const cmd = process.platform === 'win32' ? 'where algori' : 'which algori';
        execSync(cmd, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Algori');
    outputChannel.appendLine('Algori extension is now active!');

    // Comando para executar programa
    const runCommand = vscode.commands.registerCommand('algori.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Nenhum arquivo aberto!');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'algori') {
            vscode.window.showErrorMessage('Este não é um arquivo Algori!');
            return;
        }

        // Criar ou reutilizar terminal
        if (!terminal || terminal.exitStatus) {
            terminal = vscode.window.createTerminal('Algori');
        }
        terminal.show();

        // Verificar se algori está instalado
        if (!isAlgoriInstalled()) {
            vscode.window.showErrorMessage(
                'Algori não encontrado no PATH. Instale com: npm install -g algori-core',
                'Abrir documentação'
            ).then(action => {
                if (action === 'Abrir documentação') {
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/AlgoriLabs/algori#instalação'));
                }
            });
            return;
        }

        // Executar programa
        const filePath = document.fileName;
        terminal.sendText(`algori "${filePath}"`);
    });

    // Comando para parar programa
    const stopCommand = vscode.commands.registerCommand('algori.stop', () => {
        if (terminal) {
            terminal.sendText('\u0003'); // Ctrl+C
            vscode.window.showInformationMessage('Programa interrompido!');
        }
    });

    // Provider para autocomplete
    const provider = vscode.languages.registerCompletionItemProvider('algori', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const completionItems: vscode.CompletionItem[] = [];

            // Palavras-chave
            const keywords = [
                'se', 'senao', 'enquanto', 'para', 'funcao', 'retorne', 'constante',
                'programa', 'algori', 'pare', 'continua', 'tipo', 'procedimento',
                'entao', 'faca', 'de', 'ate', 'passo'
            ];

            keywords.forEach(keyword => {
                const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                item.detail = `Palavra-chave: ${keyword}`;
                completionItems.push(item);
            });

            // Tipos
            const types = [
                'inteiro', 'texto', 'real', 'logico', 'caractere', 'decimal', 'vetor', 'matriz', 'vazio'
            ];

            types.forEach(type => {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
                item.detail = `Tipo: ${type}`;
                completionItems.push(item);
            });

            // Funções built-in
            const functions = [
                'mostrar', 'capturar', 'escreva', 'escrevaln', 'leia', 'ler',
                'raiz', 'potencia', 'modulo', 'abs', 'arredondar',
                'tamanho', 'subtexto', 'maiusculo', 'minusculo', 'posicao', 'tipo', 'tamanho_vetor'
            ];

            functions.forEach(func => {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = `Função: ${func}`;
                completionItems.push(item);
            });

            // Constantes
            const constants = [
                'verdadeiro', 'falso', 'e', 'ou', 'nao', 'mod', 'div', 'vazio'
            ];

            constants.forEach(constant => {
                const item = new vscode.CompletionItem(constant, vscode.CompletionItemKind.Constant);
                item.detail = `Constante: ${constant}`;
                completionItems.push(item);
            });

            return completionItems;
        }
    });

    context.subscriptions.push(runCommand, stopCommand, provider);
}

export function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}
