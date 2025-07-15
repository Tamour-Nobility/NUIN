import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';
import { Common } from '../services/common/common';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class DashGuard implements  CanActivate{
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let role:any=localStorage.getItem('rr');
    let disabledash:Boolean=true;
    if(!isNullOrUndefined(role) && !Common.isNullOrEmpty(role)){
       role =   JSON.parse(localStorage.getItem('rr'));
       role.forEach(x =>{
        if(x.ModuleName=="Dashboard"){
          disabledash=false;
        }
  
      })
      
    }

   
   
  
      if(disabledash==true){
        //return true;
        return this.router.navigate(['patient/PatientSearch'], { queryParams: { returnUrl: state.url } }); 
      }else{
        return true;
      }
     
   
  }
}