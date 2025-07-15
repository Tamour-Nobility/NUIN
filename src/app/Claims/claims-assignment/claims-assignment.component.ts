import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SelectedUsers, GetSelectedUsers, ClaimAssigneeModel,
  ClaimAssigneeForUser, ClaimAssigneeNotes,
  claimAssigneedataforclaim
} from '../Classes/ClaimAssignee';
import { APIService } from '../../components/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ViewChild } from '@angular/core';
import { Common } from '../../services/common/common';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CountAssignedtasks } from '../../models/auth/auth';
import { ClaimService } from '../../services/claim/claim.service';
@Component({
  selector: 'app-claims-assignment',
  templateUrl: './claims-assignment.component.html',
  styleUrls: ['./claims-assignment.component.css']
})
export class ClaimsAssignmentComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  usersSelectList: GetSelectedUsers[];
  selecteduserslist: SelectedUsers[];
  editassigneeUser: ClaimAssigneeForUser[];
  claimassigneenotes: ClaimAssigneeNotes[];
  
  countassigned: CountAssignedtasks[];
  assigneedataforclaim: claimAssigneedataforclaim[];
  ngxSelectUser = new FormControl();
  claimassignee: ClaimAssigneeModel;
  claimnotes: string = "";
  claimnotesdisabled: string = "";
  claimInfo: any;
  assigneeID: any = 0;
  today = new Date();
  selDateDD: IMyDate = {
    day: 0,
    month: 0,
    year: 0
  };

  ClaimAssignment: FormGroup;
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1,
    }
  };
  myDateRangePickerOptions1: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1,
    },
  };

  constructor(public router: Router, public route: ActivatedRoute,
    private Gv: GvarsService,
    private apiService: APIService,
    private toaster: ToastrService,
    private datepipe: DatePipe,
    private claimservice:ClaimService
  ) {
    this.usersSelectList = [];
    this.selecteduserslist = [];
    this.editassigneeUser = [];
    this.claimassigneenotes = [];
    this.claimassignee = new ClaimAssigneeModel();
    this.countassigned = [];
    this.assigneedataforclaim = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.claimInfo = JSON.parse(Common.decodeBase64(params['param']));
      }
    });

    this.GetClaimData();
    this.GetUsers();
    this.initForm();
    if (this.claimInfo.assigneeID) {
      this.apiService.getData(`/ClaimAssignment/GetSpecificAssignedClaimData?claimassignee_id=${this.claimInfo.assigneeID}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.editassigneeUser = res.Response;

            // this.claimassignee.UserId= this.editassigneeUser[0].UserId;
            this.claimassignee.Assignedto_UserId = this.editassigneeUser[0].Assignedto_UserId;
            this.f.User.setValue(this.editassigneeUser[0].Assignedto_UserId);
            this.f.Priority.setValue(this.editassigneeUser[0].Priority);
            this.f.Status.setValue(this.editassigneeUser[0].Status);
            this.f.StartDate.setValue(this.setDate(this.editassigneeUser[0].Start_Date));
            this.f.DueDate.setValue(this.setDate(this.editassigneeUser[0].Due_Date));
            this.f.Notes.setValue(this.editassigneeUser[0].Claim_notes)
          }
          else {
            this.toaster.error(res.Status, 'Error');
          }
        });


      this.apiService.getData(`/ClaimAssignment/GetSpecificAssignedClaimNotes?ClaimAssignee_notes_ID=${this.claimInfo.assigneeID}`).subscribe(
        res => {
          if (res.Status == "Success") {
            
            this.claimassigneenotes = res.Response;
            console.log(this.claimassigneenotes)
          }
          else {
            this.toaster.error(res.Status, 'Error');
          }
        });

    }



  }
  onclose(){
   
    this.f.Notes.setValue('');
  }

  GetClaimData() {
    this.apiService.getData(`/ClaimAssignment/GetAssignedClaimData?claimnumber=${this.claimInfo.claimNo}`).subscribe(
      res => {
        if (res.Status == "Success") {
          this.assigneedataforclaim = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }




  isNullOrEmptyString(str: string): boolean {
    if (str == undefined || str == null || $.trim(str) == '')
      return true;
    else
      return false;
  }


  isNullOrUndefinedNumber(num: number): boolean {
    if (num == undefined || num == null)
      return true;
    else
      return false;
  }


  GetUsers(): any {
    this.apiService.getData(`/ClaimAssignment/GetUsersList?practicecode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
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

  initForm() {
    this.ClaimAssignment = new FormGroup({
      User: new FormControl('', [Validators.required]),
      StartDate: new FormControl('', [Validators.required]),
      Priority: new FormControl('', [Validators.required]),
      Status: new FormControl('', [Validators.required]),
      DueDate: new FormControl('', [Validators.required]),
      Notes: new FormControl('', [Validators.required]),
    
    
    })

  }

  get f() {
    return this.ClaimAssignment.controls;
  }

  setDate(date: string) {
    if (!Common.isNullOrEmpty(date)) {
      let dDate = new Date(date);
  
      // Extract time components
      let hours = dDate.getHours();
      let minutes = dDate.getMinutes();
      let seconds = dDate.getSeconds();
  
      // Set the time components on the dDate object
      dDate.setHours(hours);
      dDate.setMinutes(minutes);
      dDate.setSeconds(seconds);
  
      this.selDateDD = {
        year: dDate.getFullYear(),
        month: dDate.getMonth() + 1,
        day: dDate.getDate()
      };
    }
  }


  onSelectUser(Id: any) {
    this.claimassignee.Assignedto_UserId = Id;
  }

  onSelected(Id) {
    this.claimassignee.Assignedto_UserId = Id;
  }

  onTypeUsers(value: string) {
    this.usersSelectList =
      JSON.parse(JSON.stringify(this.selecteduserslist.filter(f => f.Name.toLowerCase().includes(value.toLowerCase()))));
  }


  onRemoveUser(event: any) {

  }

  onStatuschanged(event) {
    this.claimassignee.Status = event.target.value;
  }

  onPrioritychanged(event) {
    this.claimassignee.Priority = event.target.value;
  }

  //#region my-date-picker
  dateMaskGS(event: any) {
    Common.DateMask(event);
  }

  onDueDateChangeStart(event) {
    this.claimassignee.Due_Date = event.formatted;

  }

  onStartDateChangeStart(event) {
    this.claimassignee.Start_Date = event.formatted;
  }

  GetUserNotifications(practicecode, check): any {
    this.claimservice.GetUsersClaimNotifications(practicecode, check);
  }

  saveclaimassignee() {
    
    // this.claimassignee.Name =  this.selecteduserslist.filter(f => f.UserId.includes(this.claimassignee.Id));
    this.claimassignee.Claim_AssigneeID = 0;
    this.claimassignee.Claim_notes = this.claimnotes;
    this.claimassignee.ClaimNo = this.claimInfo.claimNo;

      var AssignedToUser = this.selecteduserslist.find(e => e.Id == this.claimassignee.Assignedto_UserId);
      this.claimassignee.Assignedto_UserName = AssignedToUser.UserName;
      this.claimassignee.Assignedto_FullName = AssignedToUser.FullName;
    var AssignedByUser = this.selecteduserslist.find(e => e.Id == this.Gv.currentUser.userId);
    this.claimassignee.AssignedBy_UserId = AssignedByUser.Id;
    this.claimassignee.AssignedBy_UserName = AssignedByUser.UserName;
    this.claimassignee.AssignedBy_FullName = AssignedByUser.FullName;

    this.claimassignee.PatientAccount = this.claimInfo.Patient_Account;
    this.claimassignee.PatientFullName = this.claimInfo.PatientLastName + ", " + this.claimInfo.PatientFirstName;
    this.claimassignee.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;

    this.claimassignee.Claim_DOS = this.assigneedataforclaim[0].DOS;
    this.claimassignee.Claim_AmtDue = this.assigneedataforclaim[0].Amt_Due;
    this.claimassignee.Claim_AmtPaid = this.assigneedataforclaim[0].Amt_Paid;
    this.claimassignee.Claim_Claimtotal = this.assigneedataforclaim[0].Claim_Total;

    this.claimassignee.Claim_BillingPhysician = this.assigneedataforclaim[0].Billing_Physician;
    this.claimassignee.Claim_AttendingPhysician = this.assigneedataforclaim[0].Attending_Physician;
    this.claimassignee.ProviderFullName = this.assigneedataforclaim[0].Provider_Name;
    this.claimassignee.countentries = 0;

    if (this.canSave() != false) {
      this.apiService.PostData('/ClaimAssignment/PostAllAssignedClaims', this.claimassignee, (d) => {
        if (d.Status == "Success") {
          this.GetUserNotifications(this.Gv.currentUser.selectedPractice.PracticeCode, true);
          this.toaster.success(this.claimassignee.ClaimNo+" Has been assigned To "+ 
          this.claimassignee.Assignedto_FullName + " that is due on "
          +this.claimassignee.Due_Date, 
          "Priority "+this.claimassignee.Priority);
          this.claimassignee = new ClaimAssigneeModel;
          this.initForm();
          swal('Claim Assignment', 'Claim Has Been Assigned Successfuly', 'success');
          this.closebutton.nativeElement.click();
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
    }

  }
  canSave() {
    if (this.isNullOrUndefinedNumber(this.claimassignee.Assignedto_UserId) ) {
      this.toaster.warning('Select User', 'Validation');
      return false;
    }

    if (this.isNullOrEmptyString(this.claimassignee.Start_Date)) {
      this.toaster.warning('Select Start Date', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.claimassignee.Priority)) {
      this.toaster.warning('Select priority', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.claimassignee.Status)) {
      this.toaster.warning('Select Status', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.claimassignee.Due_Date)) {
      this.toaster.warning('Select Due Date', 'Validation');
      return false;
    }
  
    if (this.isNullOrEmptyString(this.claimassignee.Claim_notes)) {
      this.toaster.warning('Enter Task Notes', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.claimassignee.Assignedto_FullName)) {
      this.toaster.warning('Name is required', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.claimassignee.Assignedto_UserName)) {
      this.toaster.warning('UserName is required', 'Validation');
      return false;
    }
    else {
      return true;
    }

  }

  editclaimassignee() {

    
  

    this.claimassignee.Claim_DOS = this.assigneedataforclaim[0].DOS;
    this.claimassignee.Claim_AmtDue = this.assigneedataforclaim[0].Amt_Due;
    this.claimassignee.Claim_AmtPaid = this.assigneedataforclaim[0].Amt_Paid;
    this.claimassignee.Claim_Claimtotal = this.assigneedataforclaim[0].Claim_Total;

    this.claimassignee.Claim_BillingPhysician = this.assigneedataforclaim[0].Billing_Physician;
    this.claimassignee.Claim_AttendingPhysician = this.assigneedataforclaim[0].Attending_Physician;
    this.claimassignee.ProviderFullName = this.assigneedataforclaim[0].Provider_Name;
    this.claimassignee.countentries = 0;

    this.claimassignee.Priority = this.f.Priority.value;
    this.claimassignee.Status = this.f.Status.value;
    this.claimassignee.Due_Date = this.f.DueDate.value.formatted;
    this.claimassignee.Start_Date = this.f.StartDate.value.formatted;
    this.claimassignee.Claim_notes = this.f.Notes.value;
    this.claimassignee.Claim_AssigneeID = this.claimInfo.assigneeID;
    this.claimassignee.ClaimNo = this.claimInfo.claimNo;

    var AssignedToUser = this.selecteduserslist.find(e => e.Id == this.claimassignee.Assignedto_UserId);
    this.claimassignee.Assignedto_UserId = AssignedToUser.Id;
    this.claimassignee.Assignedto_UserName = AssignedToUser.UserName;
    this.claimassignee.Assignedto_FullName = AssignedToUser.FullName;

    var AssignedByUser = this.selecteduserslist.find(e => e.Id == this.Gv.currentUser.userId);
    this.claimassignee.AssignedBy_UserId = AssignedByUser.Id;
    this.claimassignee.AssignedBy_UserName = AssignedByUser.UserName;
    this.claimassignee.AssignedBy_FullName = AssignedByUser.FullName;

    this.claimassignee.PatientAccount = this.claimInfo.Patient_Account;
    this.claimassignee.PatientFullName = this.claimInfo.PatientLastName + ", " + this.claimInfo.PatientFirstName;
    this.claimassignee.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;


    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
    const New_note = {
      ClaimAssignee_notes_ID: 0,
      Claim_notes:this.f.Notes.value,
      Created_By: this.claimassignee.AssignedBy_UserId  ,
       Created_Date: formattedDate,
      Deleted: null,
      Modified_By: null,
      Modified_Date: null,
      Name: this.claimassignee.AssignedBy_FullName,
      Notes_ID: 35510211,
      modification_allowed: false
    };
      
    if (this.canSave() != false) {
      this.apiService.PostData('/ClaimAssignment/EditAssignedClaims', this.claimassignee, (d) => {
       
        if (d.Status == "Success") {
          this.GetUserNotifications(this.Gv.currentUser.selectedPractice.PracticeCode, true);
          this.toaster.success(this.claimassignee.ClaimNo+" Has been assigned To "+ 
          this.claimassignee.Assignedto_FullName + " that is due on "
          +this.claimassignee.Due_Date, 
          "Priority "+this.claimassignee.Priority);
          // this.claimassignee = new ClaimAssigneeModel;
          // this.claimInfo.assigneeID = null;
          // this.claimassigneenotes = [];
          // this.selecteduserslist = [];
          // this.editassigneeUser = [];
          //this.claimInfo=null;
          // this.initForm();
          swal('Claim Assignment', 'Claim Has Been Updated Successfuly', 'success');

          this.claimassigneenotes.push(New_note);
          this.f.Notes.setValue('');
          

          this.closebutton.nativeElement.click();
          //window.self.close();
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
    }

  }



}
