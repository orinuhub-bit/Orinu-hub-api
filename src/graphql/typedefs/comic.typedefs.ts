import gql from 'graphql-tag';

export const comicTypeDefs = gql`
  type Comic {
    id: ID!
    title: String!
    description: String!
    coverImage: String!
    genre: [String!]!
    language: String!
    tags: [String!]!
    author: User!
    views: Int!
    likesCount: Int!
    status: ComicStatus!
    chapters: [Chapter!]!
    isLikedByMe: Boolean
    createdAt: String!
    updatedAt: String!
  }

  enum ComicStatus {
    draft
    published
  }

  type Chapter {
    id: ID!
    comic: Comic!
    chapterNumber: Int!
    title: String!
    pages: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateComicInput {
    title: String!
    description: String!
    coverImage: String!
    genre: [String!]!
    language: String!
    tags: [String!]
    status: ComicStatus
  }

  input UpdateComicInput {
    title: String
    description: String
    coverImage: String
    genre: [String!]
    language: String
    tags: [String!]
    status: ComicStatus
  }

  input CreateChapterInput {
    comicId: ID!
    chapterNumber: Int!
    title: String!
    pages: [String!]!
  }

  input ComicsFilterInput {
    genre: [String!]
    language: String
    author: String
    status: ComicStatus
    search: String
  }

  enum ComicSortBy {
    recent
    popular
    views
  }

  type ComicsConnection {
    comics: [Comic!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    comic(id: ID!): Comic
    comics(
      filter: ComicsFilterInput
      sort: ComicSortBy
      limit: Int
      offset: Int
    ): ComicsConnection!
    myComics(status: ComicStatus): [Comic!]!
    trendingComics(limit: Int): [Comic!]!
  }

  extend type Mutation {
    createComic(input: CreateComicInput!): Comic!
    updateComic(id: ID!, input: UpdateComicInput!): Comic!
    deleteComic(id: ID!): Boolean!
    createChapter(input: CreateChapterInput!): Chapter!
    deleteChapter(id: ID!): Boolean!
  }
`;
