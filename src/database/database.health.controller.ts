import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('health')
export class DatabaseHealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('database')
  async checkDatabase() {
    return await this.databaseService.getDatabaseStatus();
  }
}