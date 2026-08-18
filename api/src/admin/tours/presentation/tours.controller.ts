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
import { CreateTourDto, UpdateTourDto } from '@/admin/tours/presentation/dto';
import { TourDomainExceptionFilter } from '@/admin/tours/presentation/filters';

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
  create(@Body() createTourDto: CreateTourDto) {
    return this.createTourUseCase.execute(createTourDto);
  }

  @Get()
  findAll() {
    return this.listToursUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getTourUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.updateTourUseCase.execute(id, updateTourDto);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.publishTourUseCase.execute(id);
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.pauseTourUseCase.execute(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeTourUseCase.execute(id);
  }
}
