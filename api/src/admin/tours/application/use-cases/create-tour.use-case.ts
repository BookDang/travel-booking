import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '@/admin/tours/domain/entities';
import { TourStatus } from '@/admin/tours/domain/enums';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';
import { CreateTourDto } from '@/admin/tours/presentation/dto';

@Injectable()
export class CreateTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  execute(dto: CreateTourDto): Promise<Tour> {
    return this.tourRepository.create({
      ...dto,
      status: TourStatus.DRAFT,
    });
  }
}
