import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Pharmacy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true, 
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ required: true })
  openingHours: string;

  @Prop()
  contact: string;

  @Prop([String])
  services: string[];

  @Prop([
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  ratings: {
    user: mongoose.Schema.Types.ObjectId;
    comment: string;
    rating: number;
  }[];
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);

// Add geospatial index
PharmacySchema.index({ location: '2dsphere' });
