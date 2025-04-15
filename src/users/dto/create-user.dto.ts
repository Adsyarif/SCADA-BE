import {
    IsString,
    IsEmail,
    IsOptional,
    IsUUID,
    MinLength,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()  
    username: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    password: string;
  
    @IsOptional()
    @IsString()
    phone_number?: string;
  
    @IsString()
    employee_number: string;
  
    @IsUUID()
    userRoleId: string;
  }
  