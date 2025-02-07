import { Test } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileNotFoundException } from '../exceptions/user.exceptions';
import { Types } from 'mongoose';

describe('ProfileService', () => {
  let profileService: ProfileService;
  const mockRepo = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockUserId = new Types.ObjectId();
  const mockProfile = {
    userId: mockUserId.toString(),
    bio: 'Test bio',
    avatar: 'https://example.com/avatar.png',
    theme: 'light',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: mockUserId,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProfileService, { provide: ProfileRepository, useValue: mockRepo }],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should find profile by userId', async () => {
    mockRepo.findByUserId.mockResolvedValue(mockProfile);
    const result = await profileService.findProfileByUserId(mockUserId.toString());
    expect(result).toEqual(mockProfile);
  });

  it('should throw when profile not found', async () => {
    mockRepo.findByUserId.mockResolvedValue(null);
    await expect(profileService.findProfileByUserId(mockUserId.toString())).rejects.toThrow(ProfileNotFoundException);
  });

  it('should create profile', async () => {
    mockRepo.create.mockResolvedValue(mockProfile);
    const result = await profileService.createProfile({
      userId: mockUserId.toString(),
      bio: 'Test bio',
    });
    expect(result).toEqual(mockProfile);
  });

  it('should update profile', async () => {
    const updatedProfile = { ...mockProfile, bio: 'Updated' };
    mockRepo.findByUserId.mockResolvedValue(mockProfile);
    mockRepo.update.mockResolvedValue(updatedProfile);

    const result = await profileService.updateProfile(mockUserId.toString(), {
      bio: 'Updated',
    });
    expect(result).toEqual(updatedProfile);
  });
});
