import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';
import { CreateTourDto } from '@/admin/tours/presentation/dto';

@Injectable()
export class CreateTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  execute(dto: CreateTourDto): Promise<Tour> {
    const tour = Tour.create(dto);
    return this.tourRepository.create(tour);
  }
}
