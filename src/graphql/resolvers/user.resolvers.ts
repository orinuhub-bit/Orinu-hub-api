import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import User from '../../models/User';
import { GraphQLContext } from '../context';
import { generateToken } from '../../utils/jwt';
import { AuthenticationError, ValidationError } from '../../utils/errors';
import { requireAuth } from '../../utils/errors';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: GraphQLContext) => {
      requireAuth(user);
      return user;
    },

    user: async (_: any, { username }: { username: string }) => {
      const foundUser = await User.findOne({ username }).select('-password');
      if (!foundUser) {
        throw new ValidationError('Utilisateur non trouvé');
      }
      return foundUser;
    },

    users: async (
      _: any,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number }
    ) => {
      return await User.find()
        .select('-password')
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 });
    },
  },

  Mutation: {
    register: async (
      _: any,
      { input }: { input: { username: string; email: string; password: string; role: string } }
    ) => {
      const { username, email, password, role } = input;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        throw new ValidationError('Cet email ou nom d\'utilisateur est déjà utilisé');
      }

      // Valider la longueur du mot de passe
      if (password.length < 6) {
        throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      // Générer le token
      const token = generateToken(user._id as Types.ObjectId);

      // Retourner sans le mot de passe
      const userWithoutPassword = await User.findById(user._id).select('-password');

      return {
        token,
        user: userWithoutPassword,
      };
    },

    login: async (
      _: any,
      { input }: { input: { email: string; password: string } }
    ) => {
      const { email, password } = input;

      // Trouver l'utilisateur
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      // Générer le token
      const token = generateToken(user._id as Types.ObjectId);

      // Retourner sans le mot de passe
      const userWithoutPassword = await User.findById(user._id).select('-password');

      return {
        token,
        user: userWithoutPassword,
      };
    },

    updateProfile: async (
      _: any,
      { input }: { input: { bio?: string; country?: string } },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const updatedUser = await User.findByIdAndUpdate(
        user!._id,
        { $set: input },
        { new: true, runValidators: true }
      ).select('-password');

      return updatedUser;
    },

    uploadAvatar: async (
      _: any,
      { file }: { file: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      // TODO: Implémenter l'upload vers Cloudinary
      const updatedUser = await User.findByIdAndUpdate(
        user!._id,
        { avatar: file },
        { new: true }
      ).select('-password');

      return updatedUser;
    },
  },
};
