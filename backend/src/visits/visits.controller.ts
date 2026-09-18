import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { VisitsService } from './visits.service.js';
import { CreateVisitDto } from './dto/create-visit.dto.js';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  async record(
    @Body() body: CreateVisitDto,
  ) {
    return this.visitsService.record(body);
  }

  @Get(`:person`)
  async historyFor(@Param('person') person: string) {
    return this.visitsService.historyFor(person);
  }

   @Delete(':person/:id')
  async deleteOne(@Param('person') person: string, @Param('id') id: string) {
    await this.visitsService.deleteOne(person, id);
    return { deleted: 1 };
  }

  @Delete(':person')
  async deleteBulk(
    @Param('person') person: string,
    @Query('ids') ids?: string,
    @Query('range') range?: '15m' | '1h' | '24h' | 'all',
  ) {
    if (ids) {
      const deleted = await this.visitsService.deleteMany(person, ids.split(','));
      return { deleted };
    }
    if (range) {
      const deleted = await this.visitsService.deleteByRange(person, range);
      return { deleted };
    }
    return { deleted: 0 };
  }
}
