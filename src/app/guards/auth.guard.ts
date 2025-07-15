import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';
import { Common } from '../services/common/common';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let token = localStorage.getItem('jwt');
    if (!isNullOrUndefined(token) && !Common.isNullOrEmpty(token)) {
      return true;
    } else {
      return this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
