import { Inject, Injectable } from '@nestjs/common';

import { Tour, type TourCreateProps } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';

@Injectable()
export class CreateTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  execute(props: TourCreateProps): Promise<Tour> {
    const tour = Tour.create(props);
    return this.tourRepository.create(tour);
  }
}
