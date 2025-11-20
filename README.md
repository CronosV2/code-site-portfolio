# Vortex Framework 🌀

Framework web basé sur Next.js avec syntaxe personnalisée `.vtx`

## 🚀 Quick Start

### Installation

```bash
# Cloner le repo
git clone <repo-url>
cd vortex

# Installer les dépendances
pnpm install

# Build tous les packages
pnpm build
```

### Créer un nouveau projet

```bash
# En utilisant le CLI local
cd packages/cli
pnpm build
node dist/index.js create mon-projet

# Ou après installation globale
npm install -g @vortex/cli
vortex create mon-projet
```

### Questions interactives

Le CLI vous posera ces questions:
1. **TypeScript ?** (Recommandé: Oui)
2. **Template ?** (minimal / full)
3. **Package manager ?** (npm / yarn / pnpm)

## 📁 Structure du Monorepo

```
vortex/
├── packages/
│   ├── cli/              # CLI Vortex (create, dev, build)
│   └── core/             # Transpileur .vtx → .tsx
├── templates/
│   ├── minimal/          # Template de base
│   └── full/             # Template avec exemples
├── package.json          # Root package
├── pnpm-workspace.yaml   # Config monorepo
└── turbo.json           # Config Turborepo
```

## 📝 Syntaxe .vtx

### Route simplifiée

```vtx
<route path="/">
  <div>
    <h1>Hello Vortex!</h1>
  </div>
</route>
```

Le transpileur transforme automatiquement en:

```tsx
export default function Page() {
  return (
    <div>
      <h1>Hello Vortex!</h1>
    </div>
  );
}
```

## 🛠 Commandes

### Développement

```bash
# Dans le monorepo
pnpm dev              # Watch mode pour tous les packages
pnpm build            # Build tous les packages

# Dans un projet Vortex
vortex dev            # Démarre le serveur de dev
vortex build          # Build pour production
```

## 🏗 Comment ça marche ?

1. **Écriture** : Vous écrivez des fichiers `.vtx` dans `src/app/`
2. **Transpilation** : Le CLI surveille et transpile en `.tsx` dans `.vortex/app/`
3. **Next.js** : Next.js lit les fichiers transpilés et fait le rendu

## 🎯 Roadmap

- [x] CLI basique (create, dev, build)
- [x] Transpileur avec syntaxe `<route>`
- [x] Templates minimal et full
- [x] Watcher en mode dev
- [x] Extension VSCode (coloration, snippets, autocomplétion)
- [ ] Syntaxe `<fetch>` pour data fetching
- [ ] Auto-import des composants
- [ ] Composants Vortex préfabriqués

## 📦 Packages

### @vortex/cli

CLI pour créer et gérer des projets Vortex.

**Commandes:**
- `vortex create <name>` : Créer un projet
- `vortex dev` : Mode développement
- `vortex build` : Build production

### @vortex/core

Transpileur qui transforme `.vtx` en `.tsx`.

**Features:**
- Parser Babel pour JSX/TypeScript
- Transformation syntaxe Vortex
- Watcher pour hot reload

## 🤝 Contribution

```bash
# Forker le repo
git clone <your-fork>
cd vortex

# Créer une branche
git checkout -b feature/ma-feature

# Développer
pnpm install
pnpm build

# Tester avec un projet
cd packages/cli
node dist/index.js create test-project
cd test-project
npm run dev

# Commit et PR
git commit -am "feat: ma feature"
git push origin feature/ma-feature
```

## 📄 License

MIT

---

Développé avec ❤️ par la communauté Vortex
