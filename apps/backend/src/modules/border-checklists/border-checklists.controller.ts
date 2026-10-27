import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorderChecklistsService } from './border-checklists.service';
import { GetBorderChecklistDto } from './dto/get-border-checklist.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Border Checklists')
@Controller('border-checklists')
export class BorderChecklistsController {
  constructor(private readonly borderChecklistsService: BorderChecklistsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xalqaro reyslar uchun chegara talablari va chek-listlarini olish' })
  @ApiResponse({ status: 200, description: 'Chegara chek-listlari ro`yxati' })
  async getChecklists(@Query() query: GetBorderChecklistDto) {
    return this.borderChecklistsService.getChecklists(query.from, query.to);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Chek-list IDsi bo`yicha batafsil ma`lumot olish' })
  @ApiResponse({ status: 200, description: 'Chek-list ma`lumotlari' })
  async getChecklistById(@Param('id') id: string) {
    return this.borderChecklistsService.getChecklistById(id);
  }
}
