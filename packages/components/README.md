# @vortex/components

Composants UI préfabriqués pour Vortex Framework.

## Installation

Les composants sont automatiquement disponibles dans les projets Vortex.

## Composants

### VButton

Bouton stylisé avec variantes.

```tsx
<VButton variant="primary" size="md">
  Click me
</VButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'

### VCard

Carte avec titre, description et contenu.

```tsx
<VCard title="Mon titre" description="Description" hoverable>
  Contenu de la carte
</VCard>
```

**Props:**
- `title`: Titre de la carte
- `description`: Description
- `hoverable`: Effet hover (boolean)

### VInput

Input avec label, erreur et helper text.

```tsx
<VInput 
  label="Email" 
  type="email" 
  error="Email invalide"
  helperText="Entrez votre email"
/>
```

**Props:**
- `label`: Label du champ
- `error`: Message d'erreur
- `helperText`: Texte d'aide
