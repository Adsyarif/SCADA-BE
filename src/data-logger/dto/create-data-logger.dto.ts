import { IsInt, IsNumber, IsString, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDataLoggerDto {
  @ApiProperty({ description: 'RTU Engine ID' })
  @IsString()
  rtuEngineId: string;

  @ApiProperty()   @IsInt() flow_line_dia:  number;
  @ApiProperty()   @IsInt() setting_press:  number;
  @ApiProperty()   @IsInt() tank_cap:       number;
  @ApiProperty()   @IsInt() flow_rate:      number;
  @ApiProperty()   @IsNumber() flow_factor:  number;
  @ApiProperty()   @IsNumber() tbg_temp:     number;
  @ApiProperty()   @IsNumber() tbg_press:    number;
  @ApiProperty()   @IsBoolean() leu_status:  boolean;
  @ApiProperty()   @IsNumber() pump_press:   number;
  @ApiProperty()   @IsNumber() tank_level:   number;
  @ApiProperty()   @IsNumber() flow_capacity:number;
}
