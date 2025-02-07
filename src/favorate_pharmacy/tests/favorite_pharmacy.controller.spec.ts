import { CreateFavoritePharmacyDTO } from '../dto/create.favorite.pharmacy.dto';
import mongoose, { Model } from 'mongoose';
import { FavoritePharmacyController } from '../favorite_pharnacy.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FavoritePharmacyService } from '../favorite_pharnacy.service';
import { FavoritePharmacyRepository } from '../favorite_pharnacy.repository';
import { FavoritePharmacyEntity } from '../interfaces/favorite.pharmacy.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PharmaciesModule } from '../../pharmacies/pharmacies.module';
import { FavoritePharmacy } from '../favorite_pharnacy.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mockCreateFavoritePharmacy: CreateFavoritePharmacyDTO = {
  pharmacy_id: new mongoose.Types.ObjectId('674ba1315bbead3ecff62934'),
};
const mockFavoritePharmacy: FavoritePharmacyEntity = {
  id: '674ba1315bbead3ecff62908',
  pharmacyId: '674ba1315bbead3ecff62222',
  userId: '674ba1315bbead3ecff62955',
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
};

describe('FavoritePharmacyController', () => {
  let controller: FavoritePharmacyController;
  let favoritePharmacyService: jest.Mocked<FavoritePharmacyService>;
  let favoritePharmacyModel: Model<FavoritePharmacyEntity>;
  let mongod: MongoMemoryServer;


  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        PharmaciesModule,
      ],
      controllers: [FavoritePharmacyController],
      providers: [
        {
          provide: 'FavoritePharmacyServiceInterface',
          useClass: FavoritePharmacyService,
        },
        {
          provide: 'FavoritePharmacyRepositoryInterface',
          useClass: FavoritePharmacyRepository,
        },
        {
          provide: getModelToken(FavoritePharmacy.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            save: jest.fn(),
            new: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoritePharmacyController>(FavoritePharmacyController);
    favoritePharmacyService = module.get('FavoritePharmacyServiceInterface');
    favoritePharmacyService.handelCreateFavoritePharmacy = jest.fn();
  });

  afterEach(async () => {
    // Cleanup MongoDB instance after tests
    await mongod.stop();
  });

  describe('Create Favorite Pharmacy Method', () => {
    it('should return status 201, the favorite pharmacy is created', async () => {
      const favoritePharmacy = mockFavoritePharmacy;
      favoritePharmacyService.handelCreateFavoritePharmacy.mockResolvedValue(favoritePharmacy);

      const result = await controller.createFavoritePharmacy(mockCreateFavoritePharmacy);

      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.message).toEqual('Favorite Pharmacy Created Successfully');
      expect(result.favorite_pharmacy).toEqual(mockFavoritePharmacy);
    });

    it('should handle service-level HttpException', async () => {
      const errorMessage = 'Pharmacy already favorited';
      favoritePharmacyService.handelCreateFavoritePharmacy.mockRejectedValue(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
      );

      await expect(controller.createFavoritePharmacy(mockCreateFavoritePharmacy))
        .rejects
        .toThrow(HttpException);
    });

    it('should handle unexpected errors', async () => {
      favoritePharmacyService.handelCreateFavoritePharmacy.mockRejectedValue(
        new Error('Database connection failed')
      );

      try {
        await controller.createFavoritePharmacy(mockCreateFavoritePharmacy);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.getResponse()).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          error: 'Database connection failed'
        });
      }
    });
  });
});