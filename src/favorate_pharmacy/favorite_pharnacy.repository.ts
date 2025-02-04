import { Injectable } from "@nestjs/common";
import { FavoritePharmacyRepositoryInterface } from "./interfaces/favorite_pharmacy.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { FavoritePharmacy } from "./favorite_pharnacy.schema";
import { Model, Types } from "mongoose";
import { FavoritePharmacyEntity } from "./interfaces/favorite.pharmacy.entity";
import { CreateFavoritePharmacyDTO } from "./dto/create.favorite.pharmacy.dto";

@Injectable()
export class FavoritePharmacyRepository implements FavoritePharmacyRepositoryInterface {
    constructor(
        @InjectModel(FavoritePharmacy.name) private readonly favoritePharmacyModel: Model<FavoritePharmacy>
    ){}

    async findFavoritePharmacyByIdAndUserId(pharmacyId: Types.ObjectId, userId: Types.ObjectId): Promise<Partial<FavoritePharmacyEntity>> {
        return await this.favoritePharmacyModel.findOne({
            pharnacy_id: pharmacyId, 
            user_id: userId
        }).exec();
    }

    createFavoritePharmacy(createFavoritePharmacyDTO: CreateFavoritePharmacyDTO, userId: Types.ObjectId): Promise<Partial<FavoritePharmacyEntity>> {
        return new this.favoritePharmacyModel({
            pharnacy_id: createFavoritePharmacyDTO.pharmacy_id,
            user_id: userId
        }).save();
    }
}