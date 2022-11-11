import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { CreateOrEditPostInterface } from '../types/create-or-edit-post.interface'
import { GetPostsResponseInterface } from '../types/get-posts-response.interface'
import { PostWithContentInterface } from '../types/post-with-content.interface'

@Injectable({ providedIn: 'root' })
export class PostService {
    
    constructor(private http: HttpClient) {
    }
    
    getPosts(
        postsPerPage: number,
        currentPage: number,
        search: string,
        dateOrder: string
    ): Observable<GetPostsResponseInterface> {
        const url = environment.apiUrl + '/posts'
        let params = new HttpParams()
        
        params = params.append('limit', postsPerPage)
        params = params.append('offset', (currentPage - 1) * postsPerPage)
        
        if (search && search.trim().length > 0) {
            params = params.append('search', search.trim())
        }
        
        if (dateOrder) {
            params = params.append('dateOrder', dateOrder)
        }
        
        return this.http.get<GetPostsResponseInterface>(url, { params })
    }
    
    getPostById(id: number): Observable<PostWithContentInterface> {
        const url = `${environment.apiUrl}/posts/${id}`
        return this.http.get<PostWithContentInterface>(url)
    }
    
    createPost(postData: CreateOrEditPostInterface): Observable<PostWithContentInterface> {
        const url = `${environment.apiUrl}/posts`
        return this.http.post<PostWithContentInterface>(url, postData)
    }
    
    editPost(
        postData: CreateOrEditPostInterface,
        postId: number
    ): Observable<PostWithContentInterface> {
        const url = `${environment.apiUrl}/posts/${postId}`
        return this.http.put<PostWithContentInterface>(url, postData)
    }
    
    deletePost(id: number): Observable<void> {
        const url = `${environment.apiUrl}/posts/${id}`
        return this.http.delete<void>(url)
    }
    
}
