import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({ example: 'Manager', description: 'Unique role name' })
    @IsString()
    roleName: string;

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'uuid' },
        example: ['perm-uuid-1', 'perm-uuid-2'],
        description: 'Array of permission IDs to assign',
      })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('all', { each: true })
    permissions: string[];
}