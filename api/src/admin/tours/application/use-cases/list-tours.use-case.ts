import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';

@Injectable()
export class ListToursUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  execute(): Promise<Tour[]> {
    return this.tourRepository.findAll();
  }
}
