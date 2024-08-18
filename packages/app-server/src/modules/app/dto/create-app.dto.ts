import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { AppType } from '../types/app-core.type';

export class CreateAppDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsEnum(AppType)
  type: AppType;
}
