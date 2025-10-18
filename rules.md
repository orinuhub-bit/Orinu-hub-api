# Règles de développement Orinu-Hub

## 1. Règles pour les icônes

**IMPORTANT :** Toujours attribuer une couleur aux icônes via l'attribut `color`.

### ✅ Bon exemple :
```tsx
<Home size={20} color="#E9D8FF" />
<Profile size={22} color="#FF6B35" />
```

### ❌ Mauvais exemple :
```tsx
<Home size={20} />
<Profile size={22} />
```

### Palette de couleurs Orinu :
- `#2B0B3A` - base (violet foncé)
- `#5C3B8A` - mid (violet moyen)
- `#E9D8FF` - light (violet clair)
- `#FF6B35` - fire (orange feu)
- `#F8F6FF` - text (blanc cassé)
- `#BDB4C7` - gray (gris violet)

---

## 2. Règles de nommage des commits

Suivre les **standards conventionnels de GitHub** (Conventional Commits).

### Format :
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types autorisés :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactorisation du code
- `perf`: Amélioration des performances
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance, configuration, etc.
- `build`: Changements du système de build
- `ci`: Changements CI/CD

### ✅ Bons exemples :
```
feat(auth): add user registration with JWT
fix(api): resolve GraphQL query timeout issue
docs(readme): update installation instructions
chore(deps): update react to v19.1.1
```

### ❌ Mauvais exemples :
```
Added new feature
fixed bug
update
```

---

## 3. Interdictions dans les commits

### ❌ PAS de co-authored
```
❌ INTERDIT :
Co-Authored-By: Claude <noreply@anthropic.com>
```

### ❌ PAS de lien vers Claude
```
❌ INTERDIT :
Generated with Claude Code
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### ✅ Commits simples et directs
```
✅ CORRECT :
feat(landing): add internationalization with i18next
feat(api): implement GraphQL resolvers for comics
fix(header): correct logo display issue
```

---

## 4. Bonnes pratiques Git

### Commits atomiques
- Un commit = une fonctionnalité ou un fix
- Ne pas mélanger plusieurs changements dans un seul commit

### Messages clairs
- Description concise mais informative
- Utiliser l'impératif présent ("add", "fix", "update")
- Première ligne <= 72 caractères

### Branches
- `main` : production
- `develop` : développement principal
- `feature/<nom>` : nouvelles fonctionnalités
- `fix/<nom>` : corrections de bugs

---

## 5. Standards de code

### TypeScript
- Toujours typer les variables et fonctions
- Utiliser des interfaces pour les objets complexes
- Éviter `any` autant que possible

### React
- Composants fonctionnels avec hooks
- Props typées avec TypeScript
- Destructuration des props

### Tailwind CSS
- Utiliser les classes utilitaires
- Éviter le CSS inline autant que possible
- Utiliser les custom colors définies dans le thème

---

## 6. Structure des fichiers

### Naming conventions
- Composants React : PascalCase (`Header.tsx`, `OrinuCard.tsx`)
- Utilities : camelCase (`utils.ts`, `mockOrinus.ts`)
- Types/Interfaces : PascalCase (`Orinu`, `UserInput`)
- Constantes : UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)

### Organisation
```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── layouts/       # Layouts (Header, Footer, etc.)
├── hooks/         # Custom hooks
├── utils/         # Fonctions utilitaires
├── types/         # Types TypeScript
├── data/          # Mock data
├── i18n/          # Internationalisation
└── assets/        # Images, fonts, etc.
```

---

## 7. Internationalisation (i18n)

### Toujours utiliser les traductions
```tsx
✅ Bon :
const { t } = useTranslation();
<h1>{t('sections.trending')}</h1>

❌ Mauvais :
<h1>Orinu Tendances & Populaires</h1>
```

### Ajouter les traductions dans les deux langues
- `src/i18n/locales/fr.json`
- `src/i18n/locales/en.json`

---

## 8. GraphQL

### Naming
- Queries : verbe descriptif (`getComics`, `me`, `trendingComics`)
- Mutations : verbe d'action (`createComic`, `login`, `likeComic`)
- Types : PascalCase (`User`, `Comic`, `ComicInput`)

### Documentation
- Documenter chaque query/mutation dans GRAPHQL_GUIDE.md

---

**Dernière mise à jour :** 2025-01-18
