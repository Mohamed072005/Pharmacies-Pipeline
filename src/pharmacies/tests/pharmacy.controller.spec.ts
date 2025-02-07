import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PharmaciesController } from '../pharmacies.controller';
import { PharmaciesService } from '../pharmacies.service';
import { Types } from 'mongoose';
import { Pharmacy } from '../schemas/pharmacy.schema';

describe('PharmaciesController', () => {
  let controller: PharmaciesController;
  let pharmaciesService: jest.Mocked<PharmaciesService>;

  // Mock data
  const mockPharmacyId = new Types.ObjectId('674ba1315bbead3ecff62934');

  const mockPharmacy: Partial<Pharmacy> = {
    _id: mockPharmacyId,
    name: 'Test Pharmacy',
    address: "Khouribga Al kods",
    contact: "contact@gmail.com",
    location: {
      type: 'Point',
      coordinates: [23, 4, 5]
    },
    openingHours: 'from 9 am to 7 pm',
    services: ["pharmacy"],
  } as Pharmacy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmaciesController],
      providers: [
        {
          provide: PharmaciesService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmaciesController>(PharmaciesController);
    pharmaciesService = module.get(PharmaciesService);
  });

  describe('findById', () => {
    it('should successfully find a pharmacy by id', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);

      // Act
      const result = await controller.findById(mockPharmacyId.toString());

      // Assert
      expect(result).toEqual(mockPharmacy);
      expect(pharmaciesService.findById).toHaveBeenCalledWith(mockPharmacyId);
    });

    it('should throw BadRequestException for invalid ObjectId', async () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      await expect(controller.findById(invalidId))
        .rejects
        .toThrow(HttpException);
    });

    it('should handle service-level HttpException', async () => {
      // Arrange
      const errorMessage = 'Pharmacy not found';
      pharmaciesService.findById.mockRejectedValue(
        new HttpException(errorMessage, HttpStatus.NOT_FOUND)
      );

      // Act & Assert
      await expect(controller.findById(mockPharmacyId.toString()))
        .rejects
        .toThrow(new HttpException({ message: errorMessage }, HttpStatus.NOT_FOUND));
    });

    it('should handle unexpected errors with Internal Server Error', async () => {
      // Arrange
      pharmaciesService.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      try {
        await controller.findById(mockPharmacyId.toString());
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.getResponse()).toBe('Internal server error');
      }
    });

    it('should correctly transform string id to ObjectId', async () => {
      // Arrange
      pharmaciesService.findById.mockResolvedValue(mockPharmacy as Pharmacy);
      const stringId = '674ba1315bbead3ecff62934';

      // Act
      await controller.findById(stringId);

      // Assert
      expect(pharmaciesService.findById).toHaveBeenCalledWith(
        expect.any(Types.ObjectId)
      );
      expect(pharmaciesService.findById.mock.calls[0][0].toString()).toBe(stringId);
    });
  });
});