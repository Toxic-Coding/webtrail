import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsString()
  @IsNotEmpty()
  person: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsIn(['typed', 'link', 'back', 'forward', 'history'])
  arrivedVia: string;
}