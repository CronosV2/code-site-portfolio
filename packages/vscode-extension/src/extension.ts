import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
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

    if (!routePath) return;

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
    } catch (error: any) {
      vscode.window.showErrorMessage(`❌ Erreur de transpilation: ${error.message}`);
    }
  });

  // Auto-transpiler à la sauvegarde
  const saveWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
    const config = vscode.workspace.getConfiguration('vortex');
    const autoTranspile = config.get<boolean>('autoTranspile', true);

    if (!autoTranspile || !document.fileName.endsWith('.vtx')) {
      return;
    }

    try {
      const { VortexTranspiler } = require('@vortex/core');
      const workspaceRoot = vscode.workspace.rootPath || '';
      const outputDir = config.get<string>('outputDirectory', '.vortex');
      
      const transpiler = new VortexTranspiler({
        inputPath: path.dirname(document.fileName),
        outputPath: path.join(workspaceRoot, outputDir)
      });

      const relativePath = path.relative(workspaceRoot, document.fileName);
      const outputPath = path.join(
        workspaceRoot,
        outputDir,
        relativePath.replace(/\.vtx$/, '.tsx')
      );

      transpiler.transpileFile(document.fileName, outputPath);
      console.log(`✅ Transpilé: ${relativePath}`);
    } catch (error: any) {
      console.error('❌ Erreur de transpilation:', error);
    }
  });

  // Autocomplétion pour les balises Vortex
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'vortex',
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        if (!linePrefix.endsWith('<')) {
          return undefined;
        }

        const completions: vscode.CompletionItem[] = [];

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
    },
    '<'
  );

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

  context.subscriptions.push(
    createRouteCommand,
    transpileCommand,
    saveWatcher,
    completionProvider,
    hoverProvider
  );
}

export function deactivate() {
  console.log('🌀 Vortex extension désactivée');
}
