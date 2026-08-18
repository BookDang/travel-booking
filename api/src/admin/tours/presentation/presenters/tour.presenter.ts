import { Tour } from '@/admin/tours/domain/entities';
import { TourResponseDto } from '@/admin/tours/presentation/dto/responses';

export class TourPresenter {
  static toResponse(tour: Tour): TourResponseDto {
    return {
      id: tour.id,
      code: tour.code,
      name: tour.name,
      slug: tour.slug,
      shortDescription: tour.shortDescription,
      description: tour.description,
      categoryId: tour.categoryId,
      type: tour.type,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      status: tour.status,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
      publishedAt: tour.publishedAt,
    };
  }

  static toResponseList(tours: Tour[]): TourResponseDto[] {
    return tours.map((tour) => TourPresenter.toResponse(tour));
  }
}
