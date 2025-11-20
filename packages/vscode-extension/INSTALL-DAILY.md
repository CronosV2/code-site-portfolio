# 📦 Installer l'extension Vortex dans votre VSCode

## 🚀 Méthode simple : Installation directe

### Étape 1 : Créer un lien symbolique

```bash
# Aller dans le dossier des extensions VSCode
cd ~/.vscode/extensions

# Créer un lien symbolique vers votre extension
ln -s /Users/cronos/Documents/GitHub/code-site-portfolio/packages/vscode-extension vortex-vscode-0.1.0
```

### Étape 2 : Recharger VSCode

1. Appuyez sur `Cmd+Shift+P`
2. Tapez : `Developer: Reload Window`
3. Appuyez sur Entrée

✅ **L'extension est maintenant installée !**

---

## 🔧 Vérifier que ça fonctionne

### 1. Vérifier la liste des extensions

`Cmd+Shift+P` → `Extensions: Show Installed Extensions`

Cherchez "Vortex" - elle devrait apparaître !

### 2. Créer un fichier test

```bash
# Dans n'importe quel dossier
touch test.vtx
```

Ouvrez `test.vtx` et tapez :
```
vroute
```
Puis appuyez sur **Tab** → Un snippet devrait apparaître ! 🎉

### 3. Tester l'autocomplétion

Dans `test.vtx`, tapez :
```
<
```
Vous devriez voir les suggestions `route` et `fetch`

---

## 🔄 Pour les mises à jour

Quand vous modifiez le code de l'extension :

```bash
# 1. Recompiler
cd /Users/cronos/Documents/GitHub/code-site-portfolio/packages/vscode-extension
npm run compile

# 2. Recharger VSCode
# Cmd+Shift+P → Developer: Reload Window
```

---

## 🎨 Ce que vous pouvez maintenant faire

### Snippets disponibles

| Tapez | Puis Tab | Vous obtenez |
|-------|----------|--------------|
| `vroute` | Tab | Route complète |
| `vroutetitle` | Tab | Route avec titre |
| `vcard` | Tab | Card stylisée |
| `vbutton` | Tab | Bouton |
| `vform` | Tab | Formulaire |
| `vgrid` | Tab | Layout grid |
| `vflex` | Tab | Layout flex |

### Commandes disponibles

`Cmd+Shift+P` puis tapez "Vortex" :
- **Vortex: Create Route** - Créer une route rapidement
- **Vortex: Transpile Current File** - Voir le fichier transpilé

### Coloration syntaxique

Les balises `<route>` et `<fetch>` sont colorées différemment !

---

## ❌ Désinstaller

Si vous voulez désinstaller :

```bash
# Supprimer le lien symbolique
rm ~/.vscode/extensions/vortex-vscode-0.1.0

# Recharger VSCode
# Cmd+Shift+P → Developer: Reload Window
```

---

**Voilà ! Votre extension Vortex est prête à l'emploi tous les jours ! 🌀**
