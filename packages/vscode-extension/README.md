# Vortex VSCode Extension

Extension officielle pour le framework Vortex. Apporte le support complet des fichiers `.vtx` dans Visual Studio Code.

## ✨ Fonctionnalités

### 🎨 Coloration Syntaxique
- Coloration des balises Vortex spéciales (`<route>`, `<fetch>`)
- Support complet de JSX/TSX
- Mise en évidence des attributs Vortex (`path`, `url`, `server`, `as`)

### 📝 Snippets
Tapez les préfixes suivants et appuyez sur Tab :

- `vroute` - Route basique
- `vroutetitle` - Route avec titre
- `vroutestyle` - Route avec styles
- `vfetch` - Fetch data serveur
- `vcard` - Card stylisée
- `vbutton` - Bouton stylisé
- `vform` - Formulaire complet
- `vgrid` - Layout grid
- `vflex` - Layout flex
- Et plus encore...

### 💡 Autocomplétion
- Suggestions intelligentes pour les balises Vortex
- Autocomplétion des attributs
- Documentation inline

### 🔍 Hover
- Survolez `route` ou `fetch` pour voir la documentation
- Exemples d'utilisation intégrés

### ⚡ Commandes

**Vortex: Create Route** (`Cmd+Shift+P`)
- Créer rapidement une nouvelle route avec assistant

**Vortex: Transpile Current File**
- Transpiler le fichier `.vtx` actuel et voir le résultat `.tsx`

### 🔄 Auto-transpilation
- Transpile automatiquement à la sauvegarde
- Configurable via les paramètres

## 📦 Installation

### Depuis le code source

```bash
cd packages/vscode-extension
npm install
npm run compile
```

### Installer l'extension

```bash
# Créer le package
npm run package

# Installer dans VSCode
code --install-extension vortex-vscode-0.1.0.vsix
```

## ⚙️ Configuration

Ouvrez les paramètres VSCode (`Cmd+,`) et cherchez "Vortex" :

```json
{
  "vortex.autoTranspile": true,
  "vortex.outputDirectory": ".vortex"
}
```

### Options disponibles

- **vortex.autoTranspile** (boolean, défaut: `true`)
  - Active la transpilation automatique à la sauvegarde

- **vortex.outputDirectory** (string, défaut: `.vortex`)
  - Dossier de sortie pour les fichiers transpilés

## 🎯 Utilisation

### 1. Créer un fichier .vtx

Créez `page.vtx` dans votre projet Vortex.

### 2. Commencer à taper

Tapez `<` pour voir les suggestions de balises Vortex.

### 3. Utiliser les snippets

Tapez `vroute` puis Tab pour créer une route complète.

### 4. Transpiler

Sauvegardez le fichier (Cmd+S) et il sera automatiquement transpilé !

## 📚 Exemples

### Snippet: Route avec style
```vtx
vroute + Tab
```

Génère :
```vtx
<route path="/">
  <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
    <h1>Page Title</h1>
    
  </div>
</route>
```

### Snippet: Formulaire
```vtx
vform + Tab
```

Génère un formulaire complet avec inputs et bouton stylisé.

## 🐛 Problèmes connus

- L'autocomplétion JSX standard peut interférer avec les balises Vortex
- La transpilation automatique nécessite `@vortex/core` installé dans le projet

## 🤝 Contribution

Pour contribuer à l'extension :

```bash
git clone <repo>
cd packages/vscode-extension
npm install
npm run watch  # Mode développement
```

Appuyez sur `F5` dans VSCode pour lancer l'extension en mode debug.

## 📄 License

MIT

---

Développé avec ❤️ pour le framework Vortex 🌀
