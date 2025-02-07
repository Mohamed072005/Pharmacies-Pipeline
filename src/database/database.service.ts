import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.handleDatabaseEvents();
  }

  private handleDatabaseEvents() {
    this.connection.on('connected', () => {
      this.logger.log('Database connected successfully');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('Database disconnected');
    });

    this.connection.on('error', (error) => {
      this.logger.error('Database connection error:', error);
    });
  }

  getDbHandle(): Connection {
    return this.connection;
  }

  async isDatabaseConnected(): Promise<boolean> {
    return this.connection.readyState === 1;
  }

  async getDatabaseStatus() {
    const status = await this.isDatabaseConnected();
    return {
      status: status ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      details: {
        readyState: this.connection.readyState,
        host: this.connection.host,
        port: this.connection.port,
        name: this.connection.name,
      }
    };
  }
}