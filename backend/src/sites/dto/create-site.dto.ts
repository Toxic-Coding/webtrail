import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9.-]+$/, {
    message: 'address may only contain lowercase letters, numbers, dots, and hyphens',
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}