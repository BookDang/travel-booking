import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters } from '@nestjs/common';

import {
  CreateTourUseCase,
  GetTourUseCase,
  ListToursUseCase,
  PauseTourUseCase,
  PublishTourUseCase,
  RemoveTourUseCase,
  UpdateTourUseCase,
} from '@/admin/tours/application/use-cases';
import { CreateTourDto, TourResponseDto, UpdateTourDto } from '@/admin/tours/presentation/dto';
import { TourDomainExceptionFilter } from '@/admin/tours/presentation/filters';
import { TourPresenter } from '@/admin/tours/presentation/presenters';

@Controller('tours')
@UseFilters(TourDomainExceptionFilter)
export class ToursController {
  constructor(
    private readonly createTourUseCase: CreateTourUseCase,
    private readonly listToursUseCase: ListToursUseCase,
    private readonly getTourUseCase: GetTourUseCase,
    private readonly updateTourUseCase: UpdateTourUseCase,
    private readonly removeTourUseCase: RemoveTourUseCase,
    private readonly publishTourUseCase: PublishTourUseCase,
    private readonly pauseTourUseCase: PauseTourUseCase,
  ) {}

  @Post()
  async create(@Body() createTourDto: CreateTourDto): Promise<TourResponseDto> {
    const tour = await this.createTourUseCase.execute(createTourDto);
    return TourPresenter.toResponse(tour);
  }

  @Get()
  async findAll(): Promise<TourResponseDto[]> {
    const tours = await this.listToursUseCase.execute();
    return TourPresenter.toResponseList(tours);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TourResponseDto> {
    const tour = await this.getTourUseCase.execute(id);
    return TourPresenter.toResponse(tour);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
  ): Promise<TourResponseDto> {
    const tour = await this.updateTourUseCase.execute(id, updateTourDto);
    return TourPresenter.toResponse(tour);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string): Promise<TourResponseDto> {
    const tour = await this.publishTourUseCase.execute(id);
    return TourPresenter.toResponse(tour);
  }

  @Patch(':id/pause')
  async pause(@Param('id') id: string): Promise<TourResponseDto> {
    const tour = await this.pauseTourUseCase.execute(id);
    return TourPresenter.toResponse(tour);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.removeTourUseCase.execute(id);
  }
}
