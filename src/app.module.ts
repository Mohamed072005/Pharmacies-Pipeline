
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { ErrorHandlerMiddleware } from './common/middlewares/error-handler.middleware';
import { FavoritePharmacyModule } from './favorate_pharmacy/favorite_pharmacy.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      cache: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    FavoritePharmacyModule,
    PharmaciesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer.apply(ErrorHandlerMiddleware).forRoutes('*');
  }
}
