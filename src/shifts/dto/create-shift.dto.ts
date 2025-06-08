import { ApiProperty } from "@nestjs/swagger";
import { Matches, IsOptional, IsBoolean } from "class-validator";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateShiftDto {
  @ApiProperty({ example: "08:00", description: "Shift start time (HH:mm)" })
  @Matches(TIME_REGEX, { message: "startTime must be in HH:mm format" })
  startTime: string;

  @ApiProperty({ example: "16:30", description: "Shift end time (HH:mm)" })
  @Matches(TIME_REGEX, { message: "endTime must be in HH:mm format" })
  endTime: string;

  @ApiProperty({ example: true, description: "Whether this shift is active" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
