import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  collection: 'profiles',
  timestamps: true,
})
export class Profile extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  bio?: string;

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
