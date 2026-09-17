import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitDocument = HydratedDocument<Visit>;

@Schema({ timestamps: { createdAt: 'visitedAt', updatedAt: false } })
export class Visit {
  @Prop({ type: String, required: true, trim: true })
  person: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  address: string;

  @Prop({
    type: String,
    required: true,
    enum: ['typed', 'link', 'back', 'forward', 'history'],
  })
  arrivedVia: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
