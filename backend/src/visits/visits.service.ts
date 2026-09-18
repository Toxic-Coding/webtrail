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

  async deleteOne(person: string, id: string): Promise<void> {
    await this.visitModel.deleteOne({ _id: id, person });
  }

  async deleteMany(person: string, ids: string[]): Promise<number> {
    const result = await this.visitModel.deleteMany({
      _id: { $in: ids },
      person,
    });
    return result.deletedCount;
  }

  async deleteByRange(
    person: string,
    range: '15m' | '1h' | '24h' | 'all',
  ): Promise<number> {
    const filter: any = { person };
    if (range !== 'all') {
      const minutes = { '15m': 15, '1h': 60, '24h': 24 * 60 }[range];
      filter.visitedAt = { $gte: new Date(Date.now() - minutes * 60 * 1000) };
    }
    const result = await this.visitModel.deleteMany(filter);
    return result.deletedCount;
  }
}
