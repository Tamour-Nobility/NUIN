import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { APIService } from '../../../components/services/api.service';
import { Module } from '../../classes/requestResponse';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-module',
  templateUrl: './add-edit-module.component.html',
  styleUrls: ['./add-edit-module.component.css']
})
export class AddEditModuleComponent implements OnInit {
  activatedRouteSub: Subscription;
  ModuleForm: FormGroup;
  objModule: Module;
  iboxAddEditTitle = '';
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService) {
    this.objModule = new Module();
  }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
        this.iboxAddEditTitle = 'Edit Module';
      }
      else {
        this.iboxAddEditTitle = 'Add Module';
      }
    });
    this.InitializeForm();
  }

  InitializeForm(): any {
    this.ModuleForm = new FormGroup({
      moduleName: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace]),
      subModuleName: new FormControl('', [Validators.maxLength(50)])
    });
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetModule?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objModule = res.Response;
        }

        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSaveClick() {
    if (this.ModuleForm.valid) {
      this.apiService.PostData('/UserManagementSetup/SaveModule', this.objModule, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('Module has been saved successfully.', 'Success');
          this.route.navigate(['/users/module']);
          // this.refreshGrid.refresh.next('module');
        } else {
          this.toaster.error('Failure to add Module', response.Status);
        }
      });
    } else {
      this.toaster.warning('Enter Module details.', 'Validation Error');
      return;
    }
  }

  onCancelClick() {
    this.ModuleForm.reset();
    this.route.navigate(['/users/module']);
  }
}
