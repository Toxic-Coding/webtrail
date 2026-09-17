import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async record(data: {
    person: string;
    address: string;
    arrivedVia: string;
  }): Promise<Visit> {
    return this.visitModel.create(data);
  }

  async historyFor(person: string): Promise<Visit[]> {
    return this.visitModel.find({ person }).sort({ visitedAt: -1 }).lean();
  }
}
