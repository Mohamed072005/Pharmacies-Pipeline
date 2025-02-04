import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
