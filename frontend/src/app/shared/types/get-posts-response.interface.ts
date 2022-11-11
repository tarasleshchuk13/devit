import { PostInterface } from './post.interface'

export interface GetPostsResponseInterface {
    postsCount: number
    posts: PostInterface[]
}