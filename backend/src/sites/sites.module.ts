import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller.js';
import { SitesService } from './sites.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schemas/site.schema.js';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }])
  ],
  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
