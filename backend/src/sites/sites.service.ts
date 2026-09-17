import { Injectable } from '@nestjs/common';
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

  async create(date: {
    address: string;
    title: string;
    html: string;
    author: string;
  }): Promise<Site> {
    const createdSite = new this.siteModel(date);
    return createdSite.save();
  }

  async search(query: string): Promise<Site[]> {
    return this.siteModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .lean();
  }
}
