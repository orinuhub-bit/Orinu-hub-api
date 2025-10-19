import admin from 'firebase-admin';

// Initialiser Firebase Admin SDK
// Deux options possibles :
// 1. Utiliser le fichier serviceAccountKey.json (recommandé en développement)
// 2. Utiliser les variables d'environnement (recommandé en production)

let firebaseAdmin: admin.app.App;

try {
  // Option 1: Avec fichier serviceAccountKey.json
  // Téléchargez ce fichier depuis :
  // Firebase Console > Paramètres du projet > Comptes de service > Générer une nouvelle clé privée

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('../../serviceAccountKey.json');

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin initialisé avec serviceAccountKey.json');
  } catch (fileError) {
    // Option 2: Avec variables d'environnement
    // Utilisé en production (Render, Railway, etc.)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Firebase Admin SDK non configuré. ' +
        'Ajoutez soit un fichier serviceAccountKey.json, ' +
        'soit les variables d\'environnement FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
      );
    }

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });

    console.log('✅ Firebase Admin initialisé avec variables d\'environnement');
  }
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase Admin:', error);
  throw error;
}

// Exporter l'instance auth pour vérifier les tokens
export const auth = admin.auth();

// Exporter l'app admin pour d'autres fonctionnalités (Firestore, Storage, etc.)
export default firebaseAdmin;
