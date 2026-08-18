import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateTourUseCase,
  GetTourUseCase,
  ListToursUseCase,
  PauseTourUseCase,
  PublishTourUseCase,
  RemoveTourUseCase,
  UpdateTourUseCase,
} from '@/admin/tours/application/use-cases';

import { ToursController } from './tours.controller';

describe('ToursController', () => {
  let controller: ToursController;

  const useCases = [
    CreateTourUseCase,
    ListToursUseCase,
    GetTourUseCase,
    UpdateTourUseCase,
    RemoveTourUseCase,
    PublishTourUseCase,
    PauseTourUseCase,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToursController],
      providers: useCases.map((useCase) => ({
        provide: useCase,
        useValue: { execute: jest.fn() },
      })),
    }).compile();

    controller = module.get<ToursController>(ToursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
