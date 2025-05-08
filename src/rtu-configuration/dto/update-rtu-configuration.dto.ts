import { PartialType } from '@nestjs/swagger';
import { CreateRtuConfigurationDto } from './create-rtu-cofniguration.dto';

export class UpdateRtuConfigurationDto extends PartialType(CreateRtuConfigurationDto) {}
