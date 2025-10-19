import { Router, Response } from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/firebaseAuth';
import User from '../models/User';
import { auth as firebaseAuth } from '../config/firebase-admin';

const router = Router();

/**
 * POST /api/users/sync
 * Synchronise un utilisateur Firebase avec MongoDB
 * Crée ou met à jour l'utilisateur dans la base de données
 */
router.post('/sync', verifyFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser) {
      res.status(401).json({
        success: false,
        error: 'Utilisateur non authentifié'
      });
      return;
    }

    const { uid, email, email_verified } = firebaseUser;
    const { username } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Créer un nouveau utilisateur
      // Si pas de username fourni, utiliser le displayName ou générer un username depuis l'email
      let finalUsername = username;

      if (!finalUsername) {
        // Extraire un username de l'email ou utiliser un ID
        finalUsername = email?.split('@')[0] || `user_${uid.substring(0, 8)}`;
      }

      // Vérifier si le username est déjà pris
      const existingUser = await User.findOne({ username: finalUsername });
      if (existingUser) {
        // Ajouter un suffixe aléatoire
        finalUsername = `${finalUsername}_${Math.random().toString(36).substring(2, 7)}`;
      }

      user = await User.create({
        firebaseUid: uid,
        email: email || '',
        username: finalUsername,
        role: 'orifan', // Rôle par défaut
        emailVerified: email_verified || false,
        bio: '',
        avatar: '',
        country: ''
      });

      console.log(`✅ Nouvel utilisateur créé: ${user.username} (${user.email})`);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          username: user.username,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
          bio: user.bio,
          country: user.country
        }
      });
      return;
    }

    // Mettre à jour l'utilisateur existant
    user.emailVerified = email_verified || false;

    // Mettre à jour le username si fourni et différent
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        user.username = username;
      }
    }

    await user.save();

    console.log(`✅ Utilisateur synchronisé: ${user.username} (${user.email})`);

    res.status(200).json({
      success: true,
      message: 'Utilisateur synchronisé avec succès',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        bio: user.bio,
        country: user.country
      }
    });
  } catch (error: any) {
    console.error('Erreur lors de la synchronisation utilisateur:', error);

    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: error.message
      });
      return;
    }

    // Gérer les erreurs de duplication (email ou username déjà existant)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(409).json({
        success: false,
        error: `${field === 'email' ? 'Email' : 'Nom d\'utilisateur'} déjà utilisé`
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de la synchronisation de l\'utilisateur',
      details: error.message
    });
  }
});

/**
 * POST /api/users/upgrade-to-origun
 * Permet à un utilisateur de passer du rôle 'orifan' à 'origun'
 */
router.post('/upgrade-to-origun', verifyFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser) {
      res.status(401).json({
        success: false,
        error: 'Utilisateur non authentifié'
      });
      return;
    }

    const { uid } = firebaseUser;

    // Trouver et mettre à jour l'utilisateur dans MongoDB
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { role: 'origun' },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
      return;
    }

    // Mettre à jour les custom claims dans Firebase
    await firebaseAuth.setCustomUserClaims(uid, { role: 'origun' });

    console.log(`✅ Utilisateur ${user.username} a été upgradé en Origun`);

    res.status(200).json({
      success: true,
      message: 'Vous êtes maintenant un Origun ! Vous pouvez créer et publier des comics.',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        bio: user.bio,
        country: user.country
      }
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'upgrade vers Origun:', error);

    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à niveau',
      details: error.message
    });
  }
});

/**
 * GET /api/users/me
 * Récupère les informations de l'utilisateur connecté
 */
router.get('/me', verifyFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const firebaseUser = req.user;

    if (!firebaseUser) {
      res.status(401).json({
        success: false,
        error: 'Utilisateur non authentifié'
      });
      return;
    }

    const user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        bio: user.bio,
        country: user.country,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);

    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du profil',
      details: error.message
    });
  }
});

export default router;
