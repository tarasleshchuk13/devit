import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './auth/auth.component'
import { PostComponent } from './post/post.component'
import { PostsComponent } from './posts/posts.component'
import { AuthGuard } from './shared/services/auth.guard'

const routes: Routes = [
    { path: '', component: PostsComponent, canActivate: [AuthGuard] },
    { path: 'posts/:id', component: PostComponent, canActivate: [AuthGuard] },
    { path: 'register', component: AuthComponent },
    { path: 'login', component: AuthComponent },
    { path: '**', redirectTo: '/' }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
