import { Module } from '@nestjs/common';
import { VisitsController } from './visits.controller.js';
import { VisitsService } from './visits.service.js';
import { Visit, VisitSchema } from './schemas/visit.schema.js';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }])
  ],
  controllers: [VisitsController],
  providers: [VisitsService]
})
export class VisitsModule {}
