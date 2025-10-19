import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './config/database';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import { createContext, GraphQLContext } from './graphql/context';

// Charger les variables d'environnement
dotenv.config();

// Port du serveur
const PORT = process.env.PORT || 5000;

// Fonction de démarrage du serveur
const startServer = async (): Promise<void> => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Créer l'application Express
    const app = express();

    // Créer Apollo Server avec typage
    const apolloServer = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
    });

    // Démarrer Apollo Server
    await apolloServer.start();

    // Middlewares CORS et JSON parser
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      })
    );

    app.use(express.json());

    // Monter GraphQL endpoint avec context typé
    app.use(
      '/graphql',
      expressMiddleware<GraphQLContext>(apolloServer, {
        context: async ({ req }) => createContext({ req }),
      })
    );

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🎨 Serveur GraphQL Orinu-Hub démarré`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
      console.log('🚀 ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();
