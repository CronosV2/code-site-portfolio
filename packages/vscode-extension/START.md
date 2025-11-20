# 🚀 Démarrer l'extension Vortex

L'extension a été compilée avec succès ! Voici comment la tester :

## Option 1 : Mode Debug (Recommandé)

### Méthode A : Via le menu Debug

1. **Ouvrez la palette de commandes** : `Cmd+Shift+P` (Mac) ou `Ctrl+Shift+P` (Windows/Linux)

2. **Tapez** : `Debug: Select and Start Debugging`

3. **Sélectionnez** : `Run Extension`

4. Une nouvelle fenêtre VSCode s'ouvrira avec l'extension chargée

### Méthode B : Via F5

1. **Ouvrez le fichier** : `packages/vscode-extension/src/extension.ts`

2. **Appuyez sur F5**

3. Une nouvelle fenêtre s'ouvrira automatiquement

### Méthode C : Via l'interface Debug

1. Cliquez sur l'icône **Debug** dans la barre latérale (icône play avec un bug)

2. En haut, sélectionnez **"Run Extension"** dans le dropdown

3. Cliquez sur le bouton **Play ▶️**

## Option 2 : Installer comme extension locale

```bash
cd packages/vscode-extension

# Installer vsce si pas déjà fait
npm install -g @vscode/vsce

# Créer le package
vsce package

# Installer dans VSCode
code --install-extension vortex-vscode-0.1.0.vsix
```

## ✅ Tester l'extension

Une fois l'extension lancée (nouvelle fenêtre VSCode ouverte) :

### 1. Créer un fichier test

Dans la nouvelle fenêtre :
```bash
# Créer un dossier test
mkdir -p test-vortex/src/app
cd test-vortex/src/app

# Créer un fichier .vtx
touch page.vtx
```

### 2. Ouvrir le fichier

Ouvrez `page.vtx` et vous devriez voir :
- ✅ Icône Vortex à côté du fichier
- ✅ Le langage détecté comme "Vortex"

### 3. Tester les snippets

Tapez dans le fichier :
```
vroute
```
Puis appuyez sur **Tab** → Un template de route devrait apparaître !

### 4. Tester l'autocomplétion

Tapez :
```
<
```
Vous devriez voir des suggestions pour `route` et `fetch`

### 5. Tester le hover

Tapez :
```vtx
<route path="/">
  <div>Test</div>
</route>
```

Survolez le mot `route` avec votre souris → Une documentation devrait apparaître !

### 6. Tester les commandes

1. `Cmd+Shift+P` → Tapez `Vortex`
2. Vous devriez voir :
   - `Vortex: Create Route`
   - `Vortex: Transpile Current File`

## 🐛 Debug

Dans la fenêtre principale de VSCode :
- Ouvrez le **Debug Console** pour voir les logs
- Vous devriez voir : `🌀 Vortex extension activée`

## 📝 Modifications en direct

Si vous modifiez le code de l'extension :

1. **Sauvegarder** les changements

2. Dans la fenêtre de debug, appuyez sur :
   - `Cmd+R` (Mac) ou `Ctrl+R` (Windows/Linux)
   - Ou cliquez sur le bouton **Reload** dans la barre de debug

3. L'extension sera rechargée avec vos modifications

## 🎨 Vérifier la coloration syntaxique

Créez ce fichier test :

\`\`\`vtx
<route path="/test">
  <div style={{ padding: '2rem' }}>
    <h1>Hello Vortex</h1>
    <p>Test de coloration</p>
  </div>
</route>
\`\`\`

Les balises `<route>` devraient avoir une couleur différente des balises HTML standard !

---

**Tout est prêt !** Appuyez sur F5 pour démarrer 🚀
