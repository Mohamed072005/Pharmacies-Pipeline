import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function validateObjectId(id: string): Types.ObjectId {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return new Types.ObjectId(id);
  } catch  {
    throw new BadRequestException('Invalid ID format');
  }
} 