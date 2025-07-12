import { ApiProperty } from "@nestjs/swagger";

export class TodayAttendanceDto {
  @ApiProperty({ description: 'When the user checked in today' })
  checkedIn?: Date;

  @ApiProperty({
    description: 'When the user checked out today (undefined until they do)',
    required: false,
  })
  checkedOut?: Date;
}
