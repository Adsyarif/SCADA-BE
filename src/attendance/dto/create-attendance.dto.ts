import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateAttendanceRequest {
  @ApiProperty({ example: -6.2000 })
  @IsNumber() latitude: number;

  @ApiProperty({ example: 106.8167 })
  @IsNumber() longitude: number;
}
