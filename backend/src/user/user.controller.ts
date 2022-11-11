import { Body, Controller, Post } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { UserResponseInterface } from './types/user-response.interface'
import { UserService } from './user.service'

@Controller()
export class UserController {
    
    constructor(private userService: UserService) {
    }
    
    @Post('registration')
    async registration(
        @Body() registrationUserDto: UserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.registration(registrationUserDto)
        return this.userService.createUserResponse(user)
    }
    
    @Post('login')
    async login(@Body() loginUserDto: UserDto): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginUserDto)
        return this.userService.createUserResponse(user)
    }
    
}
