import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    bio: String
    avatar: String
    country: String
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    origun
    orifan
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: UserRole!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    bio: String
    country: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User
    user(username: String!): User
    users(limit: Int, offset: Int): [User!]!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    uploadAvatar(file: String!): User!
  }
`;
