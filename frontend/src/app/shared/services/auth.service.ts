import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthRequestInterface } from '../types/auth-request.interface'
import { AuthResponseInterface } from '../types/auth-response.interface'

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    constructor(private http: HttpClient) {
    }
    
    setUserData(authData: AuthResponseInterface): void {
        localStorage.setItem('token', authData.token)
    }
    
    login(data: AuthRequestInterface): Observable<AuthResponseInterface> {
        const url = environment.apiUrl + '/login'
        
        return this.http.post<AuthResponseInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    registration(data: AuthRequestInterface): Observable<AuthResponseInterface> {
        const url = environment.apiUrl + '/registration'
        
        return this.http.post<AuthResponseInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    logout() {
        localStorage.removeItem('token')
    }
    
}