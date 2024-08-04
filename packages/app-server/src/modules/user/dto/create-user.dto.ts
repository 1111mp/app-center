import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly authId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  displayName?: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  provider: string;
}
