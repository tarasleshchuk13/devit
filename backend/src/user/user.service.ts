import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { PostService } from '../post/post.service'
import { UserDto } from './dto/user.dto'
import { UserResponseInterface } from './types/user-response.interface'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private postService: PostService,
        private configService: ConfigService
    ) {
    }
    
    async registration(registrationUserDto: UserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            where: { email: registrationUserDto.email }
        })
        
        if (userByEmail) {
            throw new BadRequestException('User with this email already exist')
        }
        
        const hashedPassword = await hash(registrationUserDto.password, 10)
        
        const newUser = this.userRepository.create({
            email: registrationUserDto.email,
            password: hashedPassword
        })
        
        await this.userRepository.save(newUser)
        await this.postService.parsePostFromRssFeedAndSave(newUser)
        
        return newUser
    }
    
    async login(loginUserDto: UserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email }
        })
        
        if (!user) {
            throw new BadRequestException('Wrong email or password')
        }
        
        const isPasswordCorrect = await compare(loginUserDto.password, user.password)
        
        if (!isPasswordCorrect) {
            throw new BadRequestException('Wrong email or password')
        }
        
        return user
    }
    
    async getUserById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { id } })
    }
    
    generateJwt(user: UserEntity): string {
        return sign({ id: user.id }, this.configService.get('JWT_SECRET'))
    }
    
    createUserResponse(user: UserEntity): UserResponseInterface {
        return { token: this.generateJwt(user) }
    }
    
}
