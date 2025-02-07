import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FavoritePharmacyService } from '../favorite_pharnacy.service';
import { PharmaciesService } from '../../pharmacies/pharmacies.service';
import { Types } from 'mongoose';
import { CreateFavoritePharmacyDTO } from '../dto/create.favorite.pharmacy.dto';
import { FavoritePharmacyEntity } from '../interfaces/favorite.pharmacy.entity';
import { Pharmacy } from '../../pharmacies/schemas/pharmacy.schema';

describe('FavoritePharmacyService', () => {
  let service: FavoritePharmacyService;
  let pharmaciesService: jest.Mocked<PharmaciesService>;
  let favoritePharmacyRepository: jest.Mocked<any>;

  // Mock data
  const mockUserId = new Types.ObjectId('674ba1315bbead3ecff62996');
  const mockPharmacyId = new Types.ObjectId('674ba1315bbead3ecff62934');

  const mockCreateDTO: CreateFavoritePharmacyDTO = {
    pharmacy_id: mockPharmacyId,
  };

  const mockFavoritePharmacy: FavoritePharmacyEntity = {
    id: '674ba1315bbead3ecff62908',
    pharmacyId: mockPharmacyId.toString(),
    userId: mockUserId.toString(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };

  const mockPharmacy: Partial<Pharmacy> = {
    _id: mockPharmacyId.toString(),
    name: 'Test Pharmacy',
    address: "Khouribga Al kods",
    contact: "contact@gmail.com",
    location: {
      type: 'Point',
      coordinates: [23, 4, 5]
    },
    openingHours: 'from 9 am to 7 pm',
    services: ["phrmacy"],

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritePharmacyService,
        {
          provide: PharmaciesService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: 'FavoritePharmacyRepositoryInterface',
          useValue: {
            findFavoritePharmacyByIdAndUserId: jest.fn(),
            createFavoritePharmacy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritePharmacyService>(FavoritePharmacyService);
    pharmaciesService = module.get(PharmaciesService);
    favoritePharmacyRepository = module.get('FavoritePharmacyRepositoryInterface');
  });

  describe('handelCreateFavoritePharmacy', () => {
    it('should successfully create a favorite pharmacy', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);
      favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId.mockResolvedValue(null);
      favoritePharmacyRepository.createFavoritePharmacy.mockResolvedValue(mockFavoritePharmacy);

      // Act
      const result = await service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId);

      // Assert
      expect(result).toEqual(mockFavoritePharmacy);
      expect(pharmaciesService.findById).toHaveBeenCalledWith(mockPharmacyId);
      expect(favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId).toHaveBeenCalledWith(mockPharmacyId, mockUserId);
      expect(favoritePharmacyRepository.createFavoritePharmacy).toHaveBeenCalledWith(mockCreateDTO, mockUserId);
    });

    it('should throw NOT_FOUND if pharmacy does not exist', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId))
        .rejects
        .toThrow(new HttpException('Pharmacy not found', HttpStatus.NOT_FOUND));

      expect(favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId).not.toHaveBeenCalled();
      expect(favoritePharmacyRepository.createFavoritePharmacy).not.toHaveBeenCalled();
    });

    it('should throw CONFLICT if favorite pharmacy already exists', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);
      favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId.mockResolvedValue(mockFavoritePharmacy);

      // Act & Assert
      await expect(service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId))
        .rejects
        .toThrow(new HttpException('Favorite Pharmacy already exists', HttpStatus.CONFLICT));

      expect(favoritePharmacyRepository.createFavoritePharmacy).not.toHaveBeenCalled();
    });

    it('should throw INTERNAL_SERVER_ERROR if favorite pharmacy creation fails', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);
      favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId.mockResolvedValue(null);
      favoritePharmacyRepository.createFavoritePharmacy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId))
        .rejects
        .toThrow(new HttpException('Favorite Pharmacy not created', HttpStatus.INTERNAL_SERVER_ERROR));
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);
      favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId))
        .rejects
        .toThrow();
    });

    it('should handle pharmacyService errors gracefully', async () => {
      // Arrange
      pharmaciesService.findById.mockRejectedValue(new Error('Pharmacy service error'));

      // Act & Assert
      await expect(service.handelCreateFavoritePharmacy(mockCreateDTO, mockUserId))
        .rejects
        .toThrow();
    });
  });
});