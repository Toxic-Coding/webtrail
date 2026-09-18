import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
