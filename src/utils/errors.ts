import { GraphQLError } from 'graphql';

export class AuthenticationError extends GraphQLError {
  constructor(message: string = 'Non authentifié') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string = 'Accès interdit') {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message: string = 'Ressource non trouvée') {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}

export const requireAuth = (user: any): void => {
  if (!user) {
    throw new AuthenticationError('Vous devez être connecté');
  }
};
