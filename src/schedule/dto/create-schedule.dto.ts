import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 'uuid-of-user', description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'uuid-of-shift', description: 'Shift ID' })
  @IsUUID()
  shiftId: string;
}
