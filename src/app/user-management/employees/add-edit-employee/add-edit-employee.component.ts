import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeViewModel, EmployeeSelectListsViewModel } from '../../classes/requestResponse';
import { ZipCityStateViewModel } from '../../../models/common/zipCityState.model';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ZipCodeLength } from '../../../validators/zipcode.validator';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {
  activatedRouteSub: Subscription;
  subscZipCityState: Subscription;
  EmployeeForm: FormGroup;
  objEmployee: EmployeeViewModel;
  zipCityStateViewModel: ZipCityStateViewModel;
  iboxAddEditTitle = 'Edit Employee';
  employeeSelectListsViewModel: EmployeeSelectListsViewModel;
  public placeholder: string = 'MM/DD/YYYY';

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
  };
  DateOfBirth: string;

  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService,
    private datepipe: DatePipe) {
    this.objEmployee = new EmployeeViewModel();
    this.zipCityStateViewModel = new ZipCityStateViewModel();
    this.employeeSelectListsViewModel = new EmployeeSelectListsViewModel();
  }

  ngOnInit() {
    this.InitializeForm();
    this.GetListsOfSelectLists();
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
      }
    });
  }

  GetListsOfSelectLists(): any {
    this.apiService.getData(`/UserManagementSetup/GetListsOfSelectLists`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.employeeSelectListsViewModel = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  InitializeForm(): any {
    this.EmployeeForm = new FormGroup({
      personalInformationGroup: new FormGroup({
        nic: new FormControl('', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]),
        gender: new FormControl(''),
        maritalStatus: new FormControl(''),
        dob: new FormControl(null)
      }),
      contactInformationGroup: new FormGroup({
        email: new FormControl('', [Validators.maxLength(256), Validators.email]),
        personalContactNumber: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
        homeContactNumber: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
        emergencyContactNumber: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)])
      }),
      addressInformationGroup: new FormGroup({
        permanentZip: new FormControl('', [Validators.maxLength(10), ZipCodeLength]),
        permanentCity: new FormControl('', [Validators.maxLength(50)]),
        permanentState: new FormControl('', [Validators.maxLength(50)]),
        permanentAddress: new FormControl('', [Validators.maxLength(250)])
      })
    });
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetEmployee?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objEmployee = res.Response;
          if (this.objEmployee.Date_Of_Birth != null) {
            this.DateOfBirth = this.datepipe.transform(this.objEmployee.Date_Of_Birth, 'MM/dd/yyyy');
          }
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSaveClick() {
    if (this.EmployeeForm.valid) {
      this.apiService.PostData('/UserManagementSetup/SaveEmployee', this.objEmployee, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('Employee has been updated successfully', 'Success');
          this.route.navigate(['/users/employees']);
          this.refreshGrid.refresh.next('employees');
        }
        //age validation from backend
        // else if (response.Status === 'Age') {
        //   this.toaster.warning('Age of an employee cannot be below 18', 'warning');
        // }
        else {
          this.toaster.error('Failure to add detail', 'Error');
        }
      });
    } else {
      this.toaster.error('Enter Employee details.', 'Validation Error');
      return;
    }
  }

  onCancelClick() {
    this.EmployeeForm.reset();
    this.route.navigate(['/users/employees']);
  }

  GetCityState(zipCode: string) {
    if (zipCode.length > 0 && (zipCode.length == 5 || zipCode.length == 10)) {
      if (this.subscZipCityState != null) {
        this.subscZipCityState.unsubscribe();
      }
      if (zipCode.indexOf('-') > 0) {
        zipCode = zipCode.replace('-', "");
      }
      this.subscZipCityState = this.apiService.getDataWithoutSpinner(`/Demographic/GetCityState?ZipCode=${zipCode}`).subscribe(
        res => {
          if (res.Status == 'Sucess') {
            this.zipCityStateViewModel = res.Response;
            this.objEmployee.Permanent_City = this.zipCityStateViewModel.CityName;
            this.objEmployee.Permanent_State = this.zipCityStateViewModel.State;
          } else {
            this.zipCityStateViewModel = new ZipCityStateViewModel();
            this.objEmployee.Permanent_City = '';
            this.objEmployee.Permanent_State = '';
          }
        });
    }
    else {
      this.zipCityStateViewModel = new ZipCityStateViewModel();
      this.objEmployee.Permanent_City = '';
      this.objEmployee.Permanent_State = '';
    }
  }
  onDateChanged(event: IMyDateModel) {
    this.objEmployee.Date_Of_Birth = event.formatted;
  }
  dateMaskGS(event: any) {
    var v = event.target.value;
    if (v.match(/^\d{2}$/) !== null) {
      event.target.value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      event.target.value = v + '/';
    }
  }
}
