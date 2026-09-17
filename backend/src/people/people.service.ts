import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Person, PersonDocument } from './schemas/person.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
  ) {}

  async findAll(): Promise<Person[]> {
    return this.personModel.find().sort({ name: 1 }).lean();
  }
}
