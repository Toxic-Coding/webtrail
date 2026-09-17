import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller.js';
import { PeopleService } from './people.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/person.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }])
  ],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
