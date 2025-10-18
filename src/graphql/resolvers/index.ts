import { userResolvers } from './user.resolvers';
import { comicResolvers } from './comic.resolvers';
import { interactionResolvers } from './interaction.resolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...comicResolvers.Query,
    ...interactionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...comicResolvers.Mutation,
    ...interactionResolvers.Mutation,
  },
  Comic: comicResolvers.Comic,
};
