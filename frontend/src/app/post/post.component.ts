import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription, switchMap } from 'rxjs'
import { PostService } from '../shared/services/post.service'
import { PostWithContentInterface } from '../shared/types/post-with-content.interface'

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
    
    postLoading = false
    post: PostWithContentInterface
    deleteLoading = false
    shoeEditPostPopup = false
    subs: Subscription[] = []
    
    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
        this.postLoading = true
        
        const sub = this.route.params
            .pipe(switchMap((params: Params) => {
                return this.postService.getPostById(+params['id'])
            }))
            .subscribe({
                next: (post) => {
                    this.post = post
                    this.postLoading = false
                },
                error: () => {
                    this.router.navigate(['/'])
                }
            })
        
        this.subs.push(sub)
    }
    
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
    
    deletePost(): void {
        this.postService.deletePost(this.post.id).subscribe(() => {
            this.router.navigate(['/'])
        })
    }
    
}
