import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsOptional,
    IsUUID,
    MinLength,
  } from 'class-validator';
  
  export class CreateUserDto {

    @ApiProperty({ example: 'jdoe', description: 'Unique username' })
    @IsString()  
    username: string;
    
    @ApiProperty({ example: 'jdoe@example.com', description: 'User email' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'strongPassword123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
    
    @ApiProperty({ example: '+62123456789', required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;
    
    @ApiProperty({ example: 'EMP001', description: 'Employee number' })
    @IsString()
    employee_number: string;
    
    @ApiProperty({ example: 'uuid-of-role', description: 'Role ID to assign' })
    @IsUUID()
    userRoleId: string;
  }
  