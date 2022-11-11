import { PostInterface } from './post.interface'

export interface PostWithContentInterface extends PostInterface {
    content: string
}