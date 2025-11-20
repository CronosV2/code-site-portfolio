# 🎨 Extension VSCode pour Vortex

Extension officielle créée ! Elle apporte un support complet des fichiers `.vtx`.

## 📥 Installation

### Option 1 : Installation locale (développement)

```bash
cd packages/vscode-extension

# Compiler l'extension
npm run compile

# Lancer en mode debug dans VSCode
# Appuyez sur F5 dans VSCode pour ouvrir une nouvelle fenêtre avec l'extension chargée
```

### Option 2 : Créer et installer le package

```bash
cd packages/vscode-extension

# Créer le package .vsix
npm run package

# Installer dans VSCode
code --install-extension vortex-vscode-0.1.0.vsix
```

## ✨ Fonctionnalités incluses

### 1. Coloration syntaxique
- Balises Vortex (`<route>`, `<fetch>`) en couleur spéciale
- Support JSX/TSX complet
- Attributs Vortex (`path`, `url`, `server`, `as`) mis en évidence

### 2. Snippets (15+ snippets)

| Préfixe | Description |
|---------|-------------|
| `vroute` | Route basique |
| `vroutetitle` | Route avec titre |
| `vroutestyle` | Route avec styles |
| `vfetch` | Fetch serveur |
| `vcard` | Card stylisée |
| `vbutton` | Bouton |
| `vform` | Formulaire complet |
| `vgrid` | Layout grid |
| `vflex` | Layout flexbox |
| `vheader` | Header |
| `vsection` | Section |

### 3. Autocomplétion
- Tapez `<` pour voir les suggestions
- Documentation inline pour chaque balise

### 4. Hover
- Survolez `route` ou `fetch` pour voir des exemples

### 5. Commandes

**Palette de commandes** (`Cmd+Shift+P`) :
- `Vortex: Create Route` - Assistant pour créer une route
- `Vortex: Transpile Current File` - Transpiler et voir le résultat

### 6. Auto-transpilation
- Sauvegarde automatique → transpilation automatique
- Configurable dans les paramètres VSCode

## 🎯 Utilisation rapide

1. **Créer un fichier .vtx**
   ```
   touch src/app/page.vtx
   ```

2. **Ouvrir dans VSCode**

3. **Taper un snippet**
   ```
   vroute + Tab
   ```

4. **Obtenir instantanément**
   ```vtx
   <route path="/">
     <div>
       
     </div>
   </route>
   ```

5. **Sauvegarder** (Cmd+S)
   - Transpilation automatique dans `.vortex/`

## ⚙️ Configuration

Dans les paramètres VSCode (`settings.json`) :

```json
{
  "vortex.autoTranspile": true,
  "vortex.outputDirectory": ".vortex"
}
```

## 🔧 Développement de l'extension

Pour contribuer à l'extension :

```bash
cd packages/vscode-extension

# Mode watch
npm run watch

# Dans VSCode, appuyez sur F5 pour débugger
# Une nouvelle fenêtre s'ouvrira avec l'extension chargée
```

## 📁 Structure

```
vscode-extension/
├── src/
│   └── extension.ts          # Code principal
├── syntaxes/
│   └── vortex.tmLanguage.json # Grammaire TextMate
├── snippets/
│   └── vortex.json           # Snippets
├── icons/
│   └── file-icon.svg         # Icône fichier .vtx
├── language-configuration.json # Config auto-close, brackets
└── package.json              # Manifest de l'extension
```

## 🎨 Icônes

L'extension inclut une icône personnalisée en forme de vortex (🌀) qui apparaît :
- Dans l'explorateur de fichiers pour les `.vtx`
- Dans l'onglet de l'éditeur
- Dans le marketplace VSCode

## 🚀 Prochaines étapes

- [ ] Diagnostics d'erreurs en temps réel
- [ ] Refactoring automatique
- [ ] Intégration Git pour voir les fichiers transpilés
- [ ] Debugger intégré
- [ ] Code actions (fix rapides)

Profitez de l'extension ! 🌀
