import { IUser } from '../models/User';
import User from '../models/User';
import { verifyToken } from '../utils/jwt';

export interface GraphQLContext {
  user: IUser | null;
}

export const createContext = async ({ req }: any): Promise<GraphQLContext> => {
  let user: IUser | null = null;

  // Récupérer le token depuis l'header Authorization
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded && decoded.userId) {
      try {
        user = await User.findById(decoded.userId).select('-password');
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    }
  }

  return { user };
};
