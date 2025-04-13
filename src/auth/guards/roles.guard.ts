import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (!required) return true

        const user = context.switchToHttp().getRequest().user;
        return required.includes(user.role)
    }
}