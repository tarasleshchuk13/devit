import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { AuthGuard } from '../user/guards/auth.guard'
import { UserEntity } from '../user/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { EditPostDto } from './dto/edit-post.dto'
import { PostEntity } from './post.entity'
import { PostService } from './post.service'
import { GetPostsQueryInterface } from './types/get-posts-query.interface'
import { GetPostsResponseInterface } from './types/get-posts-response.interface'

@Controller('posts')
export class PostController {
    
    constructor(private postService: PostService) {
    }
    
    @Get()
    @UseGuards(AuthGuard)
    async getPosts(
        @User('id') currentUserId: number,
        @Query() queryParams: GetPostsQueryInterface
    ): Promise<GetPostsResponseInterface> {
        return this.postService.getAllPosts(currentUserId, queryParams)
    }
    
    @Get('/:id')
    @UseGuards(AuthGuard)
    async getPostById(
        @Param('id') postId: number,
        @User('id') currentUserId: number
    ): Promise<PostEntity> {
        return this.postService.getPostById(currentUserId, postId)
    }
    
    @Post()
    @UseGuards(AuthGuard)
    async createPost(
        @User() currentUser: UserEntity,
        @Body() createPostDto: CreatePostDto
    ): Promise<PostEntity> {
        return this.postService.createPost(currentUser, createPostDto)
    }
    
    @Put('/:id')
    @UseGuards(AuthGuard)
    async editPost(
        @Param('id') postId: number,
        @User('id') currentUserId: number,
        @Body() editPostDto: EditPostDto
    ): Promise<PostEntity> {
        return this.postService.editPost(currentUserId, postId, editPostDto)
    }
    
    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deletePost(
        @Param('id') postId: number,
        @User('id') currentUserId: number
    ): Promise<void> {
        return this.postService.deletePost(postId, currentUserId)
    }
    
}
