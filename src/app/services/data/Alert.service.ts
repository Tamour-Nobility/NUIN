// alert-service.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../G_vars/gvars.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private apiService: APIService,
    private Gv: GvarsService,
  ) {}

  getAlertData(): Observable<any> {
    debugger
    return this.alertDataSubject.asObservable();
  }

  setAlertData(data: any): void {
    debugger
    this.alertDataSubject.next(data);
  }

  // getAlert(): void {
  //   debugger
  //   this.apiService.getData('/Alert/GetAlertForPatient?patientaccount=' + this.Gv.Patient_Account).subscribe(data => {
  //     if (data.Status === 'Success') {
  //       this.setAlertData(data.Response);
  //     }
  //   });
  // }
  getAlert(): Observable<any> {
    debugger
    // Return the observable directly
    return this.apiService.getData('/Alert/GetAlertForPatient?patientaccount=' + this.Gv.Patient_Account);
  }

  getLoginAlert(): Observable<any> {
    debugger
    // Return the observable directly
    return this.apiService.getData('/Alert/GetLoginAlert');
  }
}