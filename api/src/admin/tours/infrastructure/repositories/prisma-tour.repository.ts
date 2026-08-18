import { Injectable } from '@nestjs/common';

import { Tour, type TourPersistenceProps } from '@/admin/tours/domain/entities';
import type { TourStatus, TourType } from '@/admin/tours/domain/enums';
import { TourRepository } from '@/admin/tours/domain/repositories';
import { TourMapper } from '@/admin/tours/infrastructure/mappers';
import type { Tour as TourRow } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma';

@Injectable()
export class PrismaTourRepository implements TourRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tour: Tour): Promise<Tour> {
    const row = await this.prisma.tour.create({ data: TourMapper.toPersistence(tour) });
    return TourMapper.toDomain(this.fromRow(row));
  }

  async findAll(): Promise<Tour[]> {
    const rows = await this.prisma.tour.findMany();
    return rows.map((row) => TourMapper.toDomain(this.fromRow(row)));
  }

  async findOne(id: string): Promise<Tour | null> {
    const row = await this.prisma.tour.findUnique({ where: { id } });
    return row ? TourMapper.toDomain(this.fromRow(row)) : null;
  }

  async update(tour: Tour): Promise<Tour> {
    const row = await this.prisma.tour.update({
      where: { id: tour.id },
      data: TourMapper.toPersistence(tour),
    });
    return TourMapper.toDomain(this.fromRow(row));
  }

  async remove(id: string): Promise<void> {
    await this.prisma.tour.delete({ where: { id } });
  }

  /** Normalizes Prisma's `null` (SQL NULL) into the domain's `undefined` (field not set). */
  private fromRow(row: TourRow): TourPersistenceProps {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      slug: row.slug,
      shortDescription: row.shortDescription ?? undefined,
      description: row.description ?? undefined,
      categoryId: row.categoryId ?? undefined,
      type: row.type as TourType,
      durationDays: row.durationDays,
      durationNights: row.durationNights,
      status: row.status as TourStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt ?? undefined,
    };
  }
}
