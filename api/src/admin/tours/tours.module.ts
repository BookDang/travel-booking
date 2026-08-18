import { Module } from '@nestjs/common';
import {
  CreateTourUseCase,
  GetTourUseCase,
  ListToursUseCase,
  PauseTourUseCase,
  PublishTourUseCase,
  RemoveTourUseCase,
  UpdateTourUseCase,
} from '@/admin/tours/application/use-cases';
import { TOUR_REPOSITORY } from '@/admin/tours/domain/repositories';
import { PrismaTourRepository } from '@/admin/tours/infrastructure/repositories';
import { ToursController } from '@/admin/tours/presentation/tours.controller';

@Module({
  controllers: [ToursController],
  providers: [
    { provide: TOUR_REPOSITORY, useClass: PrismaTourRepository },
    CreateTourUseCase,
    ListToursUseCase,
    GetTourUseCase,
    UpdateTourUseCase,
    RemoveTourUseCase,
    PublishTourUseCase,
    PauseTourUseCase,
  ],
})
export class ToursModule {}
