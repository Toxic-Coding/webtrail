import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SitesService } from './sites.service.js';
import { CreateSiteDto } from './dto/create-site.dto.js';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get(':address')
  async getByAddress(@Param('address') address: string) {
    const site = await this.sitesService.fundByAddress(address);
    if (!site) {
      throw new NotFoundException(`No site at address "${address}"`);
    }
    return site;
  }

  @Post()
  async publish(
    @Body()
    body: CreateSiteDto,
  ) {
    return this.sitesService.create(body);
  }

  @Get('search/:query')
  async search(@Param('query') query: string) {
    return this.sitesService.search(query);
  }
}
