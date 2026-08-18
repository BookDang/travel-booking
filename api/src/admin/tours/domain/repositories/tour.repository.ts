import { Tour } from '@/admin/tours/domain/entities';

export const TOUR_REPOSITORY = Symbol('TOUR_REPOSITORY');

export interface TourRepository {
  create(tour: Tour): Promise<Tour>;
  findAll(): Promise<Tour[]>;
  findOne(id: string): Promise<Tour | null>;
  update(tour: Tour): Promise<Tour>;
  remove(id: string): Promise<void>;
}
