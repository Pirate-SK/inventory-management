import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './database/database';
import routes from './routes/index';
import { errorHandler } from './middleware/error.middleware';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.initializeDB();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use('/api/v1', routes);
    this.app.use(errorHandler);
  }

  private async initializeDB(): Promise<void> {
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  public start(): void {
    const DOCKER_HOST = 'localhost';
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server started on http://${DOCKER_HOST}:${PORT}`);
    });
  }
}

const server = new Server();
server.start();

export default server;


