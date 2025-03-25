import { IsString, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsString()
  employee_number: string;

  @IsString()
  userRoleId: string;
}
