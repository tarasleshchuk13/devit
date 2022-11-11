import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { PostService } from '../shared/services/post.service'
import { PostInterface } from '../shared/types/post.interface'
import { OptionInterface } from './types/option.interface'

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
    
    readonly postsPerPage = 10
    currentPage = 1
    pageCount: number
    searchString: ''
    options: OptionInterface[] = [
        { value: 'desc', viewValue: 'Descending' },
        { value: 'asc', viewValue: 'Ascending' }
    ]
    selectedOption: string = this.options[0].value
    postsLoading = false
    posts: PostInterface[] = []
    timoutId: ReturnType<typeof setTimeout>
    subs: Subscription[] = []
    showCreatePostPopup = false
    
    constructor(private postService: PostService) {
    }
    
    ngOnInit(): void {
        this.fetchPosts()
    }
    
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    
    fetchPosts() {
        this.postsLoading = true
        
        const sub = this.postService.getPosts(
            this.postsPerPage,
            this.currentPage,
            this.searchString,
            this.selectedOption
        ).subscribe((data) => {
            this.posts = data.posts
            this.pageCount = Math.ceil(data.postsCount / this.postsPerPage)
            this.postsLoading = false
        })
        
        this.subs.push(sub)
    }
    
    selectChange(): void {
        this.currentPage = 1
        this.fetchPosts()
    }
    
    searchChange(): void {
        if (this.timoutId) {
            clearTimeout(this.timoutId)
        }
        
        this.postsLoading = true
        
        this.timoutId = setTimeout(() => {
            this.currentPage = 1
            this.fetchPosts()
        }, 500)
    }
    
    getPageNumbersArray(): number[] {
        return [...Array(this.pageCount).keys()].map(number => number +1)
    }
    
    changePage(page: number): void {
        if (page < 1 || page > this.pageCount) {
            return
        }
        
        this.currentPage = page
        this.fetchPosts()
    }
    
}
