import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ExpressRequestInterface } from '../types/express-request.interface'

@Injectable()
export class AuthGuard implements CanActivate {
    
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<ExpressRequestInterface>()
        
        if (request.user) {
            return true
        }
        
        throw new UnauthorizedException('User is not authorized')
    }
    
}
