import { Injectable } from '@nestjs/common';
import { Tour } from '@/admin/tours/domain/entities';
import { TourRepository } from '@/admin/tours/domain/repositories';

// Scaffold only: wire up @prisma/client once Prisma + a Tour model are set up.
@Injectable()
export class PrismaTourRepository implements TourRepository {
  create(data: Partial<Tour>): Promise<Tour> {
    void data;
    throw new Error('PrismaTourRepository.create not implemented yet');
  }

  findAll(): Promise<Tour[]> {
    throw new Error('PrismaTourRepository.findAll not implemented yet');
  }

  findOne(id: string): Promise<Tour | null> {
    void id;
    throw new Error('PrismaTourRepository.findOne not implemented yet');
  }

  update(id: string, data: Partial<Tour>): Promise<Tour> {
    void id;
    void data;
    throw new Error('PrismaTourRepository.update not implemented yet');
  }

  remove(id: string): Promise<void> {
    void id;
    throw new Error('PrismaTourRepository.remove not implemented yet');
  }
}
