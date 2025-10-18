import gql from 'graphql-tag';

export const interactionTypeDefs = gql`
  type Like {
    id: ID!
    user: User!
    comic: Comic!
    createdAt: String!
  }

  type Comment {
    id: ID!
    user: User!
    comic: Comic!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCommentInput {
    comicId: ID!
    content: String!
  }

  type CommentsConnection {
    comments: [Comment!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    comments(comicId: ID!, limit: Int, offset: Int): CommentsConnection!
    myLikedComics(limit: Int, offset: Int): [Comic!]!
  }

  extend type Mutation {
    likeComic(comicId: ID!): Comic!
    unlikeComic(comicId: ID!): Comic!
    createComment(input: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;
