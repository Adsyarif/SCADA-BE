import { ApiProperty } from "@nestjs/swagger";

export class AttendanceResponse {
  @ApiProperty()
  staffId:    string;

  @ApiProperty()
  staffName:  string;

  @ApiProperty({ description: 'When the user checked in'})
  checkedIn?: Date;

  @ApiProperty({
    description: 'When the user checked out (undefined until they do)',
    required: false,
  
  })
  checkedOut?: Date
}
