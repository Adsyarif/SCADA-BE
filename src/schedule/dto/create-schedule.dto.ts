import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 'uuid-of-user', description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'uuid-of-shift', description: 'Shift ID' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({
    example: '2025-06-08',
    required: false,
    description: 'Date for this assignment (defaults to today)',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
