import Comic from '../../models/Comic';
import Chapter from '../../models/Chapter';
import Like from '../../models/Like';
import { GraphQLContext } from '../context';
import { requireAuth, ForbiddenError, NotFoundError } from '../../utils/errors';

export const comicResolvers = {
  Query: {
    comic: async (_: any, { id }: { id: string }) => {
      const comic = await Comic.findById(id).populate('author', '-password');
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      // Incrémenter les vues
      await Comic.findByIdAndUpdate(id, { $inc: { views: 1 } });

      return comic;
    },

    comics: async (
      _: any,
      {
        filter,
        sort = 'recent',
        limit = 20,
        offset = 0,
      }: {
        filter?: any;
        sort?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      const query: any = {};

      // Appliquer les filtres
      if (filter) {
        if (filter.genre && filter.genre.length > 0) {
          query.genre = { $in: filter.genre };
        }
        if (filter.language) {
          query.language = filter.language;
        }
        if (filter.author) {
          query.author = filter.author;
        }
        if (filter.status) {
          query.status = filter.status;
        } else {
          // Par défaut, afficher seulement les publiées
          query.status = 'published';
        }
        if (filter.search) {
          query.$text = { $search: filter.search };
        }
      } else {
        query.status = 'published';
      }

      // Déterminer le tri
      let sortOption: any = { createdAt: -1 };
      if (sort === 'popular') {
        sortOption = { likesCount: -1 };
      } else if (sort === 'views') {
        sortOption = { views: -1 };
      }

      const comics = await Comic.find(query)
        .populate('author', '-password')
        .sort(sortOption)
        .limit(limit)
        .skip(offset);

      const total = await Comic.countDocuments(query);

      return {
        comics,
        total,
        hasMore: offset + limit < total,
      };
    },

    myComics: async (
      _: any,
      { status }: { status?: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const query: any = { author: user!._id };
      if (status) {
        query.status = status;
      }

      return await Comic.find(query)
        .populate('author', '-password')
        .sort({ createdAt: -1 });
    },

    trendingComics: async (_: any, { limit = 10 }: { limit?: number }) => {
      // Algorithme simple : populaires de la semaine dernière
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      return await Comic.find({
        status: 'published',
        createdAt: { $gte: oneWeekAgo },
      })
        .populate('author', '-password')
        .sort({ likesCount: -1, views: -1 })
        .limit(limit);
    },
  },

  Mutation: {
    createComic: async (
      _: any,
      { input }: { input: any },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.create({
        ...input,
        author: user!._id,
      });

      return await Comic.findById(comic._id).populate('author', '-password');
    },

    updateComic: async (
      _: any,
      { id, input }: { id: string; input: any },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.findById(id);
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      // Vérifier que c'est l'auteur
      if (comic.author.toString() !== (user!._id as any).toString()) {
        throw new ForbiddenError('Vous n\'êtes pas l\'auteur de cette BD');
      }

      const updatedComic = await Comic.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).populate('author', '-password');

      return updatedComic;
    },

    deleteComic: async (
      _: any,
      { id }: { id: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.findById(id);
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      if (comic.author.toString() !== (user!._id as any).toString()) {
        throw new ForbiddenError('Vous n\'êtes pas l\'auteur de cette BD');
      }

      // Supprimer les chapitres associés
      await Chapter.deleteMany({ comic: id });
      // Supprimer les likes
      await Like.deleteMany({ comic: id });
      // Supprimer la BD
      await Comic.findByIdAndDelete(id);

      return true;
    },

    createChapter: async (
      _: any,
      { input }: { input: any },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const comic = await Comic.findById(input.comicId);
      if (!comic) {
        throw new NotFoundError('BD non trouvée');
      }

      if (comic.author.toString() !== (user!._id as any).toString()) {
        throw new ForbiddenError('Vous n\'êtes pas l\'auteur de cette BD');
      }

      const chapter = await Chapter.create({
        comic: input.comicId,
        chapterNumber: input.chapterNumber,
        title: input.title,
        pages: input.pages,
      });

      return await Chapter.findById(chapter._id).populate('comic');
    },

    deleteChapter: async (
      _: any,
      { id }: { id: string },
      { user }: GraphQLContext
    ) => {
      requireAuth(user);

      const chapter = await Chapter.findById(id).populate('comic');
      if (!chapter) {
        throw new NotFoundError('Chapitre non trouvé');
      }

      const comic = await Comic.findById(chapter.comic);
      if (!comic || comic.author.toString() !== (user!._id as any).toString()) {
        throw new ForbiddenError('Vous n\'êtes pas l\'auteur de cette BD');
      }

      await Chapter.findByIdAndDelete(id);
      return true;
    },
  },

  Comic: {
    chapters: async (parent: any) => {
      return await Chapter.find({ comic: parent._id }).sort({ chapterNumber: 1 });
    },
    isLikedByMe: async (parent: any, _: any, { user }: GraphQLContext) => {
      if (!user) return false;
      const like = await Like.findOne({ user: user._id, comic: parent._id });
      return !!like;
    },
  },
};
