import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateDefinitionDto {
  @ApiProperty({ example: 'uuid-of-rtu' })
  @IsUUID() rtuId: string;

  @ApiProperty({ example: 'uuid-of-shift' })
  @IsUUID() shiftId: string;

  @ApiProperty({ example: ['Mon','Tue','Wed'], isArray: true })
  @IsArray() @ArrayNotEmpty() @ArrayUnique() @IsString({ each: true })
  daysOfWeek: string[];

  @ApiProperty({
    example: ['uuid-site-1','uuid-site-2'],
    description: 'Which users get check-in enabled',
    isArray: true,
  })
  @IsArray() @ArrayNotEmpty() @ArrayUnique() @IsUUID('4', { each: true })
  userSiteIds: string[];
}
