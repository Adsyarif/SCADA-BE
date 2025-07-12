import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AttendanceInitDto {
  @ApiProperty({ description: "RTU latitude" })
  latitude: number;

  @ApiProperty({ description: "RTU longitude" })
  longitude: number;

  @ApiProperty({ description: "RTU valid radius (meters)" })
  radius: number;

  @ApiProperty({ description: "Shift start time (today, ISO)" })
  shiftStart: Date;

  @ApiProperty({ description: "Shift end time (today, ISO)" })
  shiftEnd: Date;

  @ApiPropertyOptional({ description: "When user checked in today (ISO)" })
  checkedIn?: Date;

  @ApiPropertyOptional({ description: "When user checked out today (ISO)" })
  checkedOut?: Date;
}
