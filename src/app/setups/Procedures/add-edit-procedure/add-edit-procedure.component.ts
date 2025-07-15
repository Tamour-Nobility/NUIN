import { Component, OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { APIService } from '../../../components/services/api.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ProcedureViewModel, ProcedureDropdownListViewModel } from '../models/procedures.model';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-add-edit-procedure',
  templateUrl: './add-edit-procedure.component.html',
  styleUrls: ['./add-edit-procedure.component.css']
})
export class AddEditProcedureComponent implements OnInit {
  ProcedureForm: FormGroup;
  subscriptionDublicateProcedure: Subscription
  ObjProcedure: ProcedureViewModel;
  EffectiveDate: string;
  POSEffectiveDate: string;
  DropdownLists: ProcedureDropdownListViewModel;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
  }
  isDublicateProc: boolean = false;
  title: string;
  constructor(private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router) {
    this.ObjProcedure = new ProcedureViewModel();
    this.DropdownLists = new ProcedureDropdownListViewModel();
  }

  ngOnInit() {
    this.InitForm();
    debugger;
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      let desc = params['Desc'];
      if (id) {
        debugger;
        this.title = 'Edit Procedure';
        this.getById($.trim(id) , desc);

      }
      else {
        this.title = 'Add Procedure';
      }
    });
    this.GetDropdownsListForProcedures();

  }

  GetDropdownsListForProcedures(): any {
    debugger;
    this.apiService.getData(`/Setup/GetDropdownsListForProcedures`).subscribe(
      res => {
        debugger;
        if (res.Status === 'Success') {
          this.DropdownLists = res.Response;
        }
        else {
          swal('Error', res.Status, 'error');
        }
      }
    );
  }

  getById(code,Desc): any {
    const encCode = encodeURIComponent(code);
    debugger
    this.subscriptionDublicateProcedure = this.apiService.getDataWithoutSpinner(`/Setup/GetProcedure?procedureCode=${encCode}&alternateCode=${Desc}`).subscribe(
      res => {
        debugger;
        if (res && res.Status == 'Success') {
          debugger;
          // this.ProcedureForm.get('proCode').disable({ emitEvent: true });
          this.ObjProcedure = res.Response;
          this.ObjProcedure.oldProcCode = this.ObjProcedure.ProcedureCode;
          this.ObjProcedure.oldAlternateCode = this.ObjProcedure.Alternate_Code;
          this.EffectiveDate = this.datePipe.transform(this.ObjProcedure.EffectiveDate, 'MM/dd/yyyy');
          this.POSEffectiveDate = this.datePipe.transform(this.ObjProcedure.ProcedureEffectiveDate, 'MM/dd/yyyy');
          this.ObjProcedure.ProcedureDefaultModifier = this.ObjProcedure.ProcedureDefaultModifier === "null" ? null : this.ObjProcedure.ProcedureDefaultModifier;
          this.ObjProcedure.AgeRangeCriteria = this.ObjProcedure.AgeRangeCriteria === "null" ? null : this.ObjProcedure.AgeRangeCriteria;
          this.ObjProcedure.AgeCategory = this.ObjProcedure.AgeCategory === "null" ? null : this.ObjProcedure.AgeCategory;
          this.ObjProcedure.ProcedurePosCode = this.ObjProcedure.ProcedurePosCode === "null" ? null : this.ObjProcedure.ProcedurePosCode;
          this.ObjProcedure.GenderAppliedOn = this.ObjProcedure.GenderAppliedOn === "null" ? null : this.ObjProcedure.GenderAppliedOn;




        }
        else {
          this.ObjProcedure = new ProcedureViewModel();
          swal('Procedure', 'Error Occured', 'error');
        }
      }, error => {
        swal('Procedure', 'Error Occured', 'error');
      }, () => {

      });
  }
  

  InitForm(): any {
    this.ProcedureForm = new FormGroup({
      proCode: new FormControl('', [Validators.required, ValidateWhiteSpace, Validators.maxLength(5)]),
      description: new FormControl('', [Validators.required, ValidateWhiteSpace, Validators.maxLength(255)]),
      longDescription: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      defaultCharge: new FormControl('0.00'),
      defaultModifier: new FormControl(''),
      posCode: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      effectiveDate: new FormControl('', [Validators.required]),
      genderAppliedOn: new FormControl(''),
      ageCategory: new FormControl(''),
      ageRange: new FormControl(''),
      ageFrom: new FormControl('', [Validators.maxLength(4)]),
      ageTo: new FormControl('', [Validators.maxLength(4)]),
      proEffectiveDate: new FormControl(''),
      cliaNumber: new FormControl(''),
      qualifier: new FormControl(''),
      mxUnits: new FormControl('', [Validators.maxLength(4)]),
      inclInEDI: new FormControl('1'),
      componentCode: new FormControl('', [Validators.maxLength(4)]),
      alternateCode: new FormControl(''),
      CPTDosage: new FormControl('', [Validators.maxLength(10)])
    });
  }

  onProcedureCodeChange(event: any) {
    let code = event.target.value;
    if (code && code.length > 0) {
      this.isDublicateProc = true;
      if (!isNullOrUndefined(this.subscriptionDublicateProcedure)) {
        this.subscriptionDublicateProcedure.unsubscribe();
      }
      this.subscriptionDublicateProcedure = this.apiService.getDataWithoutSpinner(`/Setup/GetProcedure?procedureCode=${code}`).subscribe(
        res => {
          if (res && res.Status == 'Success') {
            if (!isNullOrUndefined(res.Response)) {
              this.isDublicateProc = true;
            }
            else {
              this.isDublicateProc = false;
            }
          }
          else {
            this.isDublicateProc = false;
          }
        }, error => {
          swal('Procedure', 'Error Occured', 'error');
        }, () => {

        });
    }
  }
  validateAmountInput(event: any) {
    let value = event.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-dot characters
    value = value.replace(/^0+(?=\d)/, ''); // Remove leading zeros
    const decimalCount = (value.match(/\./g) || []).length;
    
    if (decimalCount > 1) {
      value = value.substring(0, value.lastIndexOf('.')); // Remove extra decimal points
    }
    
    if (value.split('.')[1].length > 2) {
      value = parseFloat(value).toFixed(2); // Limit to 2 decimal places
    }
  
    this.ObjProcedure.ProcedureDefaultCharge = value;
  }
  restrictInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Allow only numbers and one decimal point
    if (!charStr.match(/[0-9.]/) || (charStr === '.' && inputValue.includes('.'))) {
      event.preventDefault();
    }
  }
  
  restrictPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
  
    // Prevent invalid pasted input
    if (!/^\d*\.?\d{0,2}$/.test(pastedText)) {
      event.preventDefault();
    }
  }
  
  formatInput(event: any) {
    let value = event.target.value;
  
    // Remove unwanted characters
    value = value.replace(/[^0-9.]/g, '');
  
    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
  
    // Restrict to two decimal places
    if (value.includes('.')) {
      const [integer, decimal] = value.split('.');
      value = integer + '.' + (decimal.substring(0, 2) || '');
    }
  
    event.target.value = value;
    this.ObjProcedure.ProcedureDefaultCharge = value; // Ensure ngModel updates correctly
  }
  
  
 
  

  onSave() {
    const ageRange = this.ProcedureForm.get('ageRange').value;
    let ageFrom = this.ProcedureForm.get('ageFrom').value;
    let ageTo = this.ProcedureForm.get('ageTo').value;
    const alterCode = this.ProcedureForm.get('alternateCode').value;
    const proceCode = this.ProcedureForm.get('proCode').value;

     ageFrom = ageFrom ? Number(ageFrom) : null;
     ageTo = ageTo ? Number(ageTo) : null;
   
   
    if((ageRange && ageRange !== null) && ageRange !== 'Between' && !ageFrom){
      swal('Validation', 'Enter Age when Age Range is selected', 'error');
      return;
    }
    if(ageFrom && ageTo && ageFrom > ageTo)
    {
      swal('Validation', 'Age From must be less than Age To. Please enter valid age range.', 'error');
      return;


    }

    if((ageRange && ageRange !== null) && ageRange === 'Between' && (!ageFrom || !ageTo ))
    {

      swal('Validation', "Both Age From and Age To must be entered when option 'Between' is chosen.", 'error');
      return;

    }
    if(proceCode.length < 5)
      {
        swal('Validation', "CPT code must be exactly 5 digits long.", 'error');
        return;

      }
      if(alterCode && alterCode.length < 5)
        {
          swal('Validation', 'Alternate code must be exactly 5 digits long.', 'error');
          return;

        }

       if(this.title !== 'Edit Procedure'){
        this.ObjProcedure.oldProcCode = this.ObjProcedure.ProcedureCode;
        this.ObjProcedure.oldAlternateCode =  this.ObjProcedure.Alternate_Code;
       }
       this.saveProcedureDetails();
    
      
  }
  saveProcedureDetails(){
    if(this.ObjProcedure.Alternate_Code === undefined || this.ObjProcedure.Alternate_Code === null || this.ObjProcedure.Alternate_Code === ""){
      this.ObjProcedure.Alternate_Code = ''
    }

    if(this.title === 'Edit Procedure'){

      if(this.ObjProcedure.ProcedureCode !== this.ObjProcedure.oldProcCode || this.ObjProcedure.Alternate_Code !== this.ObjProcedure.oldAlternateCode){

      this.apiService.getData('/Setup/DuplicateProcAndAlternateCode?AlternateCode='+ this.ObjProcedure.Alternate_Code + '&ProcCode='+  this.ObjProcedure.ProcedureCode).subscribe(
        d => {

          if(d.Status !== null) {
          swal('Procedures',d.Status,'error')
          }else{

            console.log('Add Procedure', this.ObjProcedure);
            if (this.ProcedureForm.valid) {
              this.apiService.PostData('/Setup/SaveProcedure', this.ObjProcedure, (data) => {
                console.log('Add Procedure', this.ObjProcedure);

                if (data.Status == 'Success') {
                 swal('Procedures', 'Procedure code updated successfully', 'success');
                  this.router.navigate(['procedures']);
                } else {
                  swal('Procedures', data.Status, 'error');
                }
              });
            } else {
              swal('Validation Error', 'Please provide required values', 'info');
            }
          }
        })
      }
        else{

            console.log('Add Procedure', this.ObjProcedure);
            if (this.ProcedureForm.valid) {
              this.apiService.PostData('/Setup/SaveProcedure', this.ObjProcedure, (data) => {
                console.log('Add Procedure', this.ObjProcedure);

                if (data.Status == 'Success') {
                  this.title === 'Edit Procedure' ? swal('Procedures', 'Procedure code updated successfully', 'success') : swal('Procedures', 'Procedure code added successfully', 'success');
                  this.router.navigate(['procedures']);
                } else {
                  swal('Procedures', data.Status, 'error');
                }
              });
            } else {
              swal('Validation Error', 'Please provide required values', 'info');
            }
          }
    }else{
    this.apiService.getData('/Setup/DuplicateProcAndAlternateCode?AlternateCode='+ this.ObjProcedure.Alternate_Code + '&ProcCode='+  this.ObjProcedure.ProcedureCode).subscribe(
      d => {
        debugger;
        if(d.Status !== null) {
        swal('Procedures',d.Status,'error')
        }else{
          debugger;
          console.log('Add Procedure', this.ObjProcedure);
          if (this.ProcedureForm.valid) {
            this.apiService.PostData('/Setup/SaveProcedure', this.ObjProcedure, (data) => {
              console.log('Add Procedure', this.ObjProcedure);
              debugger;
              if (data.Status == 'Success') {
                this.title === 'Edit Procedure' ? swal('Procedures', 'Procedure code updated successfully', 'success') : swal('Procedures', 'Procedure code added successfully', 'success');
                this.router.navigate(['procedures']);
              } else {
                swal('Procedures', data.Status, 'error');
              }
            });
          } else {
            swal('Validation Error', 'Please provide required values', 'info');
          }
        }
        });
      }
 
  }


  onChangeGenderAppliedOn(selectedValue: any) {
    if (selectedValue === "Male") {
      if (this.ObjProcedure.AgeCategory === "Meternity") {
        this.ProcedureForm.get('ageCategory').reset();
        this.ProcedureForm.get('ageCategory').updateValueAndValidity();
      }
    }
  }

  onAgeRangeChange(selectedValue: any) {
    debugger
    if(selectedValue === '0: null'){
            this.ProcedureForm.get('ageFrom').reset();
            this.ProcedureForm.get('ageTo').reset();


    }
    // if (selectedValue == 'Between') {
    //   this.ProcedureForm.get('ageFrom').setValidators([Validators.required]);
    //   this.ProcedureForm.get('ageFrom').updateValueAndValidity({ onlySelf: true, emitEvent: true });
    //   this.ProcedureForm.get('ageTo').setValidators([Validators.required]);
    //   this.ProcedureForm.get('ageTo').updateValueAndValidity({ onlySelf: true, emitEvent: true });
    // }
    // else {
    //   this.ProcedureForm.get('ageFrom').clearValidators();
    //   this.ProcedureForm.get('ageTo').clearValidators();
    //   this.ProcedureForm.get('ageFrom').setValidators([Validators.maxLength(4)]);
    //   this.ProcedureForm.get('ageFrom').updateValueAndValidity({ onlySelf: true, emitEvent: true });
    //   this.ProcedureForm.get('ageTo').setValidators([Validators.maxLength(4)]);
    //   this.ProcedureForm.get('ageTo').updateValueAndValidity({ onlySelf: true, emitEvent: true });

    // }
  }
 
  // my date picker methods
  dateMaskGS(event: any) {
    var v = event.target.value;
    if (v.match(/^\d{2}$/) !== null) {
      event.target.value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      event.target.value = v + '/';
    }
  }

  onEffectiveDateChanged(event: IMyDateModel) {
    this.ObjProcedure.EffectiveDate = new Date(event.formatted);
  }

  onProcEffectiveDateChanged(event: IMyDateModel) {
    this.ObjProcedure.ProcedureEffectiveDate = new Date(event.formatted);
  }
  // my date picker methods
}
