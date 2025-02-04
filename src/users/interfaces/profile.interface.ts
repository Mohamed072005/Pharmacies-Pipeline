import { Profile } from '../schemas/profile.schema';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export interface IProfileService {
  findProfileByUserId(userId: string): Promise<Profile>;
  updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile>;
 
}
