import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { PostService } from '../../services/post.service'
import { CreateOrEditPostInterface } from '../../types/create-or-edit-post.interface'
import { PostWithContentInterface } from '../../types/post-with-content.interface'

@Component({
    selector: 'app-create-or-edit-post-popup',
    templateUrl: './create-or-edit-post-popup.component.html',
    styleUrls: ['./create-or-edit-post-popup.component.scss']
})
export class CreateOrEditPostPopupComponent implements OnInit, OnDestroy {
    
    @Input() post?: PostWithContentInterface
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading = false
    
    constructor(private postService: PostService, private router: Router) {
    }
    
    ngOnInit(): void {
        document.body.style.overflow = 'hidden'
        
        this.form = new FormGroup({
            title: new FormControl(this.post ? this.post.title : '', Validators.required),
            content: new FormControl(this.post ? this.post.content : '', Validators.required)
        })
    }
    
    ngOnDestroy(): void {
        document.body.style.overflow = 'auto'
    }
    
    popupClick(event: Event): void {
        event.stopPropagation()
    }
    
    submit(): void {
        if (this.form.invalid) {
            return this.form.markAllAsTouched()
        }
        
        this.loading = true
        const postData: CreateOrEditPostInterface = { ...this.form.value }
        
        if (this.post) {
            this.postService.editPost(postData, this.post.id).subscribe((postData) => {
                if (this.post) {
                    this.post.content = postData.content
                    this.post.title = postData.title
                }
                
                this.onClose.emit()
            })
        } else {
            this.postService.createPost(postData).subscribe(({ id }) => {
                this.router.navigate(['/posts', id])
            })
        }
    }
    
}
