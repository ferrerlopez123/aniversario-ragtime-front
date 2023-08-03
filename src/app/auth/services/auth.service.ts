import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl
  private _usuario!: User | null;
  private _authStatus = AuthStatus.checking

  get usuario() {
    return {...this._usuario}
  }

  get AuthStatus() {
    return this._authStatus
  }

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe(); 
   }

  private setAuthentication(user:User, token: string) : boolean {
    this._usuario = user;
    this._authStatus = AuthStatus.authenticated;
    localStorage.setItem('token',token);
    return true;
  }

  login(email: string, password: string):Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = {email, password}

   return  this.http.post<LoginResponse>(url,body)
   .pipe(
    map(({user,token}) => this.setAuthentication(user,token)),
    catchError( err => throwError(() => err.error.message)
    )
   );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if(!token) return of(false);

    const headers = new HttpHeaders()
    .set('Authorization',`Bearer ${token}`);

    return  this.http.get<CheckTokenResponse>(url,{headers})
      .pipe(
        map(({user,token}) => this.setAuthentication(user,token)),
        catchError(() => {
          this._authStatus = AuthStatus.notAuthenticated
          return of(false)
        })
      )
  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus = AuthStatus.notAuthenticated,
    this._usuario = null;
  }

  registro(name: string, email:string,password: string, roles:string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/register`;
    const body = {name,email, password,roles};
    return this.http.post<LoginResponse>(url,body)
    .pipe(
      map(({user,token}) => this.setAuthentication(user,token)),
      catchError( err => throwError(() => err.error.message)
      )
     );
  }
} 


