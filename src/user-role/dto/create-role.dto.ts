import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";

export class CreateRoleDto {
    @IsString()
    roleName: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('all', { each: true })
    permissions: string[];
}