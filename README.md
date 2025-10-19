# 🎨 Orinu-Hub Backend API (GraphQL)

API GraphQL pour la plateforme de BD africaine numérique Orinu-Hub.

---

## 🛠️ Stack Technique

- **Runtime :** Node.js + TypeScript
- **Framework :** Express.js
- **GraphQL :** Apollo Server v4
- **Base de données :** MongoDB Atlas
- **ODM :** Mongoose
- **Authentification :** JWT + bcryptjs
- **Upload :** Cloudinary (à configurer)

---

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Puis éditer .env avec vos clés MongoDB
```

---

## ⚙️ Configuration

### 1. MongoDB Atlas

Suivez le guide détaillé dans `MONGODB_SETUP.md` pour configurer votre base de données.

Résumé :
1. Créer un compte sur MongoDB Atlas
2. Créer un cluster gratuit (M0)
3. Créer un utilisateur
4. Autoriser l'accès réseau (0.0.0.0/0)
5. Copier l'URL de connexion dans `.env`

### 2. Variables d'environnement

Fichier `.env` :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orinu-hub?retryWrites=true&w=majority
JWT_SECRET=votre_cle_secrete_forte
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Démarrage

```bash
# Mode développement (avec hot reload)
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

Le serveur démarre sur `http://localhost:5000/graphql`

---

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Connexion MongoDB
│   ├── models/
│   │   ├── User.ts              # Modèle utilisateur
│   │   ├── Comic.ts             # Modèle BD
│   │   ├── Chapter.ts           # Modèle chapitre
│   │   ├── Like.ts              # Modèle like
│   │   └── Comment.ts           # Modèle commentaire
│   ├── graphql/
│   │   ├── typedefs/
│   │   │   ├── user.typedefs.ts
│   │   │   ├── comic.typedefs.ts
│   │   │   ├── interaction.typedefs.ts
│   │   │   └── index.ts
│   │   ├── resolvers/
│   │   │   ├── user.resolvers.ts
│   │   │   ├── comic.resolvers.ts
│   │   │   ├── interaction.resolvers.ts
│   │   │   └── index.ts
│   │   └── context.ts           # Context GraphQL (auth)
│   ├── utils/
│   │   ├── jwt.ts               # Gestion JWT
│   │   └── errors.ts            # Erreurs GraphQL
│   └── server.ts                # Point d'entrée
├── .env                          # Variables d'environnement
├── .env.example                  # Template
├── package.json
├── tsconfig.json
├── nodemon.json
├── MONGODB_SETUP.md              # Guide MongoDB
├── GRAPHQL_GUIDE.md              # Guide GraphQL
└── README.md
```

---

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Flow :
1. L'utilisateur s'inscrit (`register`) ou se connecte (`login`)
2. Le serveur retourne un token JWT
3. Le client envoie ce token dans les headers pour les requêtes protégées :
   ```
   Authorization: Bearer <token>
   ```

---

## 📡 GraphQL API

### Endpoint

```
POST http://localhost:5000/graphql
```

### Exemples de requêtes

Voir le fichier `GRAPHQL_GUIDE.md` pour tous les exemples.

**Inscription :**
```graphql
mutation {
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
    }
  }
}
```

**Créer une BD :**
```graphql
mutation {
  createComic(input: {
    title: "Les Origuns de la Nuit"
    description: "Une BD mystique africaine"
    coverImage: "https://example.com/cover.jpg"
    genre: ["mystique", "aventure"]
    language: "fr"
  }) {
    id
    title
  }
}
```

---

## 🗄️ Modèles de données

### User
- username, email, password (hashed)
- role: `origun` (créateur) ou `orifan` (lecteur)
- bio, avatar, country

### Comic
- title, description, coverImage
- genre[], language, tags[]
- author (ref User)
- views, likesCount
- status: `draft` ou `published`

### Chapter
- comic (ref Comic)
- chapterNumber, title
- pages[] (URLs des images)

### Like
- user (ref User)
- comic (ref Comic)

### Comment
- user (ref User)
- comic (ref Comic)
- content

---

## 🧪 Tests

Pour tester l'API GraphQL :

1. **Apollo Studio** : Ouvrir `http://localhost:5000/graphql` dans le navigateur
2. **Postman** : Créer une requête POST GraphQL
3. **Curl** :
   ```bash
   curl -X POST http://localhost:5000/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"{ __typename }"}'
   ```

---

## 🚧 À faire (TODO)

- [ ] Implémenter l'upload d'images avec Cloudinary
- [ ] Ajouter la validation avancée des inputs
- [ ] Implémenter le système de pagination cursor-based
- [ ] Ajouter les subscriptions GraphQL (temps réel)
- [ ] Ajouter les tests unitaires (Jest)
- [ ] Ajouter le rate limiting
- [ ] Documenter avec GraphQL Schema SDL
- [ ] Déployer sur Railway/Render

---

## 📚 Ressources

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Docs](https://graphql.org/learn/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Docs](https://mongoosejs.com/docs/)

---

## 📝 License

MIT

---

## 👨‍💻 Développement

Créé pour Orinu-Hub - Plateforme de BD africaine numérique.
