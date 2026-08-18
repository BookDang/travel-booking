import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { TourType } from '@/admin/tours/domain/enums';

export class UpdateTourDto {
  @IsString()
  @IsOptional()
  name?: string;

  /** `undefined` = leave unchanged, `null` = clear the field. */
  @IsString()
  @IsOptional()
  shortDescription?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsEnum(TourType)
  @IsOptional()
  type?: TourType;

  @IsInt()
  @Min(1)
  @IsOptional()
  durationDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  durationNights?: number;
}
