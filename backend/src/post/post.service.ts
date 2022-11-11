import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as Parser from 'rss-parser'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { EditPostDto } from './dto/edit-post.dto'
import { PostEntity } from './post.entity'
import { GetPostsQueryInterface } from './types/get-posts-query.interface'
import { GetPostsResponseInterface } from './types/get-posts-response.interface'
import { PostFromRssFeedInterface } from './types/post-from-rss-feed.interface'

@Injectable()
export class PostService {
    
    constructor(@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>) {
    }
    
    async parsePostFromRssFeedAndSave(user: UserEntity) {
        const parser = new Parser()
        const data = await parser.parseURL('https://lifehacker.com/rss')
        const postsFromRssFeed: PostFromRssFeedInterface[] = <PostFromRssFeedInterface[]>data.items
        
        const posts = postsFromRssFeed.map((postFromRssFeed) => {
            return this.postRepository.create({
                title: postFromRssFeed.title,
                content: postFromRssFeed.content,
                createdDate: new Date(postFromRssFeed.pubDate),
                user
            })
        })
        
        await this.postRepository.save(posts)
    }
    
    async getAllPosts(
        currentUserId: number,
        queryParams: GetPostsQueryInterface
    ): Promise<GetPostsResponseInterface> {
        const createdDateOrder = queryParams.dateOrder === 'asc' ? 'ASC' : 'DESC'
        
        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .andWhere('user.id = :id', { id: currentUserId })
            .orderBy('post.createdDate', createdDateOrder)
            .select(['post.id', 'post.title', 'post.createdDate'])
        
        if (queryParams.search) {
            queryBuilder.andWhere(
                'LOWER(post.title) LIKE LOWER(:search)',
                { search: `%${queryParams.search}%` }
            )
        }
        
        const postsCount = await queryBuilder.getCount()
        
        if (queryParams.limit) {
            queryBuilder.limit(+queryParams.limit)
        }
        
        if (queryParams.offset) {
            queryBuilder.offset(+queryParams.offset)
        }
        
        const posts = await queryBuilder.getMany()
        return { postsCount, posts }
    }
    
    async getPostById(currentUserId: number, postId: number): Promise<PostEntity> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user']
        })
        
        if (!post) {
            throw new NotFoundException('Post not found')
        }
        
        if (post.user.id !== currentUserId) {
            throw new ForbiddenException('You do not have access to this post')
        }
        
        delete post.user
        return post
    }
    
    async createPost(currentUser: UserEntity, createPostDto: CreatePostDto): Promise<PostEntity> {
        const newPost = this.postRepository.create({
            ...createPostDto,
            createdDate: new Date(),
            user: currentUser
        })
        
        await this.postRepository.save(newPost)
        
        delete newPost.user
        return newPost
    }
    
    async editPost(
        currentUserId: number,
        postId: number,
        editPostDto: EditPostDto
    ): Promise<PostEntity> {
        const post = {
            ...await this.getPostById(currentUserId, postId),
            ...editPostDto
        }
        
        return this.postRepository.save(post)
    }
    
    async deletePost(postId: number, currentUserId: number): Promise<void> {
        const post = await this.getPostById(currentUserId, postId)
        await this.postRepository.remove(post)
    }
    
}
