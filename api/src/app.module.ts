import { Module } from '@nestjs/common';
import { ToursModule } from '@/admin/tours/tours.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ToursModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
