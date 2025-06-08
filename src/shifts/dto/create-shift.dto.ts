import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: '08:00', description: 'Shift start time (ISO or HH:mm)' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '16:00', description: 'Shift end time (ISO or HH:mm)' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: true, description: 'Whether this shift is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
