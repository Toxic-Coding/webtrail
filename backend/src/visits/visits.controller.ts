import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VisitsService } from './visits.service.js';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  async record(
    @Body() body: { person: string; address: string; arrivedVia: string },
  ) {
    return this.visitsService.record(body);
  }

  @Get(`:person`)
  async historyFor(@Param('person') person: string) {
    return this.visitsService.historyFor(person);
  }
}
