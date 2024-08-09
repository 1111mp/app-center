import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TokenSource, TokenType } from '../types/token.enum';
import { Transform } from 'class-transformer';

export class CreateTokenDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly owner: string;

  @IsEnum(TokenSource)
  readonly source: TokenSource;

  @IsEnum(TokenType)
  readonly type: TokenType;

  @IsNumber()
  @IsOptional()
  readonly expired?: number;

  @IsObject()
  @IsOptional()
  readonly extra?: Record<string, any>;
}

export class CreateUserTokenDto {
  @IsEnum(TokenType)
  @Transform(({ value }) => value ?? TokenType.FOREVER)
  readonly type: TokenType;

  @IsNumber()
  @IsOptional()
  readonly expired?: number;

  @IsObject()
  @IsOptional()
  readonly extra?: Record<string, any>;
}
