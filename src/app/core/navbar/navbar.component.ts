import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatchPassword } from '../../validators/password.validator';
import { ResetPasswordForUserViewModel } from '../../../app/user-management/classes/requestResponse';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../components/services/api.service';
import { ClaimService } from '../../services/claim/claim.service';
import {  ClaimAssigneeNotifications, AccountAssigneeNotifications } from '../../Claims/Classes/ClaimAssignee';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { LoginAlertModel } from '../../patient/Classes/Alert';
import { Common } from '../../services/common/common';
import { IMyDate } from 'mydaterangepicker';
import { IMyDpOptions } from 'mydatepicker';
declare var $: any;
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&-_\*])(?=.{8,})");
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  loggedInUser: CurrentUserViewModel;
  loginalertmodel = new LoginAlertModel();
  @ViewChild('setups') setups: ElementRef;
  @ViewChild(ModalDirective)alertModal:ModalDirective;
  @ViewChild('closebutton') closebutton;
  @Output() alertDataEvent: EventEmitter<any> = new EventEmitter();
  isSetup: boolean = false;
  currentUser: CurrentUserViewModel;
  collapse: boolean = true;
  PasswordResetForm: FormGroup;
  LoginAlertModelForm: FormGroup;
  objResetPasswordViewModel: ResetPasswordForUserViewModel;
  isDisabled:boolean = false;
  count:number=0;
  countclaimnotifications:number=0;
  countaccountnotifications:number=0;
  claimuser: ClaimAssigneeNotifications[];
 accountuse: AccountAssigneeNotifications[];
  isModalActive = false;
  isExpired: boolean = false;
  public isCreateMode = true; 
  selDateDD: IMyDate = {
    day: 0,
    month: 0,
    year: 0
  };
  selDateET: IMyDate = {
    day: 0,
    month: 0,
    year: 0
  };
  today = new Date();
  constructor(private authService: AuthService,
    private apiService: APIService,
    private gvService: GvarsService,
    private cd: ChangeDetectorRef,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private claimservice:ClaimService
    ) {
      this.objResetPasswordViewModel = new ResetPasswordForUserViewModel();
      this.claimuser=[]; 
      this.accountuse=[];

      this.claimservice.claimassigneenotifications.subscribe(res =>{
          this.countclaimnotifications =res;
      });

      this.claimservice.accountassigneenotifications.subscribe(res =>{
          this.countaccountnotifications =res;
      });

     }

  ngOnInit() {
    this.IsButtonDisable();
    // $('#setups').on('shown.bs.collapse', function () {
    //   $(".servicedrop").addClass('fa fa-minus').removeClass('fa fa-plus');
    // });

    // $('#setups').on('hidden.bs.collapse', function () {
    //   $(".servicedrop").addClass('fa fa-plus').removeClass('fa fa-minus');
    // });
    this.InitializeForm();
    this.initForm();
    this.GetLoginAlert();
    debugger;
    this.PasswordResetForm.reset();
    this.loggedInUser = this.gvService.currentUser;
    this.objResetPasswordViewModel.UserName=this.loggedInUser.unique_name;
   // this.GetUsers();
   this.claimservice.GetUsersClaimNotifications(this.gvService.currentUser.selectedPractice.PracticeCode, true);
   this.claimservice.GetUsersAccountNotifications(this.gvService.currentUser.selectedPractice.PracticeCode, true); 
        // Set up options for date pickers
        this.setupDatePickers();
  }

//alert enhancement
initForm() {

  this.LoginAlertModelForm = new FormGroup({
    Type:  new FormControl('N', [Validators.required]),
    EffectiveFrom: new FormControl(this.getTodayDate(), [Validators.required]),
    Priority:  new FormControl('', [Validators.required]),
    EffectiveTo:  new FormControl(''),
    ApplicableFor:  new FormControl('A', [Validators.required]),
    AlertMessage: new FormControl('', [Validators.required]),
    Inactive:  new FormControl(''),
  })

}

get f() {
  return this.LoginAlertModelForm.controls;
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
setDate1(date: string) {
  if (!Common.isNullOrEmpty(date)) {
    let dDate = new Date(date);
    this.selDateET = {
      year: dDate.getFullYear(),
      month: dDate.getMonth() + 1,
      day: dDate.getDate()
    };
  }
}

// Helper function to get today's date in the correct format for the date picker
getTodayDate(): any {
  const today = new Date();
  return {
      date: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
      },
      jsdate: today,
      formatted: this.formatDate(today),
      epoc: 0
  };
}
formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
//



  ngAfterViewInit(): void {
    if (this.setups.nativeElement.children.length > 0)
      this.isSetup = true;
    this.isSetup = false;
  }

  onClickUnderDevModule() {
    return swal('Coming Soon', 'Selected module is under development.', 'info');
  }
  InitializeForm(): any {
    this.PasswordResetForm = new FormGroup({
      pGroup: new FormGroup({
        userName:new FormControl('',[Validators.required]),
        OldPassword: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8), Validators.pattern(strongRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8), Validators.pattern(strongRegex)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8)])
      }, { validators: MatchPassword })
    })
  }
  show(): any {
    this.PasswordResetForm.reset();
    // $('#passwordResetModal').modal('show');
  }

  hide(): any {
    // $('#passwordResetModal').modal('hide');
  }

  onClickLogout() {
    this.authService.Logout();
  }
  onClickChangePassword() {
    this.PasswordResetForm.reset();
    this.objResetPasswordViewModel.UserName=this.loggedInUser.unique_name;
    this.PasswordResetForm.get('pGroup.userName').setValue(this.loggedInUser.unique_name)
    $('#passwordResetfORUserModal').modal('toggle');
  }
  onClickAlert() {
    // this.modalService.open(this.alertModal, { centered: true });
    this.alertModal.show(); 
    this.isModalActive = true; // Show the modal
  }
  showAlert() {
    debugger
    //set the modal body static.will close on click OK or Cross
    const modalOptions: ModalOptions = {
      backdrop: 'static'
    };
    this.alertModal.config = modalOptions;
  this.alertModal.show();
  this.GetLoginAlert();
  }
  onclose(){
    this.f.AlertMessage.setValue('');
    this.f.Priority.setValue('');
    this.f.EffectiveTo.setValue('');
    this.alertModal.hide();
  }
  onStartDateChangeStart(event) {
    this.loginalertmodel.EffectiveFrom = event.formatted;
    if(this.loginalertmodel.EffectiveTo < event.formatted){
      this.LoginAlertModelForm.patchValue( {'EffectiveTo':null} );
}
this.disableUntil()

  }
  disableUntil() {
    debugger
    let d: Date = new Date(this.loginalertmodel.EffectiveFrom);
    d.setDate(d.getDate() - 1);
    let copy: IMyDpOptions = this.getCopyOfOptions();
    copy.disableUntil = {year: d.getFullYear(), 
                         month: d.getMonth() + 1, 
                         day: d.getDate()};
    this.myDatePickerOptions = copy;
}
getCopyOfOptions(): IMyDpOptions {
  return JSON.parse(JSON.stringify(this.myDatePickerOptions));
}
setupDatePickers() {
  const today = new Date();
  this.myDateRangePickerOptions = {
      dateFormat: 'mm/dd/yyyy',
      height: '25px',
      width: '100%',
      disableUntil: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate() - 1,
      }
  };
  this.myDatePickerOptions = {
    height: '25px',
      width: '100%',
      disableUntil: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() - 1 },
      editableDateField: false // Disable manual input
  };
}

onDateInputKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Tab') {
    event.preventDefault(); // Prevent any keyboard input except Tab
  }
}
onDueDateChangeStart(event) {
  this.loginalertmodel.EffectiveTo = event.formatted;
}
  onSaveClick() {
    if (this.PasswordResetForm.valid) {
      this.objResetPasswordViewModel.UserId = this.loggedInUser.userId;
      this.apiService.PostData('/UserManagementSetup/ResetPasswordByUser', this.objResetPasswordViewModel, (response) => {
        if (response.Status === 'Success') {
          this.hide();
          this.toaster.success('Password has been reset successfully.', 'Reset Password');
        } else {
          this.toaster.error(response.Status, 'Error');
        }
      });
    } else {
      this.toaster.warning('Enter password details.', 'Validation');
      return;
    }
}
  Hide(moduleName: string): boolean {

 
    if (this.loggedInUser.Menu.findIndex(t => t.toLowerCase().trim() === moduleName.toLowerCase().trim()) > -1) {

      if (this.setups.nativeElement.children.length > 0) {
        this.isSetup = true;
      } else {
        this.isSetup = false;
      }
      return false;
    }
    if (this.setups.nativeElement.children.length > 0) {
      this.isSetup = true;
    } else {
      this.isSetup = false;
    }
    return true;
  }

  ComingSoon() {
    swal('Coming Soon', 'Selected module in under development', 'info');
  }

  isReportingPerson() {
    return this.gvService.isReportingPerson();
  }


  IsButtonDisable(){
    debugger
     this.isDisabled= this.gvService.IsbuttonDisable();
   
   
    }

    //alert enchancement
    isNullOrEmptyString(str: string): boolean {
      if (str == undefined || str == null || $.trim(str) == '')
        return true;
      else
        return false;
    }
  
        // Recursive function to mark all controls in the form group as dirty
        markFormGroupAsDirty(formGroup: FormGroup) {
          Object.values(formGroup.controls).forEach(control => {
            if (control instanceof FormControl) {
              control.markAsDirty();
            } else if (control instanceof FormGroup) {
              this.markFormGroupAsDirty(control);
            }
          });
        }
    
    canSave() {
      debugger
      const formData = this.LoginAlertModelForm.value;
       // Validate Effective From
       const effectiveFromDate = formData.EffectiveFrom;
       if (!effectiveFromDate || effectiveFromDate === '') {
           this.toaster.warning('Please select Effective From date.', 'Validation');
           return false;
       }
     
      if (this.isNullOrEmptyString(formData.Type)) {
        this.toaster.warning('Please select Type.', 'Validation');
        return false;
      }
      debugger
      if (this.isNullOrEmptyString(formData.Priority)) {
        this.toaster.warning('Please select Priority.', 'Validation');
        return false;
      }
      
      if (this.isNullOrEmptyString(formData.ApplicableFor)) {
        this.toaster.warning('Please select ApplicableFor.', 'Validation');
        return false;
      }
      
      if (this.isNullOrEmptyString(formData.AlertMessage)) {
        this.toaster.warning('Please provide Notes.', 'Validation');
        return false;
      }
    }
    saveLoginAlert() {
      debugger;
      //let checkboxRes = this.onSubmit();
  
      if (this.canSave() !== false && this.LoginAlertModelForm.valid) {
          const formData = this.LoginAlertModelForm.value;
  //var alertID1 = this.alertmodel[0].AlertID;
  //console.log('alertID1',alertID1);
  var alertID = this.loginalertmodel && this.loginalertmodel[0] ? this.loginalertmodel[0].AlertID : null;
  console.log('alertID ',alertID);
          if (alertID == null && this.loginalertmodel.AlertID == null || alertID == undefined && this.loginalertmodel.AlertID == undefined|| alertID == 0 && this.loginalertmodel.AlertID == 0) {
              // Create a new alert
              this.loginalertmodel = {
                  // Create a new object for the new alert
                  Type: formData.Type,
                  AlertID: 0, // Assign a default value for AlertID (assuming 0 is acceptable for a new alert)
                  EffectiveFrom: formData.EffectiveFrom ? formData.EffectiveFrom.formatted : null,
                  Priority: formData.Priority,
                  EffectiveTo: formData.EffectiveTo ? formData.EffectiveTo.formatted : null,
                  ApplicableFor: formData.ApplicableFor,
                  AlertMessage: formData.AlertMessage,
                  Login: formData.Login,
                  Inactive: formData.Inactive,
                };
  
              // Call the API service to save the data
              this.apiService.PostData('/Alert/SaveLoginAlert', this.loginalertmodel, (response) => {
                  console.log('API Response:', response);
  
                  if (response.Status === 'Success') {
                      swal('Alert', 'Alert Has Been Assigned Successfully', 'success');
                      this.closebutton.nativeElement.click(); // Close the modal
                      this.initForm();
                      this.GetLoginAlert();
                  } else {
                      swal('Failed', response.Status, 'error');
                  }
              });
          } else {
              // Update an existing alert
              const updatedAlertModel: LoginAlertModel = {
                 
                  AlertID : alertID,
                  Type: formData.Type,
                  Priority: formData.Priority,
                  EffectiveFrom: formData.EffectiveFrom ? formData.EffectiveFrom.formatted : null,
                  EffectiveTo: formData.EffectiveTo ? formData.EffectiveTo.formatted : null,
                  ApplicableFor: formData.ApplicableFor,
                  AlertMessage: formData.AlertMessage,
                  Login: formData.Login,
                  Inactive: formData.Inactive,
          
              };
  
              // Call the API service to update the existing alert
              this.apiService.PostData('/Alert/SaveLoginAlert', updatedAlertModel, (response) => {
                debugger
                if (response.Status === 'Success') {
                    swal('Alert', 'Alert Has Been Updated Successfully', 'success').then(() => {
                        location.reload();
                    });
                    this.closebutton.nativeElement.click(); // Close the modal
                    this.initForm();
                    this.GetLoginAlert();
                } else {
                    swal('Failed', response.Status, 'error');
                }
                console.log('API Response:', response);
            });
            
  
              console.log('formData:', formData);
              console.log('this.alertmodel:', this.loginalertmodel);
  
              this.markFormGroupAsDirty(this.LoginAlertModelForm);
          }
      } else {
        // this.toaster.error('Form is not valid. Please fill all required fields.');
      }
  }

  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1,
    },
    editableDateField: false, // This prevents manual input of dates
  };
  myDatePickerOptions: IMyDpOptions = {
    disableUntil: {year:  this.today.getFullYear(), month:  this.today.getMonth() + 1, day: this.today.getDate() - 1},
    editableDateField: false, // This prevents manual input of dates
}
myDateRangePickerOptions1: IMyDpOptions = {
  dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
  disableUntil: {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1,
    day: this.today.getDate() - 1,
  },
};

  GetLoginAlert() {
    debugger;
    this.apiService.getData('/Alert/GetLoginAlert').subscribe(data => {
      debugger
      if (data.Status == 'Success') {
        this.loginalertmodel = data.Response;
        this.isCreateMode = !this.loginalertmodel || !this.loginalertmodel[0] || !this.loginalertmodel[0].AlertID;
        console.log("GET Alert data : ", this.loginalertmodel)
        console.log('Alert Model Priority:', this.loginalertmodel[0].Priority);
        console.log('')
        this.f.Inactive.setValue(this.loginalertmodel[0].Inactive);
        this.f.Type.setValue(this.loginalertmodel[0].Type);
        this.f.EffectiveFrom.setValue(this.setDate(this.loginalertmodel[0].EffectiveFrom));
        this.f.Priority.setValue(this.loginalertmodel[0].Priority);
        this.f.EffectiveTo.setValue(this.setDate1(this.loginalertmodel[0].EffectiveTo));
        this.f.ApplicableFor.setValue(this.loginalertmodel[0].ApplicableFor);
        this.f.AlertMessage.setValue(this.loginalertmodel[0].AlertMessage);
        this.alertDataEvent.emit(this.loginalertmodel);
    //             // Function to check if the alert is expired
      // Get the current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      // Convert effectiveToDate string to a Date object
      const effectiveToDate = new Date(this.loginalertmodel[0].EffectiveTo);
      effectiveToDate.setHours(0, 0, 0, 0);
      // Check if the Effective To date is before the current date
      if (this.loginalertmodel[0].EffectiveTo==null){
        this.isExpired = false;
        console.log('this.isExpired ',this.isExpired )
      } else if (effectiveToDate<currentDate){
        this.isExpired = effectiveToDate < currentDate;
        console.log('this.isExpired ',this.isExpired )
      }

      }
      else {
        // this.toaster.error(data.Status, 'Error');
      }
    });

  }

  alertRole() : boolean {
    var result = this.gvService.alertRole();
    return result;
    
  }

    //
}
