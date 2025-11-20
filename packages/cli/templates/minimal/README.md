# Vortex Minimal Template

Bienvenue dans votre projet Vortex! 🌀

> **La configuration principale se fait dans `vortex.config.ts`.**
> Le fichier `next.config.js` n'est plus utilisé.

## Structure du projet

```
my-vortex-app/
├── src/
│   └── app/
│       └── page.vtx          # Page d'accueil (syntaxe Vortex)
├── .vortex/                  # Fichiers transpilés (généré automatiquement)
├── vortex.config.ts          # Configuration Vortex principale
├── package.json
└── tsconfig.json
```

## Commandes disponibles

```bash
# Développement (avec hot reload)
npm run dev

# Build production
npm run build

# Démarrer en production
npm run start
```

## Syntaxe Vortex (.vtx)

### Créer une route

```vtx
<route path="/">
  <div>
    <h1>Hello World</h1>
  </div>
</route>
```

Le transpileur Vortex transformera automatiquement ce code en composant Next.js valide.

## Comment ça marche ?

1. Vous écrivez vos pages en `.vtx` dans `src/app/`
2. Le CLI Vortex surveille les changements et transpile en `.tsx` dans `.vortex/app/`
3. Next.js utilise les fichiers transpilés pour le rendu

## Prochaines étapes

- Créez de nouvelles pages dans `src/app/`
- Utilisez la syntaxe `<route>` pour définir vos routes
- Explorez la documentation pour découvrir d'autres fonctionnalités Vortex

Bon développement! 🚀
