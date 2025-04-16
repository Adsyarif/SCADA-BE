import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { PermissionDto } from './dto/permissions.dto';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
    constructor (
        private readonly perms: PermissionsService,
    
    ) {}

    @Get()
    @Permissions('manage_roles')
    findAll(): Promise<PermissionDto[]> {
        return this.perms.findAll();
      }
}
