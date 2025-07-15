import { Component, ChangeDetectorRef, Output, EventEmitter , Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../components/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ViewChild } from '@angular/core';
import { Common } from '../../services/common/common';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { NpmAlertModel } from '../Classes/Alert';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/data/Alert.service';

@Component({
  selector: 'app-alertassignment',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertAssignmentComponent {
  @ViewChild('closebutton') closebutton;
  @Output() alertDataEvent: EventEmitter<any> = new EventEmitter();
  @Input() disableForm: boolean;


  private isDisabled = false;
  isExpired: boolean = false;
  public isCreateMode = true; 
  showClaimDropDownField: boolean = false;
  // alertmodel: NpmAlertModel;
  today = new Date();
  NpmAlertModelForm: FormGroup;
  // alertmodel: NpmAlertModel = new NpmAlertModel();
  alertmodel = new NpmAlertModel();

  dropdownSettings = {};
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
  claimData: any;
  alertmodelData: any;
  claimDropdownData: any;

  constructor(public router: Router, public route: ActivatedRoute,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    public apiService:APIService,
    private Gv: GvarsService,
    private modalService: BsModalService,
    private alertService: AlertService
  ) {
    //this.alertmodel = new NpmAlertModel();
  }

  // toggleField() {
  //   this.showClaimDropDownField = !this.showClaimDropDownField;
  //   this.cdr.detectChanges();
  // }

//   toggleField() {
//     this.showClaimDropDownField = !this.showClaimDropDownField;
//     if (!this.showClaimDropDownField) {
//       this.NpmAlertModelForm.get('ClaimText').clearValidators(); // Clear validators when checkbox is unchecked
//     } else {
//       this.NpmAlertModelForm.get('ClaimText').setValidators(Validators.required); // Set validators when checkbox is checked
//     }
//     this.NpmAlertModelForm.get('ClaimText').updateValueAndValidity(); // Update validation status
//   }
//   toggleClaim(checked: boolean) {
//     const claimTextControl = this.NpmAlertModelForm.get('ClaimText');
//     if (checked) {
//         // If the checkbox is checked, reset the ClaimText dropdown
//         claimTextControl.setValue([]); // Reset the dropdown value
//         claimTextControl.clearValidators(); // Clear validators
//         claimTextControl.updateValueAndValidity(); // Update validation status
//     }
// }


toggleField(checked: boolean) {
  this.showClaimDropDownField = checked; // Update the showClaimDropDownField based on the checked state of the Claim checkbox

  if (!checked) {
    this.NpmAlertModelForm.get('ClaimText').setValue([]); // Reset the value of ClaimText dropdown to an empty array when the Claim checkbox is unchecked
    this.NpmAlertModelForm.get('ClaimText').clearValidators(); // Clear validators when checkbox is unchecked
  } else {
    this.NpmAlertModelForm.get('ClaimText').setValidators(Validators.required); // Set validators when checkbox is checked
  }

  this.NpmAlertModelForm.get('ClaimText').updateValueAndValidity(); // Update validation status
}



  ngOnInit() {
    debugger
   console.log(" this.Gv.Patient_Account:", this.Gv.Patient_Account);
    this.initForm();
    this.getClaims();
    this.GetAlert();
    
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      maxHeight: 250
    };
       // Set up options for date pickers
       this.setupDatePickers();
    
    // Check if the alert is expired when component initializes
   // this.checkIfExpired();

  }

  onDateInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      event.preventDefault(); // Prevent any keyboard input except Tab
    }
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
        disableUntil: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() - 1 },
        editableDateField: false // Disable manual input
    };
}

  GetAlertData(): void {
    this.alertService.getAlert(); // Trigger alert data retrieval
  }

  isClaimTrue(): boolean {
    return this.alertmodel && this.alertmodel[0] && this.alertmodel[0].Claim;
}

  onclose() {

    this.f.Notes.setValue('');
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
// Helper function to format a date for the date picker
formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
  initForm() {

    this.NpmAlertModelForm = new FormGroup({
      Type:  new FormControl('', [Validators.required]),
      EffectiveFrom: new FormControl(this.getTodayDate(), [Validators.required]),
      Priority:  new FormControl('', [Validators.required]),
      EffectiveTo:  new FormControl(''),
      ApplicableFor:  new FormControl('', [Validators.required]),
      AlertMessage: new FormControl('', [Validators.required]),
      Demographics:  new FormControl(''),
      ClaimSummary:  new FormControl(''),
      Claim:  new FormControl(''),
      ClaimText: new FormControl(''), 
      AddNewClaim:  new FormControl(''),
      AddNewPayment:  new FormControl(''),
      Inactive:  new FormControl(''),
    })

  }

  get f() {
    return this.NpmAlertModelForm.controls;
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


  onTypeUsers(event) {
    this.alertmodel.Type = event.target.value
    console.log('Type value', event.target.value);
  }

  onPrioritychanged(event) {
    this.alertmodel.Priority = event.target.value;
  }

  dateMaskGS(event: any) {
    Common.DateMask(event);
  }

  onDueDateChangeStart(event) {
    this.alertmodel.EffectiveTo = event.formatted;
  }

  onStartDateChangeStart(event) {
    this.alertmodel.EffectiveFrom = event.formatted;
    if(this.alertmodel.EffectiveTo < event.formatted){
      this.NpmAlertModelForm.patchValue( {'EffectiveTo':null} );
}
this.disableUntil()

  }
  disableUntil() {
    debugger
    let d: Date = new Date(this.alertmodel.EffectiveFrom);
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
  // onSubmit() {
  //   var value1 = this.NpmAlertModelForm.controls['Demographics'].value
  //   var value2 = this.NpmAlertModelForm.controls['ClaimSummary'].value
  //   var value3 = this.NpmAlertModelForm.controls['Claim'].value
  //   var value4 = this.NpmAlertModelForm.controls['AddNewPayment'].value
  //   var value5 = this.NpmAlertModelForm.controls['AddNewClaim'].value
    
  
  //   console.log('Controlsss values' , value1,value2, value3,value4,value5);
  //   if(value1 != true && value2!= true && value3!= true  && value4!= true && value5!= true) {
  //    this.toaster.error('Check atleast one checkbox')
  //     return false;
  //   }
  //   return true;
  
  // }

  canSave() {
    debugger
    const formData = this.NpmAlertModelForm.value;
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
    
  if (
    !formData.Demographics &&
    !formData.ClaimSummary &&
    !formData.Claim &&
    !formData.AddNewPayment &&
    !formData.AddNewClaim
  ) {
    this.toaster.warning('Please check at least one option under Apply To.', 'Validation');
    return false;
  }
   // Check if ClaimText has at least one selection
    if (this.showClaimDropDownField && this.NpmAlertModelForm.get('ClaimText').value.length === 0) {
      this.toaster.warning('Please select at least one claim.', 'Validation');
      return false;
    }
    else {
      return true;
    }
  }
  saveAlert() {
    debugger;
    //let checkboxRes = this.onSubmit();

    if (this.canSave() !== false && this.NpmAlertModelForm.valid) {
        const formData = this.NpmAlertModelForm.value;
//var alertID1 = this.alertmodel[0].AlertID;
//console.log('alertID1',alertID1);
var alertID = this.alertmodel && this.alertmodel[0] ? this.alertmodel[0].AlertID : null;
console.log('alertID ',alertID);
        if (alertID == null && this.alertmodel.AlertID == null || alertID == undefined && this.alertmodel.AlertID == undefined|| alertID == 0 && this.alertmodel.AlertID == 0) {
            // Create a new alert
            this.alertmodel = {
                // Create a new object for the new alert
                Type: formData.Type,
                AlertID: 0, // Assign a default value for AlertID (assuming 0 is acceptable for a new alert)
                EffectiveFrom: formData.EffectiveFrom ? formData.EffectiveFrom.formatted : null,
                Priority: formData.Priority,
                EffectiveTo: formData.EffectiveTo ? formData.EffectiveTo.formatted : null,
                ApplicableFor: formData.ApplicableFor,
                AlertMessage: formData.AlertMessage,
                Demographics: formData.Demographics,
                ClaimSummary: formData.ClaimSummary,
                Claim: formData.Claim,
                ClaimText: formData.Claim ? formData.ClaimText.toString() : null,
                AddNewClaim: formData.AddNewClaim,
                AddNewPayment: formData.AddNewPayment,
                Inactive: formData.Inactive,
                Patient_Account: this.Gv.Patient_Account
            };

            // Call the API service to save the data
            this.apiService.PostData('/Alert/SaveAlert', this.alertmodel, (response) => {
                console.log('API Response:', response);

                if (response.Status === 'Success') {
                    swal('Alert', 'Alert Has Been Assigned Successfully', 'success');
                    this.closebutton.nativeElement.click(); // Close the modal
                    this.initForm();
                    this.GetAlert();
                } else {
                    swal('Failed', response.Status, 'error');
                }
            });
        } else {
            // Update an existing alert
            const updatedAlertModel: NpmAlertModel = {
               
                AlertID : alertID,
                Type: formData.Type,
                Priority: formData.Priority,
                EffectiveFrom: formData.EffectiveFrom ? formData.EffectiveFrom.formatted : null,
                EffectiveTo: formData.EffectiveTo ? formData.EffectiveTo.formatted : null,
                ApplicableFor: formData.ApplicableFor,
                AlertMessage: formData.AlertMessage,
                Demographics: formData.Demographics,
                ClaimSummary: formData.ClaimSummary,
                Claim: formData.Claim,
                ClaimText: formData.Claim ? formData.ClaimText.toString() : null,
                AddNewClaim: formData.AddNewClaim,
                AddNewPayment: formData.AddNewPayment,
                Inactive: formData.Inactive,
                Patient_Account: this.Gv.Patient_Account
            };

            // Call the API service to update the existing alert
            this.apiService.PostData('/Alert/SaveAlert', updatedAlertModel, (response) => {
              debugger
              if (response.Status === 'Success') {
                  swal('Alert', 'Alert Has Been Updated Successfully', 'success').then(() => {
                      location.reload();
                  });
                  this.closebutton.nativeElement.click(); // Close the modal
                  this.initForm();
                  this.GetAlert();
              } else {
                  swal('Failed', response.Status, 'error');
              }
              console.log('API Response:', response);
          });
          

            console.log('formData:', formData);
            console.log('this.alertmodel:', this.alertmodel);

            this.markFormGroupAsDirty(this.NpmAlertModelForm);
        }
    } else {
      // this.toaster.error('Form is not valid. Please fill all required fields.');
    }
}

  
  disableALert(){
    this.NpmAlertModelForm.disabled;
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
   
 getClaims() {
    debugger
    this.apiService.getData(`/Demographic/GetClaimAndDos?patientAcc=`+this.Gv.Patient_Account).subscribe(
      res => {
        debugger
        if (res.Status === 'Success') {
          this.claimData = res.Response;
          var resData = []
          for(var i=0;i<res.Response.length;i++){
            var datePipe = new DatePipe("en-US");
            var toDate =  datePipe.transform(res.Response[i].DOS, 'MM/dd/yyyy');
          resData[i] = res.Response[i].Claim_No +'-'+toDate
          }
          debugger
          this.claimDropdownData = resData;
          // console.log("claim and dos are actual:", res.Response);
          // console.log("claim and dos are:", this.claimDropdownData);
        } else {
         // this.toaster.error(res.Status, 'Error');
        }
      },
      error => {
       // console.error('Error occurred:', error);
      //  this.toaster.error('An error occurred while fetching data.', 'Error');
      }
    );
  }

    GetAlert() {
      debugger;
      this.apiService.getData('/Alert/GetAlertForPatient?patientaccount=' + this.Gv.Patient_Account).subscribe(data => {
        debugger
        if (data.Status == 'Success') {
          this.alertmodel = data.Response;
          this.isCreateMode = !this.alertmodel || !this.alertmodel[0] || !this.alertmodel[0].AlertID;
          console.log("GET Alert data : ", this.alertmodel)
          console.log('Alert Model Priority:', this.alertmodel[0].Priority);
          console.log('')
          this.f.Inactive.setValue(this.alertmodel[0].Inactive);
          this.f.Type.setValue(this.alertmodel[0].Type);
          this.f.EffectiveFrom.setValue(this.setDate(this.alertmodel[0].EffectiveFrom));
          this.f.Priority.setValue(this.alertmodel[0].Priority);
          this.f.EffectiveTo.setValue(this.setDate1(this.alertmodel[0].EffectiveTo));
          this.f.ApplicableFor.setValue(this.alertmodel[0].ApplicableFor);
          this.f.AlertMessage.setValue(this.alertmodel[0].AlertMessage);
          this.f.Demographics.setValue(this.alertmodel[0].Demographics);
          this.f.ClaimSummary.setValue(this.alertmodel[0].ClaimSummary);
          this.f.Claim.setValue(this.alertmodel[0].Claim);
          // Check if ClaimText is null before splitting
          if (this.alertmodel[0].ClaimText) {
            this.f.ClaimText.setValue(this.alertmodel[0].ClaimText.split(',').map(item => item.trim()));
          } else {
            this.f.ClaimText.setValue([]);
          }
          this.f.AddNewClaim.setValue(this.alertmodel[0].AddNewClaim);
          this.f.AddNewPayment.setValue(this.alertmodel[0].AddNewPayment);
          this.alertDataEvent.emit(this.alertmodel);
      //             // Function to check if the alert is expired
        // Get the current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        // Convert effectiveToDate string to a Date object
        const effectiveToDate = new Date(this.alertmodel[0].EffectiveTo);
        effectiveToDate.setHours(0, 0, 0, 0);
        // Check if the Effective To date is before the current date
        if (this.alertmodel[0].EffectiveTo==null){
          this.isExpired = false;
        } else if (effectiveToDate<currentDate){
          this.isExpired = effectiveToDate < currentDate;
        }

        }
        else {
          // this.toaster.error(data.Status, 'Error');
        }
      });
  
    }


    toggleDropdown() {
      this.showClaimDropDownField = !this.showClaimDropDownField;
      console.log('Dropdown opened');
    
    }
    
    onDropdownClick(dropdown: any) {
      if (!dropdown.isOpen) {
        console.log('Dropdown opened');
      }
    }
  
}