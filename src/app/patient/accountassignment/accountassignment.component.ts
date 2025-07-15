import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SelectedUsers, GetSelectedUsers, AccountAssigneeModel,
  AccountAssigneeNotes, EditAccountAssigneeModel
} from '../../patient/Classes/AccountAssignment';
import { APIService } from '../../components/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ViewChild } from '@angular/core';
import { Common } from '../../services/common/common';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { ClaimService } from '../../services/claim/claim.service';
@Component({
  selector: 'app-accountassignment',
  templateUrl: './accountassignment.component.html',
  styleUrls: ['./accountassignment.component.css']
})
export class AccountassignmentComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  private isDisabled = false;

  usersSelectList: GetSelectedUsers[];
  selecteduserslist: SelectedUsers[];
  accountassigneenotes: AccountAssigneeNotes[];
  ngxSelectUser = new FormControl();
 
  accountassignee: AccountAssigneeModel;
  editaccountuser: EditAccountAssigneeModel[];
  accountnotes: string = "";
  accountInfo: any;
  assigneeID: any = 0;
  today = new Date();
  selDateDD: IMyDate = {
    day: 0,
    month: 0,
    year: 0
  };

  AccountAssignment: FormGroup;
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
  claimData: any;
  patientAcc : number = 10109995001000;
  constructor(public router: Router, public route: ActivatedRoute,
    private Gv: GvarsService,
    private apiService: APIService,
    private toaster: ToastrService,
    private datepipe: DatePipe,
    private claimservice:ClaimService
  ) {
    this.usersSelectList = [];
    this.selecteduserslist = [];
    this.accountassigneenotes = [];
    this.accountassignee = new AccountAssigneeModel();
    this.editaccountuser =[];

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.accountInfo = JSON.parse(Common.decodeBase64(params['param']));

      }
    });
   

    this.GetUsers();
    this.initForm();

    
    


    if (this.accountInfo.A_ID) {
      this.apiService.getData(`/ClaimAssignment/GetSpecificAssignedAccountData?accountassignee_id=${this.accountInfo.A_ID}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.editaccountuser = res.Response;
            console.log("my datatatatta" + this.editaccountuser)
            

            // this.claimassignee.UserId= this.editassigneeUser[0].UserId;
            this.accountassignee.Assignedto_UserId = this.editaccountuser[0].Assignedto_UserId;
            this.f.User.setValue(this.editaccountuser[0].Assignedto_UserId);
            this.f.Priority.setValue(this.editaccountuser[0].Priority);
            this.f.Status.setValue(this.editaccountuser[0].Status);
            this.f.StartDate.setValue(this.setDate(this.editaccountuser[0].Start_Date));
            this.f.DueDate.setValue(this.setDate(this.editaccountuser[0].Due_Date));
            this.f.Notes.setValue(this.editaccountuser[0].Account_notes)
          }
          else {
            this.toaster.error(res.Status, 'Error');
          }
        });


      this.apiService.getData(`/ClaimAssignment/GetSpecificAssignedAccountNotes?AccountAssignee_notes_ID=${this.accountInfo.A_ID}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.accountassigneenotes = res.Response;
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
  canSave() {
    if (this.isNullOrUndefinedNumber(this.accountassignee.Assignedto_UserId)) {
      this.toaster.warning('Select User', 'Validation');
      return false;
    }

  
    if (this.isNullOrEmptyString(this.accountassignee.Start_Date)) {
      this.toaster.warning('Select Start Date', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.accountassignee.Priority)) {
      this.toaster.warning('Select priority', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.accountassignee.Status)) {
      this.toaster.warning('Select Status', 'Validation');
      return false;
    }
  
    if (this.isNullOrEmptyString(this.accountassignee.Due_Date)) {
      this.toaster.warning('Select Due Date', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.accountassignee.Account_notes)) {
      this.toaster.warning('Enter Task Notes', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.accountassignee.Assignedto_FullName)) {
      this.toaster.warning('Name is required', 'Validation');
      return false;
    }
    if (this.isNullOrEmptyString(this.accountassignee.Assignedto_UserName)) {
      this.toaster.warning('UserName is required', 'Validation');
      return false;
    }
    else {
      return true;
    }

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

   
    this.AccountAssignment = new FormGroup({
      User: new FormControl('', [Validators.required]),
      DueDate: new FormControl('', [Validators.required]),
      StartDate: new FormControl('', [Validators.required]),
      Notes: new FormControl('', [Validators.required]),
      Priority: new FormControl('', [Validators.required]),
      Status: new FormControl('', [Validators.required]),
    })

  }

  get f() {
    return this.AccountAssignment.controls;
  }

  setDate(date: string) {
    if (!Common.isNullOrEmpty(date)) {
      let dDate = new Date(date);
      this.selDateDD = {
        year: dDate.getFullYear(),
        month: dDate.getMonth() + 1,
        day: dDate.getDate()
      };
    }
  }


  onSelectUser(Id: any) {
    this.accountassignee.Assignedto_UserId = Id;
  }

  onSelected(Id) {
    this.accountassignee.Assignedto_UserId = Id;
  }

  onTypeUsers(value: string) {
    this.usersSelectList =
      JSON.parse(JSON.stringify(this.selecteduserslist.filter(f => f.Name.toLowerCase().includes(value.toLowerCase()))));
  }


  onRemoveUser(event: any) {

  }

  onStatuschanged(event) {
    this.accountassignee.Status = event.target.value;
  }

  onPrioritychanged(event) {
    this.accountassignee.Priority = event.target.value;
  }

  //#region my-date-picker
  dateMaskGS(event: any) {
    Common.DateMask(event);
  }

  onDueDateChangeStart(event) {
    this.accountassignee.Due_Date = event.formatted;
  }

  onStartDateChangeStart(event) {
    this.accountassignee.Start_Date = event.formatted;
  }

  GetUserNotifications(practicecode, check): any {
    this.claimservice.GetUsersAccountNotifications(practicecode, check);
  }


  

// GetUsers(): any {
//   this.apiService.getData(`/ClaimAssignment/GetUsersList?practicecode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
//     res => {
//       if (res.Status == 'Success') {
//         this.selecteduserslist = res.Response;
//       }
//       else {
//         this.usersSelectList = [];
//         this.toaster.error(res.Status, 'Error');
//       }
//     });
// }

  saveaccountassignee() {
    // this.claimassignee.Name =  this.selecteduserslist.filter(f => f.UserId.includes(this.claimassignee.Id));
    this.accountassignee.Account_AssigneeID = 0;
    this.accountassignee.Account_notes = this.accountnotes;
    var AssignedToUser = this.selecteduserslist.find(e => e.Id == this.accountassignee.Assignedto_UserId);
    this.accountassignee.Assignedto_UserName = AssignedToUser.UserName;
    this.accountassignee.Assignedto_FullName = AssignedToUser.FullName;

    var AssignedByUser = this.selecteduserslist.find(e => e.Id == this.Gv.currentUser.userId);
    this.accountassignee.AssignedBy_UserId = AssignedByUser.Id;
    this.accountassignee.AssignedBy_UserName = AssignedByUser.UserName;
    this.accountassignee.AssignedBy_FullName = AssignedByUser.FullName;

    this.accountassignee.PatientAccount = this.accountInfo.Patient_Account;
    this.accountassignee.PatientFullName = this.accountInfo.PatientLastName + ", " + this.accountInfo.PatientFirstName;
    this.accountassignee.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;

    if (this.canSave() != false) {
      this.isDisabled=true; 
      this.apiService.PostData('/ClaimAssignment/PostAllAssignedAccounts', this.accountassignee, (d) => {
        if (d.Status == "Success") {
          this.GetUserNotifications(this.Gv.currentUser.selectedPractice.PracticeCode, true);
          this.toaster.success(this.accountassignee.PatientAccount+" Has been assigned To "+ 
          this.accountassignee.Assignedto_FullName + " that is due on "
          +this.accountassignee.Due_Date, 
          "Priority "+this.accountassignee.Priority);
          this.accountassignee = new AccountAssigneeModel;
          this.initForm();
          swal('Account Assignment', 'Account Has Been Assigned Successfuly', 'success');
          this.closebutton.nativeElement.click();
          this.isDisabled=false;
        }
        else {
          this.isDisabled=false;
          swal('Failed', d.Status, 'error');
        }
      })
    }

  }

  editaccountassignee(){  
    
   
    debugger
      this.accountassignee.Priority = this.f.Priority.value;
      this.accountassignee.Status = this.f.Status.value;
      this.accountassignee.Due_Date = this.f.DueDate.value.formatted;
      this.accountassignee.Start_Date = this.f.StartDate.value.formatted;
      this.accountassignee.Account_notes = this.f.Notes.value;
      this.accountassignee.Account_AssigneeID = this.accountInfo.A_ID;
  
      var AssignedToUser = this.selecteduserslist.find(e => e.Id == this.accountassignee.Assignedto_UserId);
      this.accountassignee.Assignedto_UserId = AssignedToUser.Id;
      this.accountassignee.Assignedto_UserName = AssignedToUser.UserName;
      this.accountassignee.Assignedto_FullName = AssignedToUser.FullName;
  
      var AssignedByUser = this.selecteduserslist.find(e => e.Id == this.Gv.currentUser.userId);
      this.accountassignee.AssignedBy_UserId = AssignedByUser.Id;
      this.accountassignee.AssignedBy_UserName = AssignedByUser.UserName;
      this.accountassignee.AssignedBy_FullName = AssignedByUser.FullName;
  
      this.accountassignee.PatientAccount = this.accountInfo.Patient_Account;
      this.accountassignee.PatientFullName = this.accountInfo.PatientLastName + ", " + this.accountInfo.PatientFirstName;
      this.accountassignee.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
      
      let New_note = {
                Notes_ID_AL: 35510211,
        AccountAssignee_notes_ID:0,
        Account_notes:this.f.Notes.value,
        Name:this.accountassignee.AssignedBy_FullName ,
        Deleted:null,
        Created_By:this.accountassignee.AssignedBy_UserId ,
        Created_Date:formattedDate,
        Modified_By:null,
        Modified_Date:null,
        modification_allowed:false,
      };
     
    
      if (this.canSave() != false) {
        this.isDisabled=true;
        this.apiService.PostData('/ClaimAssignment/EditAssignedAccounts', this.accountassignee, (d) => {
          if (d.Status == "Success") {
            this.GetUserNotifications(this.Gv.currentUser.selectedPractice.PracticeCode, true);
            this.toaster.success(this.accountassignee.PatientAccount+" Has been assigned To "+ 
            this.accountassignee.Assignedto_FullName + " that is due on "
            +this.accountassignee.Due_Date, 
            "Priority "+this.accountassignee.Priority);


       
          //   this.accountassignee = new AccountAssigneeModel;
          //   this.accountInfo.A_ID = null;
          //  this.accountInfo=null;
            // this.accountassigneenotes = [];
            // this.selecteduserslist = [];
            // this.editaccountuser=[];
            // this.initForm();
            swal('Account Assignment', 'Account Has Been Updated Successfuly', 'success');


            this.accountassigneenotes.push(New_note);
            this.f.Notes.setValue('');
            this.closebutton.nativeElement.click();
            //window.self.close();
            this.isDisabled=false;
          }
          else {
            this.isDisabled=false;
            swal('Failed', d.Status, 'error');
          }
        })
      }
  
    
  }
  

}

