import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { UserService } from './providers/user.service';
import { UsersController } from './controllers/users.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfileService } from './providers/profile.service';
import { UserRepository } from './repositories/user.repository';
import { ProfileRepository } from './repositories/profile.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }])],
  controllers: [UsersController, ProfilesController],
  providers: [UserService, ProfileService, UserRepository, ProfileRepository],
  exports: [UserService],
})
export class UsersModule {}
  