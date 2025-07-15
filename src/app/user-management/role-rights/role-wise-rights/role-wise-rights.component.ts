import { Component, OnInit } from '@angular/core';

import { SelectListViewModel } from '../../../models/common/selectList.model';
import { APIService } from '../../../components/services/api.service';
import { RoleModulePropertyCreateViewModel, RoleModuleProperty } from '../../classes/requestResponse';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-wise-rights',
  templateUrl: './role-wise-rights.component.html',
  styleUrls: ['./role-wise-rights.component.css']
})
export class RoleWiseRightsComponent implements OnInit {
  rolesList: SelectListViewModel[];
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  selectedRoleId: number;
  constructor(private apiService: APIService,
    private toaster: ToastrService) {
    this.rolesList = [];
    this.items = [];
  }
  ngOnInit() {
    this.GetRoles();
  }
  GetRoles(): any {
    this.apiService.getData('/UserManagementSetup/GetRolesSelectList').subscribe(
      res => {
        if (res.Status == 'Success') {
          this.rolesList = res.Response;
        }
        else {
          this.rolesList = [];
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSelectedChange() {

  }
  onFilterChange() {

  }
  onRoleClick(Id: number) {
    if (Id > 0) {
      this.apiService.getData(`/UserManagementSetup/GetTemplateByRoleId?roleId=${Id}`).subscribe(
        res => {
          if (res.Status == 'Success') {
            this.selectedRoleId = Id;
            this.items = [];
            res.Response.forEach((item) => {
              this.items.push(new TreeviewItem(item));
            });
          }
          else {
            this.selectedRoleId = 0;
            this.toaster.error(res.Status, 'Error');
          }
        });
    }
  }

  onSaveClick() {
    let requestModel = new RoleModulePropertyCreateViewModel(this.GenerateRequestModel(), this.selectedRoleId);
    this.apiService.PostData('/UserManagementSetup/SaveRoleModuleProperties', requestModel, (response) => {
      if (response.Status === 'Success') {
        this.toaster.success('Role Wise Rights has been updated successfully.', 'Success');
      } else {
        this.toaster.success('No changes to save', 'Save Changes');
      }
    });
  }

  GenerateRequestModel(): RoleModuleProperty[] {
    let roleModuleProperties: RoleModuleProperty[] = [];
    this.items.forEach((mod) => {
      if (mod.children != null && mod.children.length > 0) {
        mod.children.forEach((subMod) => {
          if (subMod.children != null && subMod.children.length > 0) {
            subMod.children.forEach((prop) => {
              if (prop.checked) {
                roleModuleProperties.push(new RoleModuleProperty(this.selectedRoleId, mod.value, subMod.value, prop.value));
              }
            });
          }
        });
      }
    });
    return roleModuleProperties;
  }
  onCancelClick() {
    this.apiService.confirmFun('Warning', 'Do you want to reset changes?', () => {
      this.onRoleClick(this.selectedRoleId);
    });
  }
}