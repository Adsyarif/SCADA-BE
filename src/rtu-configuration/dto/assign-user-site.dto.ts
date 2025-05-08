import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignUserSiteDto {
  @ApiProperty({ example: 'user-uuid-123', description: 'ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'rtu-uuid-456', description: 'ID of the RTU' })
  @IsUUID()
  rtuId: string;
}
