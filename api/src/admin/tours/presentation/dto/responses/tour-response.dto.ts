import { TourStatus, TourType } from '@/admin/tours/domain/enums';

export class TourResponseDto {
  id!: string;
  code!: string;
  name!: string;
  slug!: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  type!: TourType;
  durationDays!: number;
  durationNights!: number;
  status!: TourStatus;
  createdAt!: Date;
  updatedAt!: Date;
  publishedAt?: Date;
}
