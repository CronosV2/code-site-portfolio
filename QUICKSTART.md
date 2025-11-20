# Guide de démarrage rapide Vortex

## 🚀 Créer votre premier projet

### 1. Créer un nouveau projet

```bash
cd packages/cli
node dist/index.js create mon-projet
```

Le CLI vous posera quelques questions :
- **TypeScript ?** → Oui (recommandé)
- **Template ?** → minimal (pour commencer)
- **Package manager ?** → pnpm (ou npm/yarn)

### 2. Structure générée

```
mon-projet/
├── src/
│   └── app/
│       ├── page.vtx        # Page d'accueil en syntaxe Vortex
│       └── layout.tsx      # Layout Next.js standard
├── .vortex/                # Fichiers transpilés (auto-généré)
├── next.config.js
├── package.json
└── tsconfig.json
```

### 3. Lancer le projet

```bash
cd mon-projet
npm install  # Si pas installé automatiquement
npm run dev
```

Le CLI va :
1. 🔍 Surveiller les fichiers `.vtx` dans `src/app/`
2. ⚡ Les transpiler automatiquement en `.tsx` dans `.vortex/app/`
3. 🚀 Lancer Next.js sur http://localhost:3000

## 📝 Écrire votre première page .vtx

### Exemple simple

Créez `src/app/page.vtx` :

```vtx
<route path="/">
  <div>
    <h1>Hello Vortex!</h1>
    <p>Ma première page avec la syntaxe Vortex</p>
  </div>
</route>
```

Le transpileur va automatiquement générer :

```tsx
export default function Page() {
  return (
    <div>
      <h1>Hello Vortex!</h1>
      <p>Ma première page avec la syntaxe Vortex</p>
    </div>
  );
}
```

### Créer une nouvelle page

1. Créez le dossier : `src/app/about/`
2. Créez le fichier : `src/app/about/page.vtx`

```vtx
<route path="/about">
  <div>
    <h1>À propos</h1>
    <p>Page à propos créée avec Vortex</p>
    <a href="/">Retour à l'accueil</a>
  </div>
</route>
```

3. Le fichier sera transpilé automatiquement
4. Visitez http://localhost:3000/about

## 🎨 Utiliser des styles

Vous pouvez utiliser le style inline React :

```vtx
<route path="/">
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#6366f1', fontSize: '3rem' }}>
      Vortex
    </h1>
  </div>
</route>
```

## 🔥 Hot Reload

Toute modification d'un fichier `.vtx` déclenche :
1. Transpilation automatique
2. Rechargement de la page Next.js
3. Mise à jour instantanée dans le navigateur

## 📦 Build pour production

```bash
npm run build
```

Le CLI va :
1. Transpiler tous les fichiers `.vtx`
2. Lancer `next build`
3. Créer le bundle optimisé dans `.next/`

## 🛠 Commandes disponibles

```bash
# Développement
npm run dev      # Démarre le watcher + Next.js dev server

# Production
npm run build    # Build pour production
npm run start    # Lance le serveur production

# Lint
npm run lint     # ESLint
```

## 🎯 Prochaines étapes

1. **Explorez les templates** : Essayez le template `full` pour voir plus d'exemples
2. **Créez des composants** : Ajoutez des composants React classiques dans `src/app/components/`
3. **Layout personnalisé** : Modifiez `src/app/layout.tsx` pour votre design
4. **API Routes** : Utilisez Next.js API routes normalement dans `src/app/api/`

## ⚠️ À savoir

- Les fichiers `.vtx` doivent toujours avoir une balise `<route>`
- Le dossier `.vortex/` est auto-généré (ajouté au .gitignore)
- Vous pouvez mixer fichiers `.vtx` et `.tsx` dans le même projet
- Le layout doit rester en `.tsx` (Next.js standard)

## 🐛 Problèmes courants

### "vortex: command not found"

Utilisez le chemin complet :
```bash
node /chemin/vers/packages/cli/dist/index.js create mon-projet
```

### Le hot reload ne fonctionne pas

Vérifiez que :
1. Le CLI est bien lancé (`npm run dev`)
2. Vos fichiers sont dans `src/app/`
3. Ils ont l'extension `.vtx`

### Erreur de transpilation

Vérifiez que votre syntaxe JSX est valide :
- Balises fermées correctement
- Attributs entre accolades pour expressions
- Style en objet : `style={{ color: 'red' }}`

---

Bon développement avec Vortex! 🌀
