import { Types } from "mongoose";
import { FavoritePharmacyEntity } from "./favorite.pharmacy.entity";
import { CreateFavoritePharmacyDTO } from "../dto/create.favorite.pharmacy.dto";

export interface FavoritePharmacyRepositoryInterface {
    findFavoritePharmacyByIdAndUserId(pharmacyId: Types.ObjectId, userId: Types.ObjectId): Promise<Partial<FavoritePharmacyEntity>>
    createFavoritePharmacy(createFavoritePharmacyDTO: CreateFavoritePharmacyDTO, userId: Types.ObjectId): Promise<Partial<FavoritePharmacyEntity>>
}