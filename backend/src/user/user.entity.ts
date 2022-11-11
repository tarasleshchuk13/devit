import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { PostEntity } from '../post/post.entity'

@Entity({ name: 'user' })
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    email: string
    
    @Column()
    password: string
    
    @OneToMany(() => PostEntity, post => post.user,)
    posts: PostEntity[]
    
}