import { Component, OnInit } from '@angular/core';

import { SelectListViewModel } from '../../../models/common/selectList.model';
import { APIService } from '../../../components/services/api.service';
import { UserModuleProperty, UserModulePropertyCreateViewModel } from '../../classes/requestResponse';
import { FormControl } from '@angular/forms';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-users-wise-rights',
  templateUrl: './users-wise-rights.component.html',
  styleUrls: ['./users-wise-rights.component.css']
})
export class UsersWiseRightsComponent implements OnInit {
  usersSelectList: SelectListViewModel[];
  userSelectListBackup: SelectListViewModel[];
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  selectedUserId: number;
  ngxSelectUser = new FormControl();
  constructor(private apiService: APIService,
    private toaster: ToastrService) {
    this.usersSelectList = [];
    this.items = [];
    this.userSelectListBackup = [];
  }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers(): any {
    this.apiService.getData('/UserManagementSetup/GetUsersSelectList').subscribe(
      res => {
        if (res.Status == 'Success') {
          this.userSelectListBackup = res.Response;
        }
        else {
          this.usersSelectList = [];
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSelectedChange() {

  }
  onFilterChange() {

  }
  onSelectUser(Id: any) {
    this.apiService.getData(`/UserManagementSetup/GetTemplateByUserId?userId=${Id}`).subscribe(
      res => {
        if (res.Status == 'Success') {
          this.selectedUserId = Id;
          this.items = [];
          res.Response.forEach((item) => {
            this.items.push(new TreeviewItem(item));
            console.log(this.items);
          });
        }
        else {
          this.selectedUserId = 0;
          this.toaster.error(res.Status, 'Error');
        }
      });
  }

  onSaveClick() {
    let requestModel = new UserModulePropertyCreateViewModel(this.GenerateRequestModel(), this.selectedUserId);
    this.apiService.PostData('/UserManagementSetup/SaveUserModuleProperties', requestModel, (response) => {
      if (response.Status === 'Success') {
        this.toaster.success('User wise rights has been updated successfully.', 'Success');
      } else {
        this.toaster.warning('No changes to save', 'Error');
      }
    });
  }

  GenerateRequestModel(): UserModuleProperty[] {
    let roleModuleProperties: UserModuleProperty[] = [];
    this.items.forEach((mod) => {
      if (mod.children != null && mod.children.length > 0) {
        mod.children.forEach((subMod) => {
          if (subMod.children != null && subMod.children.length > 0) {
            subMod.children.forEach((prop) => {
              if (prop.checked) {
                roleModuleProperties.push(new UserModuleProperty(this.selectedUserId, mod.value, subMod.value, prop.value));
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
      this.onSelectUser(this.selectedUserId);
    });
  }

  onTypeUsers(value: string) {
    this.usersSelectList = JSON.parse(JSON.stringify(this.userSelectListBackup.filter(f => f.Name.toLowerCase().includes(value.toLowerCase()))));
  }

  onRemoveUser(event: any) {
    this.selectedUserId = 0;
    this.items = [];
  }

}