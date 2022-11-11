import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { UserService } from '../user.service'
import { ExpressRequestInterface } from '../types/express-request.interface'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
    constructor(private userService: UserService, private configService: ConfigService) {
    }
    
    async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            
            return next()
        }
        
        const token = req.headers.authorization.split(' ')[1]
        
        try {
            const decode = verify(token, this.configService.get('JWT_SECRET'))
            
            if (typeof decode == 'string') {
                return req.user = null
            }
            
            req.user = await this.userService.getUserById(decode.id)
        } catch {
            req.user = null
        }
        
        next()
    }
    
}
