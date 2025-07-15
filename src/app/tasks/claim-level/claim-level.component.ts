import { ChangeDetectionStrategy, Component, OnInit, ViewChild,
ChangeDetectorRef } from '@angular/core';
import { ClaimAssigneeForUser } from '../Classes/claimlevel-models';
import { APIService } from '../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectedUsers, GetSelectedUsers, ClaimAssigneeNotes } from '../../Claims/Classes/ClaimAssignee';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-claim-level',
  templateUrl: './claim-level.component.html',
  styleUrls: ['./claim-level.component.css',
  ]
})
export class ClaimLevelComponent implements OnInit {
  claimusers: ClaimAssigneeForUser;
  usersSelectList: GetSelectedUsers[];
  selecteduserslist: SelectedUsers[];
  selectedId: any = 0;
  fieldvisible: boolean = false;
  claimassigneenotes:ClaimAssigneeNotes[];
  ClaimlevelTable:any
  constructor(private API: APIService,
    private toaster: ToastrService,
    public router: Router,
    private Gv: GvarsService,
    private chref:ChangeDetectorRef) 
    {
    this.usersSelectList = [];
    this.selecteduserslist = [];
    this.claimassigneenotes=[];
    this.claimusers = new ClaimAssigneeForUser();
    this.API.getData('/ClaimAssignment/GetAllAssignedClaims?practice_code=' + this.Gv.currentUser.selectedPractice.PracticeCode + '&assignedByuserid=' + 0).subscribe(data => {
      if (data.Status == 'Success') {
        if (this.ClaimlevelTable)
        {this.ClaimlevelTable.destroy();}
         
          this.claimusers=data.Response;
          this.chref.detectChanges();
          this.ClaimlevelTable = $('.ClaimlevelTable').DataTable(
            {columnDefs: [ { orderable: true, targets: [0,1,2,7,-1,-2] }],
          language: { emptyTable: "No data available"}
        });
      }
    })


  }

  ngOnInit() {
    this.GetUsers();
  }


  onSelected(Id) {
    console.log(Id);
    if (Id == "All") {
      this.API.getData(`/ClaimAssignment/GetAllAssignedClaimsForPractice?practice_code=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(data => {
        if (data.Status == 'Success') {
          if (this.ClaimlevelTable)
          {this.ClaimlevelTable.destroy();}
       
          this.claimusers=data.Response;
          this.chref.detectChanges();
          this.ClaimlevelTable = $('.ClaimlevelTable').DataTable(
            {columnDefs: [ { orderable: true, targets: [0,1,2,7,-1,-2] }],
          language: { emptyTable: "No data available"}
        });
          
        }
      })
    }

    else {
      this.API.getData('/ClaimAssignment/GetAllAssignedClaims?practice_code=' + this.Gv.currentUser.selectedPractice.PracticeCode + '&assignedByuserid=' + Id).subscribe(data => {
        if (data.Status == 'Success') {
          if (this.ClaimlevelTable)
          {this.ClaimlevelTable.destroy();
          }
          
          this.claimusers=data.Response;
          this.chref.detectChanges();
          this.ClaimlevelTable = $('.ClaimlevelTable').DataTable(
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

  movetoclaim(Claim_no: any, PatientFullNamee: any, Patient_Account: any, ID: any) {
    console.log(PatientFullNamee);
    var n= PatientFullNamee.split(',');
    var First_Name= n[0];
    var Last_Name= n[1];

    
    const url = this.router.serializeUrl(this.router.createUrlTree(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: Patient_Account,
        claimNo: Claim_no,
        disableForm: false,
        PatientLastName: Last_Name,
        PatientFirstName: First_Name,
        assigneeID: ID
      }))]));
      // const url_var = window.location.origin;
      // const newurl= url_var +'/#'+ url;
    //const newurl = environment.localUrl + url;
    //window.open(newurl, '_blank');
    const newurl = environment.localUrl + url;
    window.open(newurl, '_parent');
  }

  viewclaimassigneenotes(id: any) {
    this.API.getData(`/ClaimAssignment/GetSpecificAssignedClaimNotes?ClaimAssignee_notes_ID=${id}`).subscribe(
      res => {
        if (res.Status == "Success") {
          this.claimassigneenotes = res.Response;
          console.log( this.claimassigneenotes)
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

}
