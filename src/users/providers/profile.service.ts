import { Injectable } from '@nestjs/common';
import { IProfileService } from '../interfaces/profile.interface';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileNotFoundException } from '../exceptions/user.exceptions';
import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  /**
   * Finds a user's profile by their ID
   * @param userId - The user's ID
   * @throws ProfileNotFoundException if the profile doesn't exist
   * @returns The user's profile
   */
  async findProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return profile;
  }

  /**
   * Creates a new profile for a user
   * @param createProfileDto - Profile data to create + user ID
   * @returns The created profile with default parameters (theme: 'light', isBlocked: false)
   */
  async createProfile(createProfileDto: CreateProfileDto & { userId: string }): Promise<Profile> {
    return this.profileRepository.create({
      ...createProfileDto,
      theme: 'light',
    });
  }

  /**
   * Updates a user's profile
   * @param userId - ID of the user whose profile needs to be updated
   * @param updateProfileDto - New profile data
   * @throws ProfileNotFoundException if the profile doesn't exist
   * @returns The updated profile
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new ProfileNotFoundException();
    }

    const updatedProfile = await this.profileRepository.update(userId, updateProfileDto);

    return updatedProfile;
  }


}
