import { Injectable } from '@angular/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { APIService } from '../../components/services/api.service';
import {  ClaimAssigneeNotifications, AccountAssigneeNotifications } from '../../Claims/Classes/ClaimAssignee';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ClaimService {
  isOpen = false;
  @Output() ClaimModel: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  claimTabActive: Subject<any> = new Subject();

  claimassigneenotifications: Subject<number> = new Subject();
  accountassigneenotifications: Subject<number> = new Subject();
  //claimassigneenotifications = new Subject();

  claimuser:ClaimAssigneeNotifications[];
  accountuser:AccountAssigneeNotifications[];
  constructor(
    private apiService:APIService,
    private toaster: ToastrService
  ) {
    this.claimuser=[];
    this.accountuser=[];
   }

  toggle() {
    this.isOpen = !this.isOpen;
    this.change.emit(this.isOpen);
  }

  GetUsersClaimNotifications(PracticeCode:any, check:any): any {
    this.apiService.getDataWithoutSpinner(`/ClaimAssignment/GetAllAssignedClaimsNotifications?practice_code=${PracticeCode}`).subscribe(
      res => {
        if (res.Status == 'Success') {
          this.claimuser= res.Response; 
          this.claimassigneenotifications.next(this.claimuser.length);
          if(check==false && this.claimuser.length!=0)
          {
            this.toaster.success("You have "+this.claimuser.length+" Claims Pending in Tasks", 
            "Claim Assignment");
          }
          else{
            console.log("zero");
          }
         
                   
        }
        else{
          this.claimassigneenotifications.next(0);
        }
      });
  }

  GetUsersAccountNotifications(PracticeCode:any, check:any): any {
    this.apiService.getDataWithoutSpinner(`/ClaimAssignment/GetAllAssignedAccountsNotifications?practice_code=${PracticeCode}`).subscribe(
      res => {
        if (res.Status == 'Success') {
          this.accountuser= res.Response;
          this.accountassigneenotifications.next(this.accountuser.length);  
          if(check==false && this.accountuser.length!=0) {
              this.toaster.success("You have "+this.accountuser.length+" Accounts Pending in Tasks ", 
                "Account Assignment");
          }
          else{
            console.log("zero");
          }
   
        }
        else{
          this.accountassigneenotifications.next(0);
        }
      });
  }

}
