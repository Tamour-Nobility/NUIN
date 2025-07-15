import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SubModuleProperties } from '../../classes/requestResponse';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-edit-properties',
  templateUrl: './add-edit-properties.component.html',
  styleUrls: ['./add-edit-properties.component.css']
})
export class AddEditPropertiesComponent implements OnInit {
  activatedRouteSub: Subscription;
  SubModulePropertiesForm: FormGroup;
  objSubModuleProperties: SubModuleProperties;
  SubModuleFilterSelectControl: FormControl;
  ModuleFilterSelectControl: FormControl;
  subModuleSelectList: SelectListViewModel[];
  modulesSelectList: SelectListViewModel[];
  SelectModuleId: number;
  iboxAddEditTitle = '';
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService) {
    this.objSubModuleProperties = new SubModuleProperties();
    this.subModuleSelectList = [];
    this.modulesSelectList = [];
  }

  ngOnInit() {
    this.InitializeForm();
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
        this.iboxAddEditTitle = 'Edit Property';
      }
      else {
        this.iboxAddEditTitle = 'Add Property';
      }
    });
  }

  InitializeForm(): any {
    this.SubModulePropertiesForm = new FormGroup({
      propertyName: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace])
    });
    this.SubModuleFilterSelectControl = new FormControl('', [Validators.required]);
    this.ModuleFilterSelectControl = new FormControl('', [Validators.required]);
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetSubModuleProperty?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objSubModuleProperties = res.Response;
          if (this.subModuleSelectList == null) {
            this.subModuleSelectList = [];
          }
          if (this.subModuleSelectList.find(t => t.Id == this.objSubModuleProperties.subModule.Sub_Module_Id) == null) {
            this.subModuleSelectList.push(new SelectListViewModel(this.objSubModuleProperties.subModule.Sub_Module_Id, this.objSubModuleProperties.subModule.Sub_Module_Name));
          }
          if (this.modulesSelectList == null) {
            this.modulesSelectList = [];
          }
          if (this.modulesSelectList.find(t => t.Id == this.objSubModuleProperties.ModuleId) == null) {
            this.modulesSelectList.push(new SelectListViewModel(this.objSubModuleProperties.ModuleId, this.objSubModuleProperties.ModuleName));
            this.SelectModuleId = this.objSubModuleProperties.ModuleId;
          }
        }
        else {
          this.toaster.error(res.Status, 'Error')
        }
      });
  }

  onSaveClick() {
    if (this.SubModulePropertiesForm.valid) {
      this.apiService.PostData('/UserManagementSetup/SaveSubModuleProperty', this.objSubModuleProperties, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('Property has been saved.', 'Success');
          this.route.navigate(['/users/properties']);
          // this.refreshGrid.refresh.next('property');
        } else {
          this.toaster.error('Failure to add Sub Module', 'Error');
        }
      });
    } else {
      this.toaster.warning('Enter Sub Module details.', 'Validation Error');
      return;
    }
  }

  onCancelClick() {
    this.SubModulePropertiesForm.reset();
    this.SubModuleFilterSelectControl.reset();
    this.route.navigate(['/users/properties']);
  }

  // ngx-select Module
  onTypeSubModules(value: any) {
    this.apiService.getDataWithoutSpinner(`/UserManagementSetup/GetSubModulesSelectList?searchText=${value}&moduleId=${this.SelectModuleId}`).subscribe(
      res => {
        if (res.Status === 'Success') {
          this.subModuleSelectList = res.Response;
        }
      }
    )
  }
  onTypeModules(value: any) {
    this.apiService.getDataWithoutSpinner(`/UserManagementSetup/GetModulesSelectList?searchText=${value}`).subscribe(
      res => {
        if (res.Status === 'Success') {
          this.modulesSelectList = res.Response;
        }
      }
    )
  }

  onSelectModule(val: any) {
    this.SubModuleFilterSelectControl.reset();
    this.subModuleSelectList = [];
    this.objSubModuleProperties.Sub_Module_Id = null;
  }
  // ngx-select Module
}
