import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateFavoritePharmacyDTO {
    @IsNotEmpty()
    @IsMongoId()
    pharmacy_id: Types.ObjectId
}