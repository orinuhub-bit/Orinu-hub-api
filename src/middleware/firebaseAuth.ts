import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

// Étendre l'interface Request pour inclure les données utilisateur Firebase
export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

/**
 * Middleware pour vérifier le token Firebase ID Token
 * Le token doit être envoyé dans le header Authorization: Bearer <token>
 */
export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token d\'authentification manquant. Format attendu: Bearer <token>'
      });
      return;
    }

    // Extraire le token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
      return;
    }

    // Vérifier le token avec Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);

    // Ajouter les informations utilisateur à la requête
    req.user = decodedToken;

    // Passer au middleware suivant
    next();
  } catch (error: any) {
    console.error('Erreur de vérification du token Firebase:', error);

    // Gérer les différentes erreurs Firebase
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({
        success: false,
        error: 'Token expiré. Veuillez vous reconnecter.'
      });
      return;
    }

    if (error.code === 'auth/argument-error') {
      res.status(401).json({
        success: false,
        error: 'Token invalide ou malformé'
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'Authentification échouée. Token invalide.'
    });
  }
};

/**
 * Middleware optionnel pour vérifier le token Firebase
 * Si le token est présent, il est vérifié, sinon la requête continue
 */
export const verifyFirebaseTokenOptional = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Pas de token, continuer sans authentification
      next();
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      next();
      return;
    }

    // Vérifier le token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    // En cas d'erreur, continuer sans authentification
    console.error('Token Firebase invalide (mode optionnel):', error);
    next();
  }
};
