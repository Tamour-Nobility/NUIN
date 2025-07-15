import { throwError as observableThrowError, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { GvarsService } from '../G_vars/gvars.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { TokenRequestModel } from '../../models/token/token.model';
import { AccessViewModel } from '../../models/auth/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  constructor(private httpClient: HttpClient, private router: Router,
    public Gv: GvarsService) { }

  checkLoginStatus(): boolean {
    let loginCookie = localStorage.getItem("loginStatus");
    if (loginCookie == "1") {
      if (localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != undefined) {
        return true;
      }
      return false;
    }
  }

  Token(tokenRequestModel: TokenRequestModel): any {
 
    return this.httpClient.post<any>(environment.baseUrl + `/Token/Auth`, tokenRequestModel).pipe(
      map(res => {
        return res;
        
        
      }), catchError(e => throwError(e)));
  }
  Resend(url: string) {
    
    return this.httpClient.get<any>(environment.baseUrl + url).pipe(
      map(res => {
        return res;
      }), catchError(e => throwError(e)));
}
  Code(accessViewModel: AccessViewModel): any {
 debugger
    return this.httpClient.post<any>(environment.baseUrl + `/Token/AuthCode`, accessViewModel).pipe(
      map(res => {
        this.loginStatus.next(true);
    
        return res;
      }), catchError(e => throwError(e)));
  }

  GetNewRefreshToken() {
    let request = new TokenRequestModel();
    request.Refresh_token = localStorage.getItem('refreshToken');
    request.Grant_Type = 'refresh_token';
    return this.httpClient.post<any>(`${environment.baseUrl}/Token/Auth`, request).pipe(
      map(result => {
        if (result) {
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.Access_Token);
          localStorage.setItem('username', result.Username);
          localStorage.setItem('refreshToken', result.Refresh_Token);
        }
        return <any>result;
      })
    );
  }

  get getHttpOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('cu')}`,
        'Accept': 'application/json'
      })
    };
  }

  get getHttpOptionsWithNoToken(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  HttpErrHandler(res) {
    let errMsg;
    if (res.status === 404) {
      errMsg = 'NotFound Http Error ';
    }
    else if (res.status === 401) {

      errMsg = 'Invalid username or password';
    }
    else { errMsg = res.status + ' Unknown Http Error'; }
    return observableThrowError(errMsg);
  }

  Logout(): any {
   localStorage.clear();
    this.router.navigate(['/login']);
  }

  GetAuthorizedRoute(module: string): any {
    module = module.toLowerCase();
    let route = '';
    switch (module) {
      case 'dashboard':
        route = '/'
        break;
      case 'edi setup':
        route = '/EDISetup/ClaimSubmission'
        break;
      case 'facility':
        route = '/Facility'
        break;
      case 'fee schedule':
        route = '/FeeSchedule/Standard'
        break;
      case 'guarantor':
        route = '/guarantor'
        break;
      case 'insurance setup':
        route = '/InsuranceSetup/insGroup'
        break;
      case 'office management':
        route = '/OfficeMGM'
        break;
      case 'patient search':
        route = 'patient/PatientSearch'
        break;
      case 'Referral Physicians':
        route = 'referal/physician';
        break;
      case 'practice setup':
        route = '/PracticeList'
        break;
      case 'procedures':
        route = '/procedures'
        break;
      case 'reports':
        route = '/ReportSetup/AgingSummary'
        break;
      case 'users management':
        route = '/users/module'
        break;
      case 'claim submission':
        route = '/claimsubmission/eraimport'
        break;
        // case 'Tasks':
        // route = "/Tasks";
        // break;

      case 'reporting':
        route = "/reporting/charges/overall";
        break;
      default:
        route = '/'
    }
    this.router.navigate([route]);
  }

  getTokenFromLS() {
      
    var refreshToken = localStorage.getItem("refreshToken");
    var jwt = localStorage.getItem("jwt");
    var practices = JSON.parse(localStorage.getItem("pr"));
    var roleAndRights = JSON.parse(localStorage.getItem("rr"));
    if (jwt && refreshToken && practices && roleAndRights)
      return { jwt, refreshToken, practices: practices, roleAndRights: roleAndRights };
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("jwt");
    localStorage.removeItem("pr");
    localStorage.removeItem("rr");
    return null;
  }

  setPractice(practice: any) {
    if (practice)
      localStorage.setItem("sp", JSON.stringify(practice));
  }

  getPractice() {
    debugger
    var practice = localStorage.getItem("sp");
    if (practice)
      return JSON.parse(practice);
    return null
  }

}
