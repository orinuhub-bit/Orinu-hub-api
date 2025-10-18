import gql from 'graphql-tag';
import { userTypeDefs } from './user.typedefs';
import { comicTypeDefs } from './comic.typedefs';
import { interactionTypeDefs } from './interaction.typedefs';

// Type de base (Query et Mutation doivent être déclarés)
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  comicTypeDefs,
  interactionTypeDefs
];
