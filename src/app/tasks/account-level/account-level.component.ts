import { ChangeDetectionStrategy, Component, OnInit, ViewChild,
  ChangeDetectorRef } from '@angular/core';
  import {GetAccountAssigneeModel} from '../../tasks/Classes/claimlevel-models';
  import { SelectedUsers, GetSelectedUsers,AccountAssigneeNotes } from '../../patient/Classes/AccountAssignment';
  import { APIService } from '../../components/services/api.service';
  import { ToastrService } from 'ngx-toastr';
  import { Router } from '@angular/router';
  import { GvarsService } from '../../services/G_vars/gvars.service';
  
  import { Common } from '../../services/common/common';
  import { environment } from '../../../environments/environment';
  
  @Component({
    selector: 'app-account-level',
    templateUrl: './account-level.component.html',
    styleUrls: ['./account-level.component.css']
  })
  export class AccountLevelComponent implements OnInit {
    accountusers: GetAccountAssigneeModel;
    usersSelectList: GetSelectedUsers[];
    selecteduserslist: SelectedUsers[];
    selectedId: any = 0;
    fieldvisible: boolean = false;
    accountassigneenotes:AccountAssigneeNotes[];
    AccountlevelTable:any
    constructor(private API: APIService,
      private toaster: ToastrService,
      public router: Router,
      private Gv: GvarsService,
      private chref:ChangeDetectorRef) 
      {
      this.usersSelectList = [];
      this.selecteduserslist = [];
      this.accountassigneenotes=[];
      this.accountusers = new GetAccountAssigneeModel();
      this.API.getData('/ClaimAssignment/GetAllAssignedAccounts?practice_code=' + this.Gv.currentUser.selectedPractice.PracticeCode + '&assignedByuserid=' + 0).subscribe(data => {
        if (data.Status == 'Success') {
          if (this.AccountlevelTable)
          {this.AccountlevelTable.destroy();}
            this.accountusers=data.Response;
            this.chref.detectChanges();
            this.AccountlevelTable = $('.AccountlevelTable').DataTable(
              {columnDefs: [ { orderable: true, targets: [0,1,2,7,-1,-2] }],
            language: { emptyTable: "No data available"}
          });
        }
      })
  
  
    }
  
    ngOnInit() {
      this.GetUsers();
      // this.accountusers = new GetAccountAssigneeModel();
    }
  
  
    onSelected(Id) {
      console.log(Id);
      if (Id == "All") {
        this.API.getData(`/ClaimAssignment/GetAllAssignedAccountsForPractice?practice_code=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(data => {
          if (data.Status == 'Success') {
            if (this.AccountlevelTable)
            {this.AccountlevelTable.destroy();}
            this.accountusers=data.Response;
            this.chref.detectChanges();
            this.AccountlevelTable = $('.AccountlevelTable').DataTable(
              {columnDefs: [ { orderable: true, targets: [0,1,2,7,-1,-2] }],
            language: { emptyTable: "No data available"}
          });
            
          }
        })
      }
  
      else {
        this.API.getData('/ClaimAssignment/GetAllAssignedAccounts?practice_code=' + this.Gv.currentUser.selectedPractice.PracticeCode + '&assignedByuserid=' + Id).subscribe(data => {
          if (data.Status == 'Success') {
            if (this.AccountlevelTable)
            {this.AccountlevelTable.destroy();}
            this.accountusers=data.Response;
            this.chref.detectChanges();
            this.AccountlevelTable = $('.AccountlevelTable').DataTable(
              {columnDefs: [ { orderable: true, targets: [0,1,2,7,-1,-2] }],
            language: { emptyTable: "No data available"}
          });
          }
        })
      }
  
    }
  
  
    GetUsers(): any {
      this.API.getData(`/ClaimAssignment/GetUsersList?practicecode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
        res => {
          if (res.Status == 'Success') {
            this.selecteduserslist = res.Response;
          }
          else {
            this.usersSelectList = [];
            this.toaster.error(res.Status, 'Error');
          }
        });
    }


    movetoclaim(PatientFullNamee: any, Patient_Account: any, ID: any) {
        
      console.log(PatientFullNamee);
      var n= PatientFullNamee.split(',');
      var First_Name= n[0];
      var Last_Name= n[1];
      const url = this.router.serializeUrl(this.router.createUrlTree(['/Patient/Demographics/',
        Common.encodeBase64(JSON.stringify({
          Patient_Account: Patient_Account,
          disableForm: false,
          PatientLastName: Last_Name,
          PatientFirstName: First_Name,
          A_ID: ID,
        }))]));
        // const url_var = window.location.origin;
        // const newurl= url_var +'/#'+ url;
      //const newurl = environment.localUrl + url;
      //window.open(newurl, '_blank');
      const newurl = environment.localUrl + url;
      window.open(newurl, '_parent');
    }
  
    viewclaimassigneenotes(id: any) {
      this.API.getData(`/ClaimAssignment/GetSpecificAssignedAccountNotes?AccountAssignee_notes_ID=${id}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.accountassigneenotes = res.Response;
            console.log( this.accountassigneenotes)
          }
          else {
            this.toaster.error(res.Status, 'Error');
          }
        });
    }
  
  }
  