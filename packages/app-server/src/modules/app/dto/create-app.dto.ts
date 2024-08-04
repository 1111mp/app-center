import { IsString } from 'class-validator';

export class CreateAppDto {
  @IsString()
  key: string;

  @IsString()
  name: string;
}
