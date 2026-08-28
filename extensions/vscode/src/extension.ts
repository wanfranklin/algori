import * as vscode from 'vscode';

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Algori extension is now active!');

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
                'se', 'senao', 'enquanto', 'para', 'funcao', 'retorne', 'constante'
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
                'mostrar', 'capturar'
            ];

            functions.forEach(func => {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = `Função: ${func}`;
                completionItems.push(item);
            });

            // Constantes
            const constants = [
                'verdadeiro', 'falso', 'e', 'ou', 'nao'
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
}
