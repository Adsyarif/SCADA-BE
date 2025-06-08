import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, RtuAssignmentDto } from './create-user.dto';
import {
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => RtuAssignmentDto)
  rtuAssignments?: RtuAssignmentDto[];
}
