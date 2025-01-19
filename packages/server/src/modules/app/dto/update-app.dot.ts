import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { logoValidator } from '../validator/logo.validator';
import { AppType } from '../types/app-core.type';

export class UpdateAppDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(AppType)
  @IsOptional()
  type?: AppType;

  @logoValidator()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  testUser?: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  admins?: string[];

  @IsString()
  @IsOptional()
  startLocation?: string;

  @IsString()
  @IsOptional()
  testVersion?: string;

  @IsString()
  @IsOptional()
  currentVersion?: string;
}
