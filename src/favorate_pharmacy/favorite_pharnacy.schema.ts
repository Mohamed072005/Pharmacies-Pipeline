import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type FavoritePharmacyDocument = HydratedDocument<FavoritePharmacy>

@Schema({
    collection: 'favorite_pharmacys',
    timestamps: true,
})
export class FavoritePharmacy {
    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'pharmacys', required: true })
    pharnacy_id: Types.ObjectId
}

export const FavoritePharmacySchema = SchemaFactory.createForClass(FavoritePharmacy)