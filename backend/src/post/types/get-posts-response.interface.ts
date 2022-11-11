import { PostEntity } from '../post.entity'

export interface GetPostsResponseInterface {
    postsCount: number,
    posts: PostEntity[]
}