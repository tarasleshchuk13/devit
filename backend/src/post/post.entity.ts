import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'post' })
export class PostEntity {
    
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    title: string
    
    @Column()
    content: string
    
    @Column()
    createdDate: Date
    
    @ManyToOne(() => UserEntity, user => user.posts)
    user: UserEntity
    
}