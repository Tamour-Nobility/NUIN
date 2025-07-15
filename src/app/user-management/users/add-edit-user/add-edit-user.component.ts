import {Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User, UserSelectListsViewModel } from '../../classes/requestResponse';
import { ZipCityStateViewModel } from '../../../models/common/zipCityState.model';
import { APIService } from '../../../components/services/api.service';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { MatchPassword } from '../../../validators/password.validator';
import { ZipCodeLength } from '../../../validators/zipcode.validator';
import { ToastrService } from 'ngx-toastr';
 
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&-_\*])(?=.{8,})");
const emailRegx = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})");
export class zipdata{
  CityName:string;
  State:string;
}
@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})
export class AddEditUserComponent implements OnInit {
  activatedRouteSub: Subscription;
  subscZipCityState: Subscription;
  subEmail: Subscription;
  //added by kamran
  subEmpid:Subscription;
  UserForm: FormGroup;
  objUser: User;
  isEmailAlreadyExist: boolean = false;
  //added by kamran
  isEmployeeExist:boolean = false;
  empIdInitialValue:any=null;
  zipCityStateViewModel: ZipCityStateViewModel;
  iboxAddEditTitle = '';
  userSelectListsViewModel: UserSelectListsViewModel;
  // Multiselect dropdown
  practicesDropdownList = [];
  ZipUser:zipdata[];
  dropdownSettings = {};
  // Multiselect dropdown
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    public Gv: GvarsService,
    private route: Router,
    private refreshGrid: TableRefreshService) {
    this.objUser = new User();
    this.zipCityStateViewModel = new ZipCityStateViewModel();
    this.userSelectListsViewModel = new UserSelectListsViewModel();
    this.practicesDropdownList = [];
    this.empIdInitialValue=null;
    this.ZipUser=[];
  }
 
  ngOnInit() {
    this.InitializeForm();
    this.getDropdownsList();
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
        this.iboxAddEditTitle = 'Edit User';
         // added by kamran for disable input field
         this.disableEmpidField();
         // added by kamran for active by defult
         this.objUser.IsEmployee = true;
         
 
      }
      else {
        this.iboxAddEditTitle = 'Add User';
        this.objUser.IsActive = true;
        // added by kamran   Set IsEmployee to true by default for new user as well
       this.objUser.IsEmployee = true;
      }
    });
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
  }
  // disable emp id by kamran
  disableEmpidField() {
    this.UserForm.get('Empid').disable();
  }
 
  getDropdownsList(): any {
    this.apiService.getData(`/Company/GetCompaniesAndRolesSelectList`)
      .subscribe(res => {
        if (res.Status === 'Sucess') {
          this.userSelectListsViewModel = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
 
  InitializeForm(): any {
    this.UserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(25), ValidateWhiteSpace]),
      mi: new FormControl('', [Validators.maxLength(1)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(25), ValidateWhiteSpace]),
      email: new FormControl('', [Validators.required, Validators.maxLength(256), ValidateWhiteSpace, Validators.pattern(emailRegx)]),
      // added by kamran
      Empid: new FormControl('', [Validators.required, Validators.maxLength(19), ValidateWhiteSpace]),
      pGroup: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8), Validators.pattern(strongRegex)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8)])
      }, { validators: MatchPassword }),
      company: new FormControl(''),
      role: new FormControl('', [Validators.required]),
      isActive: new FormControl(''),
      isEmployee: new FormControl(''),
      zip: new FormControl('', [Validators.required, Validators.maxLength(10), ZipCodeLength]),
      city: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace]),
      state: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace]),
      address: new FormControl('', [Validators.required, Validators.maxLength(250), ValidateWhiteSpace]),
      ngMultiSelect: new FormControl()
    });
  }
 
  getById(id: number): any {
    this.empIdInitialValue=null;
    this.apiService.getData(`/UserManagementSetup/GetUser?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          debugger
          this.objUser = res.Response;
          this.GetCityState(res.Response.PostalCode);
          //..below condition is added to allow Haroon Rashid to edit email id of user's
          if(this.Gv!=null && this.Gv.currentUser!=null && this.Gv.currentUser.userId!=null && this.Gv.currentUser.userId==35510127)
          {
            this.UserForm.controls['email'].enable();
          }else
          {
            this.UserForm.controls['email'].disable();
          }

          this.RemoveValidationOfPassword();
          //.below is added by kamran zafar dated 05/01/2024
          debugger
          this.empIdInitialValue= this.objUser.Empid?this.objUser.Empid:null;
        }
        else {
          this.toaster.success(res.Status, 'Error');
        }
      });
  }
 
  RemoveValidationOfPassword(): any {
    (<FormGroup>this.UserForm.controls['pGroup']).controls['password'].clearValidators();
    (<FormGroup>this.UserForm.controls['pGroup']).controls['confirmPassword'].clearValidators();
    (<FormGroup>this.UserForm.controls['pGroup']).controls['password'].updateValueAndValidity();
    (<FormGroup>this.UserForm.controls['pGroup']).controls['confirmPassword'].updateValueAndValidity();
    (<FormGroup>this.UserForm.controls['pGroup']).controls['password'].updateValueAndValidity();
    this.UserForm.controls['pGroup'].clearValidators();
    this.UserForm.controls['pGroup'].updateValueAndValidity();
  }
 
  onSaveClick() {
    if (this.UserForm.valid && !this.isEmailAlreadyExist) {
      // added by kamran for emp exit
      if (this.UserForm.valid && !this.isEmployeeExist) {
      this.apiService.PostData('/UserManagementSetup/SaveUser', this.objUser, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('User has been saved successfully.', 'Success');
          this.route.navigate(['/users/users']);
          // this.refreshGrid.refresh.next('users');
        } else {
          this.toaster.error('Failure to add detail', 'Error');
        }
      });
    } else {
      this.toaster.warning('Enter User details.', 'Validation Error');
      return;
    }
  }
}
 
  onCancelClick() {
    this.UserForm.reset();
    this.route.navigate(['/users/users']);
  }
 
  GetCityState(zipCode: string) {
    if (zipCode.length > 0 && (zipCode.length == 5 || zipCode.length == 10)) {
      if (this.subscZipCityState != null) {
        this.subscZipCityState.unsubscribe();
      }
      if (zipCode.indexOf('-') > 0) {
        zipCode = zipCode.replace('-', "");
      }
      this.subscZipCityState = this.apiService.getDataWithoutSpinner(`/Demographic/GetCitiesByZipCode?ZipCode=${zipCode}`).subscribe(
        res => {
          if (res.Status == 'Sucess') {

            this.ZipUser = res.Response;
            this.objUser.City = this.ZipUser[0].CityName;
            this.objUser.State = this.ZipUser[0].State;
          } else {
            this.zipCityStateViewModel = new ZipCityStateViewModel();
            this.objUser.City = '';
            this.objUser.State = '';
          }
        });
    }
    else {
      this.zipCityStateViewModel = new ZipCityStateViewModel();
      this.objUser.City = '';
      this.objUser.State = '';
    }
  }
  // Multiselect dropdown
  // onItemSelect(item: any) {
  //   this.objUser.Practices.push(item);
  // }
 
  // onItemDeSelect(items: any) {
  //   let ndx = this.objUser.Practices.findIndex(t => t.Id == items.Id);
  //   if (ndx > -1) {
  //     this.objUser.Practices.splice(ndx, 1);
  //   }
  // }
 
  // onSelectAll(items: any) {
  //   this.objUser.Practices = [];
  //   this.objUser.Practices = items;
  // }
 
  // onDeSelectAll(items: any) {
  //   this.objUser.Practices = [];
  // }
  // Multiselect dropdown
  verifyEmail(email: string) {
    if (this.UserForm.get('email').valid) {
      if (this.subEmail != null) {
        this.subEmail.unsubscribe();
      }
      this.subEmail = this.apiService.getDataWithoutSpinner(`/UserManagementSetup/VerifyEmail?vEmail=${email}`).subscribe(
        res => {
          if (res.Status == 'Success') {
            this.isEmailAlreadyExist = res.Response;
          }
        });
    }
 
  }
  // added by kamran if id is exit
  empIdExists(empId: string) {
    debugger
    if(empId=="")
      {
        this.isEmployeeExist =false;
        this.clearEmpId();
      }
    if (this.UserForm.get('Empid').valid) {
      if (this.subEmpid != null) {
        this.subEmpid.unsubscribe();
      }
      this.subEmpid = this.apiService.getDataWithoutSpinner
      (`/UserManagementSetup/empIdExists?vEmpId=${empId}`).subscribe(
        res => {
          if (res.Status == 'Success') {
            this.isEmployeeExist = res.Response;
          }
        });
    }
  }
 
  // Add a method to your component to clear the Employee ID field
clearEmpId() {
  debugger
  this.UserForm.get('Empid').setValue('');
  this.isEmployeeExist = false;
 
 
}
 
   // added by kamran mark as emp enable or disable
   toggleEmployeeId() {
    debugger
    const isEmployeeChecked = this.UserForm.get('isEmployee').value;
    // If the checkbox is unchecked
    if (!isEmployeeChecked) {
      // Clear the validation state for Employee ID
      this.UserForm.get('Empid').setErrors(null);
      // Reset the isEmployeeExist flag to false
      this.isEmployeeExist = false;
    }
    // Enable or disable the Employee ID field based on the checkbox state
    if (isEmployeeChecked) {
      this.UserForm.get('Empid').enable();
    } else {
      // If it's an add case, clear the Employee ID field when unchecking "Mark as Employee"
      const id = +this.activatedRoute.snapshot.params['id'];
      if (!id || (this.empIdInitialValue==null || this.empIdInitialValue==undefined)) {
        this.clearEmpId();
       
       }
     
      this.UserForm.get('Empid').disable();
     
    }
   }
}