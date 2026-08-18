import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Tour } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';

@Injectable()
export class PauseTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  async execute(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne(id);
    if (!tour) {
      throw new NotFoundException(`Tour #${id} not found`);
    }
    tour.pause();
    return this.tourRepository.update(tour);
  }
}
