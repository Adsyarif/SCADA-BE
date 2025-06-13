import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class RtuApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()
        const apiKey = req.headers['x-api-key']
        if (apiKey !== process.env.RTU_API_KEY) {
            throw new UnauthorizedException('Invalid RTU API key')
        }
        return true
    }
}