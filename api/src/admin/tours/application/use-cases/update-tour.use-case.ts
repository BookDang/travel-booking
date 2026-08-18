import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Tour, type TourUpdateProps } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';

@Injectable()
export class UpdateTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  async execute(id: string, props: TourUpdateProps): Promise<Tour> {
    const tour = await this.tourRepository.findOne(id);
    if (!tour) {
      throw new NotFoundException(`Tour #${id} not found`);
    }
    tour.updateDetails(props);
    return this.tourRepository.update(tour);
  }
}
