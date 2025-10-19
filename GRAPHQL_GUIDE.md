# 🚀 Guide d'utilisation GraphQL - Orinu-Hub

## 📡 Endpoint GraphQL

Une fois le serveur démarré avec `npm run dev`, l'API GraphQL est accessible à :

```
http://localhost:5000/graphql
```

---

## 🧪 Tester l'API GraphQL

### Option 1 : Apollo Studio (Recommandé)

Ouvrez votre navigateur à `http://localhost:5000/graphql`

### Option 2 : Postman

1. Créer une nouvelle requête POST vers `http://localhost:5000/graphql`
2. Dans Body → GraphQL
3. Écrire vos queries/mutations

### Option 3 : Curl

```bash
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

---

## 📝 Exemples de requêtes

### 1. Inscription (Mutation)

```graphql
mutation Register {
  register(input: {
    username: "origun_test"
    email: "test@orinu.com"
    password: "password123"
    role: origun
  }) {
    token
    user {
      id
      username
      email
      role
      createdAt
    }
  }
}
```

### 2. Connexion (Mutation)

```graphql
mutation Login {
  login(input: {
    email: "test@orinu.com"
    password: "password123"
  }) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

### 3. Obtenir mon profil (Query avec auth)

**Headers requis :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Query :**
```graphql
query Me {
  me {
    id
    username
    email
    role
    bio
    avatar
    country
    createdAt
  }
}
```

### 4. Créer une BD (Mutation avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Mutation :**
```graphql
mutation CreateComic {
  createComic(input: {
    title: "Les Origuns de la Nuit"
    description: "Une BD mystique sur les guerriers des âmes africaines"
    coverImage: "https://example.com/cover.jpg"
    genre: ["mystique", "aventure"]
    language: "fr"
    tags: ["afrique", "spiritualité", "combat"]
    status: published
  }) {
    id
    title
    description
    coverImage
    genre
    language
    author {
      username
    }
    views
    likesCount
    status
    createdAt
  }
}
```

### 5. Lister les BDs (Query)

```graphql
query GetComics {
  comics(
    filter: {
      genre: ["mystique"]
      language: "fr"
      status: published
    }
    sort: recent
    limit: 10
    offset: 0
  ) {
    comics {
      id
      title
      description
      coverImage
      genre
      language
      author {
        username
        avatar
      }
      views
      likesCount
      createdAt
    }
    total
    hasMore
  }
}
```

### 6. Obtenir une BD spécifique

```graphql
query GetComic {
  comic(id: "COMIC_ID_HERE") {
    id
    title
    description
    coverImage
    genre
    language
    tags
    author {
      id
      username
      avatar
      bio
    }
    views
    likesCount
    status
    isLikedByMe
    chapters {
      id
      chapterNumber
      title
      pages
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

### 7. Liker une BD (Mutation avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Mutation :**
```graphql
mutation LikeComic {
  likeComic(comicId: "COMIC_ID_HERE") {
    id
    title
    likesCount
    isLikedByMe
  }
}
```

### 8. Ajouter un commentaire (Mutation avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Mutation :**
```graphql
mutation CreateComment {
  createComment(input: {
    comicId: "COMIC_ID_HERE"
    content: "Incroyable BD ! Les dessins sont magnifiques 🔥"
  }) {
    id
    content
    user {
      username
      avatar
    }
    createdAt
  }
}
```

### 9. Récupérer les commentaires

```graphql
query GetComments {
  comments(comicId: "COMIC_ID_HERE", limit: 20, offset: 0) {
    comments {
      id
      content
      user {
        username
        avatar
      }
      createdAt
    }
    total
    hasMore
  }
}
```

### 10. Créer un chapitre (Mutation avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Mutation :**
```graphql
mutation CreateChapter {
  createChapter(input: {
    comicId: "COMIC_ID_HERE"
    chapterNumber: 1
    title: "Le Réveil des Origuns"
    pages: [
      "https://cloudinary.com/page1.jpg",
      "https://cloudinary.com/page2.jpg",
      "https://cloudinary.com/page3.jpg"
    ]
  }) {
    id
    chapterNumber
    title
    pages
    comic {
      title
    }
    createdAt
  }
}
```

### 11. Mes BDs (Query avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Query :**
```graphql
query MyComics {
  myComics(status: published) {
    id
    title
    description
    coverImage
    views
    likesCount
    status
    createdAt
  }
}
```

### 12. BDs tendances

```graphql
query TrendingComics {
  trendingComics(limit: 5) {
    id
    title
    coverImage
    author {
      username
    }
    views
    likesCount
  }
}
```

### 13. Mettre à jour son profil (Mutation avec auth)

**Headers :**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Mutation :**
```graphql
mutation UpdateProfile {
  updateProfile(input: {
    bio: "Créateur de BD mystiques inspirées par les légendes africaines"
    country: "Togo"
  }) {
    id
    username
    bio
    country
  }
}
```

### 14. Recherche de BDs

```graphql
query SearchComics {
  comics(
    filter: {
      search: "origuns"
    }
    sort: popular
    limit: 10
  ) {
    comics {
      id
      title
      description
      coverImage
    }
    total
  }
}
```

---

## 🔐 Authentification

Pour les requêtes nécessitant une authentification :

1. Faire un `register` ou `login` pour obtenir un token
2. Copier le token retourné
3. Ajouter le header dans vos prochaines requêtes :

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📊 Types disponibles

### UserRole
- `origun` : Créateur de BD
- `orifan` : Lecteur/Fan

### ComicStatus
- `draft` : Brouillon (non publié)
- `published` : Publié (visible par tous)

### ComicSortBy
- `recent` : Plus récentes
- `popular` : Plus populaires (par likes)
- `views` : Plus vues

### Languages
- `fr` : Français
- `en` : Anglais
- `ewe` : Ewe
- `yoruba` : Yoruba
- `swahili` : Swahili
- `other` : Autre

---

## 🛠️ Workflow typique

### Pour un créateur (Origun) :

1. **S'inscrire** avec `role: origun`
2. **Se connecter** pour obtenir un token
3. **Créer une BD** avec `createComic`
4. **Ajouter des chapitres** avec `createChapter`
5. **Publier** en passant `status: published`

### Pour un lecteur (Orifan) :

1. **S'inscrire** avec `role: orifan`
2. **Se connecter**
3. **Explorer les BDs** avec `comics`
4. **Lire une BD** avec `comic(id)`
5. **Liker** avec `likeComic`
6. **Commenter** avec `createComment`

---

## 🐛 Debugging

Pour voir les erreurs GraphQL détaillées, ouvrez la console du serveur.

Les erreurs sont formatées avec des codes :
- `UNAUTHENTICATED` : Token manquant ou invalide
- `FORBIDDEN` : Pas les permissions
- `BAD_USER_INPUT` : Données invalides
- `NOT_FOUND` : Ressource introuvable

---

## 🚀 Prochaines étapes

1. Tester toutes les queries/mutations
2. Intégrer l'upload d'images avec Cloudinary
3. Créer le client frontend avec Apollo Client
4. Ajouter des subscriptions GraphQL (temps réel)

**Bon développement ! 🎨**
