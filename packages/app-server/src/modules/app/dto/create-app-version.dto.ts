import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Resource } from '../types/app-version.type';

export class CreateAppVersionDto {
  @IsString()
  @MinLength(1)
  version: string;

  @IsNotEmpty()
  resources: Resource;

  @IsString()
  @IsOptional()
  desc?: string;

  @Transform(({ value }) => value ?? Date.now())
  createAt: number;

  @IsOptional()
  config: Record<string, string>;
}
