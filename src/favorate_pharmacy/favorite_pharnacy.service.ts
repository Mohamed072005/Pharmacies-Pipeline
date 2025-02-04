import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateFavoritePharmacyDTO } from "./dto/create.favorite.pharmacy.dto";
import { FavoritePharmacyRepositoryInterface } from "./interfaces/favorite_pharmacy.repository.interface";
import { FavoritePharmacyEntity } from "./interfaces/favorite.pharmacy.entity";
import { PharmaciesService } from "src/pharmacies/pharmacies.service";
import { Types } from "mongoose";
import { FavoritePharmacyServiceInterface } from "./interfaces/favorite_pharmacy.service.interface";

@Injectable()

export class FavoritePharmacyService implements FavoritePharmacyServiceInterface {
    constructor(
        @Inject('FavoritePharmacyRepositoryInterface') private readonly favoritePharmacyRepository: FavoritePharmacyRepositoryInterface,
        private readonly farmacyService: PharmaciesService
    ){}

    async handelCreateFavoritePharmacy(createFavoritePharmacyDTO: CreateFavoritePharmacyDTO, userId: Types.ObjectId): Promise<FavoritePharmacyEntity> {
        const findPharmacy = await this.farmacyService.findById(createFavoritePharmacyDTO.pharmacy_id);
        if(!findPharmacy){
            throw new HttpException('Pharmacy not found', HttpStatus.NOT_FOUND);
        }
        const favoriteAlredyExists = await this.favoritePharmacyRepository.findFavoritePharmacyByIdAndUserId(createFavoritePharmacyDTO.pharmacy_id, userId);
        if(favoriteAlredyExists){
            throw new HttpException('Favorite Pharmacy already exists', HttpStatus.CONFLICT);
        }
        const favoritePharmacy = await this.favoritePharmacyRepository.createFavoritePharmacy(createFavoritePharmacyDTO, userId);
        if(!favoritePharmacy){
            throw new HttpException('Favorite Pharmacy not created', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return favoritePharmacy as FavoritePharmacyEntity;
    }
}