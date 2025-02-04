import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseHealthController } from './database.health.controller';
import mongoose from 'mongoose';

// Désactiver les avertissements de Mongoose globalement
mongoose.set('strictQuery', true);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  controllers: [DatabaseHealthController],
  exports: [DatabaseService],
})
export class DatabaseModule {}