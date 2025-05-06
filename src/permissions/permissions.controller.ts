import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/decorators/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { PermissionDto } from './dto/permissions.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
    constructor (
        private readonly perms: PermissionsService,
    
    ) {}

    @Get()
    @Permission('manage:roles')
    findAll(): Promise<PermissionDto[]> {
        return this.perms.findAll();
      }
}
