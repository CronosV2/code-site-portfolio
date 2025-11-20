"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
    console.log('🌀 Vortex extension activée');
    // Commande: Créer une route
    const createRouteCommand = vscode.commands.registerCommand('vortex.createRoute', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Aucun éditeur actif');
            return;
        }
        const routePath = await vscode.window.showInputBox({
            prompt: 'Chemin de la route (ex: /, /about, /contact)',
            value: '/',
            placeHolder: '/'
        });
        if (!routePath)
            return;
        const snippet = new vscode.SnippetString();
        snippet.appendText('<route path="');
        snippet.appendText(routePath);
        snippet.appendText('">\n');
        snippet.appendText('  <div>\n');
        snippet.appendText('    ');
        snippet.appendPlaceholder('// Votre contenu ici');
        snippet.appendText('\n');
        snippet.appendText('  </div>\n');
        snippet.appendText('</route>');
        editor.insertSnippet(snippet);
    });
    // Commande: Transpiler le fichier actuel
    const transpileCommand = vscode.commands.registerCommand('vortex.transpileFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Aucun éditeur actif');
            return;
        }
        const document = editor.document;
        if (!document.fileName.endsWith('.vtx')) {
            vscode.window.showErrorMessage('Ce fichier n\'est pas un fichier .vtx');
            return;
        }
        try {
            // Dynamiquement importer le transpileur
            const { VortexTranspiler } = require('@vortex/core');
            const transpiler = new VortexTranspiler({
                inputPath: path.dirname(document.fileName),
                outputPath: path.join(vscode.workspace.rootPath || '', '.vortex')
            });
            const content = document.getText();
            const transpiled = transpiler.transpile(content);
            // Afficher le résultat dans un nouveau document
            const doc = await vscode.workspace.openTextDocument({
                content: transpiled,
                language: 'typescript'
            });
            await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
            vscode.window.showInformationMessage('✅ Fichier transpilé avec succès!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Erreur de transpilation: ${error.message}`);
        }
    });
    // Auto-transpiler à la sauvegarde
    const saveWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
        const config = vscode.workspace.getConfiguration('vortex');
        const autoTranspile = config.get('autoTranspile', true);
        if (!autoTranspile || !document.fileName.endsWith('.vtx')) {
            return;
        }
        try {
            const { VortexTranspiler } = require('@vortex/core');
            const workspaceRoot = vscode.workspace.rootPath || '';
            const outputDir = config.get('outputDirectory', '.vortex');
            const transpiler = new VortexTranspiler({
                inputPath: path.dirname(document.fileName),
                outputPath: path.join(workspaceRoot, outputDir)
            });
            const relativePath = path.relative(workspaceRoot, document.fileName);
            const outputPath = path.join(workspaceRoot, outputDir, relativePath.replace(/\.vtx$/, '.tsx'));
            transpiler.transpileFile(document.fileName, outputPath);
            console.log(`✅ Transpilé: ${relativePath}`);
        }
        catch (error) {
            console.error('❌ Erreur de transpilation:', error);
        }
    });
    // Autocomplétion pour les balises Vortex
    const completionProvider = vscode.languages.registerCompletionItemProvider('vortex', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('<')) {
                return undefined;
            }
            const completions = [];
            // Route
            const routeCompletion = new vscode.CompletionItem('route', vscode.CompletionItemKind.Keyword);
            routeCompletion.detail = 'Vortex Route';
            routeCompletion.documentation = new vscode.MarkdownString('Définir une route Vortex\n\n```vtx\n<route path="/">\n  <div>Content</div>\n</route>\n```');
            routeCompletion.insertText = new vscode.SnippetString('route path="${1:/}">\n\t$0\n</route>');
            completions.push(routeCompletion);
            // Fetch
            const fetchCompletion = new vscode.CompletionItem('fetch', vscode.CompletionItemKind.Keyword);
            fetchCompletion.detail = 'Vortex Fetch';
            fetchCompletion.documentation = new vscode.MarkdownString('Fetch data côté serveur\n\n```vtx\n<fetch server url="/api/data" as="data">\n  <div>{data.title}</div>\n</fetch>\n```');
            fetchCompletion.insertText = new vscode.SnippetString('fetch server url="${1:/api/data}" as="${2:data}">\n\t$0\n</fetch>');
            completions.push(fetchCompletion);
            return completions;
        }
    }, '<');
    // Hover provider pour afficher des infos
    const hoverProvider = vscode.languages.registerHoverProvider('vortex', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            if (word === 'route') {
                return new vscode.Hover([
                    '**Vortex Route**',
                    'Définit une page Next.js automatiquement',
                    '```vtx\n<route path="/about">\n  <div>Page content</div>\n</route>\n```'
                ]);
            }
            if (word === 'fetch') {
                return new vscode.Hover([
                    '**Vortex Fetch**',
                    'Récupère des données côté serveur',
                    '```vtx\n<fetch server url="/api/data" as="data">\n  <div>{data.title}</div>\n</fetch>\n```'
                ]);
            }
            return null;
        }
    });
    context.subscriptions.push(createRouteCommand, transpileCommand, saveWatcher, completionProvider, hoverProvider);
}
function deactivate() {
    console.log('🌀 Vortex extension désactivée');
}
//# sourceMappingURL=extension.js.map