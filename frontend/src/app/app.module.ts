import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { PostsComponent } from './posts/posts.component';
import { LoaderComponent } from './shared/components/loader/loader.component'
import { AuthInterceptor } from './shared/services/auth.interceptor.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { PostComponent } from './post/post.component';
import { CreateOrEditPostPopupComponent } from './shared/components/create-or-edit-post-popup/create-or-edit-post-popup.component'

@NgModule({
    declarations: [
        AppComponent,
        PostsComponent,
        AuthComponent,
        LoaderComponent,
        HeaderComponent,
        PostComponent,
        CreateOrEditPostPopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatTabsModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatCardModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
