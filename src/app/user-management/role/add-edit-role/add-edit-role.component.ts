import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Role } from '../../classes/requestResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../validators/validateWhiteSpace.validator';
import { ToastrService } from 'ngx-toastr';
// import swal from 'sweetalert';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.css']
})
export class AddEditRoleComponent implements OnInit {
  activatedRouteSub: Subscription;
  RoleForm: FormGroup;
  objRole: Role;
  iboxAddEditTitle = '';
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService) {
    this.objRole = new Role();
  }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
        this.iboxAddEditTitle = 'Edit Role';
      }
      else {
        this.iboxAddEditTitle = 'Add Role';
      }
    });
    this.InitializeForm();
  }

  InitializeForm(): any {
    this.RoleForm = new FormGroup({
      roleName: new FormControl('', [Validators.required, Validators.maxLength(50), ValidateWhiteSpace])
    });
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetRole?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objRole = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSaveClick() {
    if (this.RoleForm.valid) {
      this.apiService.PostData('/UserManagementSetup/SaveRole', this.objRole, (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('Role has been saved', 'Success');
          this.route.navigate(['/users/role']);
          // this.refreshGrid.refresh.next('role');
        } else {
          this.toaster.error('Failure to add Role', 'Error');
        }
      });
    } else {
      this.toaster.warning('Enter Role details.', 'Validation Error');
      return;
    }
  }

  onCancelClick() {
    this.RoleForm.reset();
    this.route.navigate(['/users/role']);
  }
}
