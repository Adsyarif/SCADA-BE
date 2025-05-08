import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permisson';
export const Permission = (permission: string) => SetMetadata(PERMISSION_KEY, permission);
