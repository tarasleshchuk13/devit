import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../shared/services/auth.service'
import { AuthRequestInterface } from '../shared/types/auth-request.interface'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    
    isLoginPage: boolean
    form: FormGroup
    loading = false
    sub: Subscription
    backendError: string[]
    
    constructor(private router: Router, private authService: AuthService) {
    }
    
    ngOnInit(): void {
        this.isLoginPage = this.router.url === '/login'
        
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
        })
    }
    
    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe()
        }
    }
    
    submit(): void {
        if (this.form.invalid) {
            return this.form.markAllAsTouched()
        }
        
        this.loading = true
        
        const formData: AuthRequestInterface = {
            ...this.form.value
        }
        
        const subFunctions = {
            next: () => {
                this.router.navigate(['/'])
            },
            error: (error: any) => {
                const message = error.error.message
                this.backendError = typeof message === 'string' ? [message] : message
                this.loading = false
            }
        }
        
        if (this.isLoginPage) {
            this.sub = this.authService.login(formData).subscribe(subFunctions)
        } else {
            this.sub = this.authService.registration(formData).subscribe(subFunctions)
        }
    }
    
}
