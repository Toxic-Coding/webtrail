import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SitesModule } from './sites/sites.module.js';
import { VisitsModule } from './visits/visits.module.js';
import { PeopleModule } from './people/people.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    SitesModule,
    VisitsModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}