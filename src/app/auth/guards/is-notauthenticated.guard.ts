import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IsNotAuthenticatedGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean > | boolean  {


    return this.authService.checkAuthStatus()
    .pipe(
      map( valid => {
        if(valid){
          this.router.navigateByUrl('/boletos/list')
          return false;
        } else {
          return true;
        }
      })
    );
      /*const url = state.url;
      if(this.authService.AuthStatus === AuthStatus.authenticated) {
        return true 
      }

      this.router.navigateByUrl('/auth/login');
    
      return false;*/
  }  
}
