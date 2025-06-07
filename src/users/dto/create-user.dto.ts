import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RtuAssignmentDto {
  @ApiProperty({ example: 'uuid-of-rtu-1', description: 'RTU ID to assign' })
  @IsUUID()
  rtuId: string;

  @ApiProperty({ example: true, description: 'Whether user can check in to this RTU' })
  @IsBoolean()
  checkInStatus: boolean;
}

export class CreateUserDto {
  @ApiProperty({ example: 'jdoe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'jdoe@example.com', description: 'Unique email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secretPass123', description: 'Password (plain)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '+628123456789',
    required: false,
    description: 'Mobile phone number',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({
    example: '+622199887766',
    required: false,
    description: 'Office phone number',
  })
  @IsOptional()
  @IsString()
  office_phone_number?: string;

  @ApiProperty({
    example: 'Jl. Merdeka No. 10',
    required: false,
    description: 'Home address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'EMP001', description: 'Employee number' })
  @IsString()
  employee_number: string;

  @ApiProperty({ example: '32771982739812718279', description: 'NIK' })
  @IsString()
  nik: string;

  @ApiProperty({ example: 'uuid-of-role-abc', description: 'Role ID' })
  @IsUUID()
  userRoleId: string;

  @ApiProperty({
    description: 'RTU assignments for this user',
    type: RtuAssignmentDto,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => RtuAssignmentDto)
  rtuAssignments: RtuAssignmentDto[];
}
