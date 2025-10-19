import Like from '../../models/Like';
import Comment from '../../models/Comment';
import Comic from '../../models/Comic';
import { GraphQLContext } from '../context';
import { requireAuth, NotFoundError, ForbiddenError } from '../../utils/errors';

export const interactionResolvers = {
  Query: {
    comments: async (
      _: any,
      { comicId, limit = 20, offset = 0 }: { comicId: string; limit?: number; offset?: number }
    ) => {
      const comments = await Comment.find({ comic: comicId })
        .populate('user', '-password')
        .populate('comic')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      const total = await Comment.countDocuments({ comic: comicId });

      return {
        comments,
        total,
        hasMore: offset + limit < total,
      };
    },

    myLikedComics: async (
      _: any,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const likes = await Like.find({ user: user!._id })
        .populate({
          path: 'comic',
          populate: { path: 'author', select: '-password' },
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      return likes.map((like) => like.comic);
    },
  },

  Mutation: {
    likeComic: async (
      _: any,
      { comicId }: { comicId: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.findById(comicId);
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      // Vérifier si déjà liké
      const existingLike = await Like.findOne({ user: user!._id, comic: comicId });
      if (existingLike) {
        return await Comic.findById(comicId).populate('author', '-password');
      }

      // Créer le like
      await Like.create({ user: user!._id, comic: comicId });

      // Incrémenter le compteur
      await Comic.findByIdAndUpdate(comicId, { $inc: { likesCount: 1 } });

      return await Comic.findById(comicId).populate('author', '-password');
    },

    unlikeComic: async (
      _: any,
      { comicId }: { comicId: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const like = await Like.findOne({ user: user!._id, comic: comicId });
      if (!like) {
        return await Comic.findById(comicId).populate('author', '-password');
      }

      // Supprimer le like
      await Like.findByIdAndDelete(like._id);

      // Décrémenter le compteur
      await Comic.findByIdAndUpdate(comicId, { $inc: { likesCount: -1 } });

      return await Comic.findById(comicId).populate('author', '-password');
    },

    createComment: async (
      _: any,
      { input }: { input: { comicId: string; content: string } },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.findById(input.comicId);
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      const comment = await Comment.create({
        user: user!._id,
        comic: input.comicId,
        content: input.content,
      });

      return await Comment.findById(comment._id)
        .populate('user', '-password')
        .populate('comic');
    },

    deleteComment: async (
      _: any,
      { id }: { id: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comment = await Comment.findById(id);
      if (!comment) {
        throw new NotFoundError('Commentaire non trouvé');
      }

      // Vérifier que c'est l'auteur du commentaire
      if (comment.user.toString() !== (user!._id as any).toString()) {
        throw new ForbiddenError('Vous ne pouvez pas supprimer ce commentaire');
      }

      await Comment.findByIdAndDelete(id);
      return true;
    },
  },
};
