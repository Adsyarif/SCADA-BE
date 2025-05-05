import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissonsCode';
export const Permissions = (code: string) => SetMetadata(PERMISSION_KEY, code);
