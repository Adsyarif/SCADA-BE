import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { PermissionsService } from './permissions.service';
import { Permissions } from 'src/auth/decorators/permission.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
    constructor (private readonly perms: PermissionsService) {}

    @Get()
    @Permissions('manage_roles')
    findAll() {
        return this.perms.findAll();
    }
}
