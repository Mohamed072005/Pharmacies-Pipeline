import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export interface IProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>;
  create(createProfileDto: CreateProfileDto & { userId: string }): Promise<Profile>;
  update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile | null>;

}
