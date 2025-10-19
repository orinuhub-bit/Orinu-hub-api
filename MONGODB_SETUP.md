# 🗄️ Guide de Configuration MongoDB Atlas

Ce guide vous aide à configurer votre base de données MongoDB Atlas pour Orinu-Hub.

---

## 📝 Étape 1 : Créer un compte MongoDB Atlas

1. Allez sur **https://www.mongodb.com/cloud/atlas/register**
2. Créez un compte gratuit (ou connectez-vous si vous en avez déjà un)
3. Vérifiez votre email

---

## 🌍 Étape 2 : Créer un Cluster (Base de données)

### 2.1 Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"**
2. Donnez un nom au projet : **"orinu-hub"** (ou ce que vous voulez)
3. Cliquez sur **"Create Project"**

### 2.2 Créer un cluster gratuit

1. Cliquez sur **"Build a Database"** ou **"Create"**
2. Choisissez l'option **"M0 FREE"** (gratuit, suffisant pour le développement)
3. **Provider** : Choisissez **AWS** ou **Google Cloud**
4. **Region** : Choisissez la région la plus proche de vous (par exemple **eu-west-3** pour Paris)
5. **Cluster Name** : Laissez le nom par défaut ou nommez-le **"orinu-cluster"**
6. Cliquez sur **"Create Deployment"**

⏳ La création du cluster prend 1-3 minutes.

---

## 🔐 Étape 3 : Créer un utilisateur de base de données

Une fenêtre popup devrait apparaître pour créer un utilisateur :

1. **Username** : Choisissez un nom d'utilisateur (exemple : `orinuadmin`)
2. **Password** : Générez un mot de passe fort avec le bouton "Autogenerate Secure Password"
   - ⚠️ **IMPORTANT : Copiez et sauvegardez ce mot de passe !**
3. Cliquez sur **"Create Database User"**

Si la popup n'apparaît pas :
- Allez dans **"Database Access"** (menu de gauche)
- Cliquez sur **"Add New Database User"**
- Suivez les étapes ci-dessus

---

## 🌐 Étape 4 : Configurer l'accès réseau

1. Allez dans **"Network Access"** (menu de gauche)
2. Cliquez sur **"Add IP Address"**
3. Choisissez **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Pour le développement, c'est pratique
   - ⚠️ En production, limitez aux IP spécifiques
4. Cliquez sur **"Confirm"**

⏳ L'activation prend 1-2 minutes.

---

## 🔗 Étape 5 : Obtenir la chaîne de connexion

1. Retournez dans **"Database"** (menu de gauche)
2. Cliquez sur le bouton **"Connect"** de votre cluster
3. Choisissez **"Drivers"**
4. **Driver** : Sélectionnez **"Node.js"** et version **"5.5 or later"**
5. Copiez la chaîne de connexion qui ressemble à :

```
mongodb+srv://<username>:<password>@<cluster-name>.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ Étape 6 : Configurer le fichier .env

1. Ouvrez le fichier **`backend/.env`**
2. Remplacez `MONGODB_URI=` par votre chaîne de connexion
3. **IMPORTANT** : Remplacez les placeholders :
   - `<username>` → votre nom d'utilisateur (exemple : `orinuadmin`)
   - `<password>` → votre mot de passe (celui que vous avez copié)
   - Ajoutez le nom de la base : `/orinu-hub` avant le `?`

### Exemple complet :

```env
MONGODB_URI=mongodb+srv://orinuadmin:VotreMotDePasse123@orinu-cluster.abc12.mongodb.net/orinu-hub?retryWrites=true&w=majority
```

⚠️ **Attention** :
- Pas d'espaces dans l'URL
- Pas de `<>` dans l'URL finale
- Le mot de passe peut contenir des caractères spéciaux qui doivent être encodés en URL
  - Si votre mot de passe contient `@`, `#`, `%`, etc., utilisez un encodeur URL

---

## 🧪 Étape 7 : Tester la connexion

1. Ouvrez un terminal dans le dossier `backend/`
2. Lancez le serveur :

```bash
npm run dev
```

3. Vous devriez voir :

```
✅ MongoDB connecté: orinu-cluster.abc12.mongodb.net
📊 Base de données: orinu-hub
🚀 ========================================
🎨 Serveur Orinu-Hub démarré
📡 Port: 5000
...
```

4. Testez l'API :

```bash
# Dans un nouveau terminal
curl http://localhost:5000/api/health
```

Vous devriez obtenir :

```json
{
  "status": "ok",
  "timestamp": "2025-10-18T...",
  "uptime": 12.345
}
```

---

## ✅ Vérification

**Si tout fonctionne, vous devriez :**

✅ Voir le message de connexion MongoDB dans la console
✅ Pouvoir accéder à `http://localhost:5000`
✅ Voir votre base de données `orinu-hub` dans MongoDB Atlas

**Pour vérifier dans MongoDB Atlas :**

1. Allez dans **"Database"** → **"Browse Collections"**
2. Vous devriez voir votre base `orinu-hub`
3. Les collections seront créées automatiquement quand vous ajouterez des données

---

## 🎨 Étape 8 : Configurer Cloudinary (Upload d'images)

Cloudinary est utilisé pour stocker les images (covers, pages de BD, avatars).

### 8.1 Créer un compte Cloudinary

1. Allez sur **https://cloudinary.com/users/register/free**
2. Créez un compte gratuit (25GB gratuit)
3. Vérifiez votre email

### 8.2 Obtenir les clés API

1. Connectez-vous à votre dashboard Cloudinary
2. Sur la page d'accueil, vous verrez :
   - **Cloud Name**
   - **API Key**
   - **API Secret**

3. Copiez ces informations dans votre fichier `.env` :

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=votre_api_secret
```

---

## 🔒 Sécurité

**Important pour la production :**

1. ❌ Ne committez **JAMAIS** le fichier `.env` sur Git
2. ✅ Le `.gitignore` est déjà configuré pour l'exclure
3. ✅ Utilisez `.env.example` comme modèle pour l'équipe
4. 🔐 Changez le `JWT_SECRET` pour une vraie clé aléatoire :

```bash
# Générer une clé forte (Linux/Mac)
openssl rand -base64 32
```

---

## 🆘 Problèmes courants

### Erreur : "MongoNetworkError: failed to connect to server"

**Cause** : IP non autorisée ou mauvaise URL

**Solution** :
1. Vérifiez que l'IP `0.0.0.0/0` est autorisée dans Network Access
2. Vérifiez que l'URL est correcte dans `.env`

### Erreur : "Authentication failed"

**Cause** : Mauvais username ou password

**Solution** :
1. Vérifiez le username et password dans `.env`
2. Le mot de passe contient peut-être des caractères spéciaux à encoder
3. Créez un nouveau user si besoin

### Erreur : "MONGODB_URI n'est pas définie"

**Cause** : Le fichier `.env` n'est pas chargé

**Solution** :
1. Vérifiez que le fichier `.env` existe dans `backend/`
2. Vérifiez que `MONGODB_URI` n'a pas de faute de frappe

---

## 📚 Prochaines étapes

Une fois MongoDB configuré :

1. ✅ Créer les routes d'authentification (login/register)
2. ✅ Créer les routes CRUD pour les Comics
3. ✅ Tester l'upload d'images avec Cloudinary
4. ✅ Créer les middlewares d'authentification

**Tout est prêt ! 🚀**
