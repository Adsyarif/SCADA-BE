import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-role.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @ApiPropertyOptional({ description: 'New role name (optional)' })
    roleName?: string;
  
    @ApiPropertyOptional({
      type: 'array',
      items: { type: 'string', format: 'uuid' },
      description: 'New array of permission IDs (optional)',
    })
    permissions?: string[];
}