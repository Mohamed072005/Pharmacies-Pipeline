import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfileService } from '../providers/profile.service';
import { Types } from 'mongoose';
import { Profile } from '../schemas/profile.schema';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profileService: jest.Mocked<ProfileService>;

  const TEST_USER_ID = new Types.ObjectId().toString();

  const TEST_PROFILE = {
    userId: TEST_USER_ID,
    bio: 'Test bio',
    avatar: 'avatar.jpg',
    isBlocked: false,
    blockedUsers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const;

  beforeEach(async () => {
    const mockProfileService = {
      findProfileByUserId: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profileService = module.get(ProfileService);

    jest.clearAllMocks();
  });

  describe('getProfileByUserId', () => {
    it('should return profile for given user id', async () => {
      profileService.findProfileByUserId.mockResolvedValue(TEST_PROFILE as unknown as Profile);

      const result = await controller.getProfileByUserId(TEST_USER_ID);

      expect(profileService.findProfileByUserId).toHaveBeenCalledWith(TEST_USER_ID);
      expect(result).toEqual(TEST_PROFILE);
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto = {
      bio: 'Updated bio',
      avatar: 'new-avatar.jpg',
    };

    it('should update and return profile', async () => {
      const updatedProfile = {
        ...TEST_PROFILE,
        ...updateProfileDto,
      } as unknown as Profile;
      profileService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile(TEST_USER_ID, updateProfileDto);

      expect(profileService.updateProfile).toHaveBeenCalledWith(TEST_USER_ID, updateProfileDto);
      expect(result).toEqual(updatedProfile);
    });
  });


});
