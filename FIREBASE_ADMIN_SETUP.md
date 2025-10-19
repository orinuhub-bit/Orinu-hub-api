# Configuration Firebase Admin SDK - Backend

## Télécharger la clé de service Firebase

Pour que le backend puisse vérifier les tokens Firebase et gérer les utilisateurs, vous devez télécharger un fichier de clé privée depuis Firebase.

### Étapes :

1. **Allez sur** https://console.firebase.google.com

2. **Sélectionnez** votre projet **Orinu-Hub**

3. **Cliquez sur l'icône ⚙️** en haut à gauche > **Paramètres du projet**

4. **Allez dans l'onglet "Comptes de service"** (Service accounts)

5. **Vérifiez** que "Firebase Admin SDK" est sélectionné

6. **Cliquez sur** le bouton **"Générer une nouvelle clé privée"** (Generate new private key)

7. **Confirmez** dans la popup qui apparaît

8. Un fichier JSON sera téléchargé, renommez-le en **`serviceAccountKey.json`**

9. **Placez ce fichier** dans le dossier `backend/` :
   ```
   /home/thinkpad/Bureau/orinu-hub/backend/serviceAccountKey.json
   ```

### Structure du fichier

Le fichier `serviceAccountKey.json` ressemble à ceci :

```json
{
  "type": "service_account",
  "project_id": "orinu-hub",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@orinu-hub.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## ⚠️ IMPORTANT - Sécurité

- ❌ **NE JAMAIS** commit ce fichier dans Git
- ✅ Le fichier est déjà dans `.gitignore`
- ✅ En production, utilisez des variables d'environnement au lieu du fichier

## Alternative : Variables d'environnement (Production)

En production (Render, Railway, etc.), au lieu du fichier JSON, ajoutez ces variables d'environnement :

```env
FIREBASE_PROJECT_ID=orinu-hub
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@orinu-hub.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Le code dans `src/config/firebase-admin.ts` détectera automatiquement ces variables et les utilisera.

## Vérifier que ça fonctionne

Une fois le fichier placé, redémarrez le backend :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Firebase Admin initialisé avec serviceAccountKey.json
```

Si vous voyez cette erreur :
```
❌ Erreur d'initialisation Firebase Admin
```

Vérifiez que :
1. Le fichier existe bien dans `backend/serviceAccountKey.json`
2. Le fichier contient un JSON valide
3. Vous avez bien téléchargé la bonne clé depuis votre projet Firebase

## Routes disponibles

Une fois configuré, ces routes API seront disponibles :

- `POST /api/users/sync` - Synchronise un utilisateur Firebase avec MongoDB
- `POST /api/users/upgrade-to-origun` - Upgrade un utilisateur de orifan à origun
- `GET /api/users/me` - Récupère le profil de l'utilisateur connecté

Toutes ces routes nécessitent un token Firebase dans le header :
```
Authorization: Bearer <firebase_id_token>
```
