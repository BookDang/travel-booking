import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Tour } from '@/admin/tours/domain/entities';
import { TOUR_REPOSITORY, type TourRepository } from '@/admin/tours/domain/repositories';
import { UpdateTourDto } from '@/admin/tours/presentation/dto';

@Injectable()
export class UpdateTourUseCase {
  constructor(@Inject(TOUR_REPOSITORY) private readonly tourRepository: TourRepository) {}

  async execute(id: string, dto: UpdateTourDto): Promise<Tour> {
    const tour = await this.tourRepository.findOne(id);
    if (!tour) {
      throw new NotFoundException(`Tour #${id} not found`);
    }
    return this.tourRepository.update(id, dto);
  }
}
