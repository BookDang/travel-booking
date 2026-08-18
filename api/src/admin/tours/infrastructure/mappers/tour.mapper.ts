import type { TourPersistenceProps } from '@/admin/tours/domain/entities';
import { Tour } from '@/admin/tours/domain/entities';

export class TourMapper {
  static toPersistence(tour: Tour): TourPersistenceProps {
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

  static toDomain(props: TourPersistenceProps): Tour {
    return Tour.reconstitute(props);
  }
}
