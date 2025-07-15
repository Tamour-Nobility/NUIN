import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SubModule } from '../../classes/requestResponse';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-edit-sub-module',
  templateUrl: './add-edit-sub-module.component.html',
  styleUrls: ['./add-edit-sub-module.component.css']
})
export class AddEditSubModuleComponent implements OnInit {
  activatedRouteSub: Subscription;
  SubModuleForm: FormGroup;
  objSubModule: SubModule;
  ModuleFilterSelectControl: FormControl;
  moduleSelectList: SelectListViewModel[];
  moduleSelectListBackup: SelectListViewModel[];
  iboxAddEditTitle = '';

  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService) {
    this.objSubModule = new SubModule();
    this.moduleSelectList = [];
    this.moduleSelectListBackup = [];
  }

  ngOnInit() {
    this.InitializeForm();
    this.GetModulesList();
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
        this.iboxAddEditTitle = 'Edit Sub Module';
      }
      else {
        this.iboxAddEditTitle = 'Add Sub Module';
      }
    });
  }

  InitializeForm(): any {
    this.SubModuleForm = new FormGroup({
      subModuleName: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace]),
      isDefaultPropertiesCheck: new FormControl('')
    });
    this.ModuleFilterSelectControl = new FormControl('', [Validators.required]);
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetSubModule?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objSubModule = res.Response;
          if (this.moduleSelectList == null) {
            this.moduleSelectList = [];
          }
          if (this.moduleSelectList.find(t => t.Id == this.objSubModule.module.Module_Id) == null) {
            this.moduleSelectList.push(new SelectListViewModel(this.objSubModule.module.Module_Id, this.objSubModule.module.Module_Name));
          }
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSaveClick() {
    if (this.SubModuleForm.valid) {
      this.apiService.PostData('/UserManagementSetup/SaveSubModule', this.objSubModule, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('Sub Module has been saved successfully', 'Success');
          this.route.navigate(['/users/submodule']);
          // this.refreshGrid.refresh.next('subModule');
        } else {
          this.toaster.error(response.Status, 'Failure to add Sub Module');
        }
      });
    } else {
      this.toaster.warning('Enter Sub Module details.', 'Validation Error');
      return;
    }
  }

  onCancelClick() {
    this.SubModuleForm.reset();
    this.ModuleFilterSelectControl.reset();
    this.route.navigate(['/users/submodule']);
  }

  // ngx-select Module
  onTypeModules(value: any) {
    this.moduleSelectList = JSON.parse(JSON.stringify(this.moduleSelectListBackup.filter(f => f.Name.toLowerCase().includes(value.toLowerCase()))));
  }

  GetModulesList(): any {
    this.apiService.getDataWithoutSpinner(`/UserManagementSetup/GetModulesSelectList?searchText=`).subscribe(
      res => {
        if (res.Status === 'Success') {
          this.moduleSelectListBackup = JSON.parse(JSON.stringify(res.Response));
        }
      }
    )
  }
  // ngx-select Module
}