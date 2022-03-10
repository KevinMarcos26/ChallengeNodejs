import express from 'express';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { SongResolver } from "./resolvers/SongResolver";
import { ArtistResolver } from './resolvers/artist.resolver';
import { AuthResolver } from './resolvers/auth.resolver';



export async function startServer() {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({ resolvers: [SongResolver, ArtistResolver, AuthResolver] }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, path: '/graphql' })

    return app;
};