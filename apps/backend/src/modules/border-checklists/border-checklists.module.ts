import { Module } from '@nestjs/common';
import { BorderChecklistsService } from './border-checklists.service';
import { BorderChecklistsController } from './border-checklists.controller';

@Module({
  controllers: [BorderChecklistsController],
  providers: [BorderChecklistsService],
  exports: [BorderChecklistsService],
})
export class BorderChecklistsModule {}
