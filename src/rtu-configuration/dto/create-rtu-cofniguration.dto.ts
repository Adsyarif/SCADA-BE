import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateRtuConfigurationDto {
  @ApiProperty({ example: 'RTU-001', description: 'Unique RTU name' })
  @IsString()
  rtuName: string;

  @ApiProperty({ example: -6.200000, description: 'Latitude coordinate' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.816666, description: 'Longitude coordinate' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 106.816666, description: 'radius' })
  @IsNumber()
  radius: number
}
