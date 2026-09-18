import { ConflictException, Injectable } from '@nestjs/common';
import { Site, SiteDocument } from './schemas/site.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async fundByAddress(address: string): Promise<Site | null> {
    return this.siteModel
      .findOne({ address: address.toLowerCase().trim() })
      .exec();
  }

  async create(data: {
    address: string;
    title: string;
    html: string;
    author: string;
  }): Promise<Site> {
    try {
      return await this.siteModel.create(data);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Site with address "${data.address}" already exists.`,
        );
      }
      throw error;
    }
  }

  async search(query: string): Promise<Site[]> {
    return this.siteModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .lean();
  }
}
