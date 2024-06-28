import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import schema from './graphql/index';
import * as models from './models';
import { Context } from './types'
import sequelize from './config/database';
import { logRequest } from './controllers/loggingControllers';

const PORT = process.env.PORT || 4000;

async function startServer() {

  const app: any = express();

  // Logging middleware
  app.use(logRequest);

  const httpServer = createServer(app);

  // Create a Socket.IO server with CORS configuration
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:4000'],
      methods: ['GET', 'POST'],
    }
  });

  const server = new ApolloServer({
    schema,
    context: (): Context => ({
      models,
      io,
      db: sequelize
    }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Socket.IO connection handling
  io.on('connection', (socket: Socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server', err);
});
