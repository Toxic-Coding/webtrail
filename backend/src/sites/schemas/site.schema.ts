import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  address: string;

  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true })
  html: string;

  @Prop({ type: String, required: true })
  author: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

SiteSchema.index({ title: 'text', html: 'text' });
