import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User, UserStatusChangeViewModel } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'datatables.net';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ToastrService } from 'ngx-toastr';
// import swal from 'sweetalert';
declare var $: any;


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  listUser: User[];
  dataTableUser: any;
  selectedRow: number;
  @ViewChild('passwordReset') passwordReset: ResetPasswordComponent;

  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listUser = [];
  }

  ngOnInit() {
    this.listUser = [];
    this.getUsersList();
    this.refreshGrid.refresh.subscribe(
      res => {
        if (res === 'users') {
          this.getUsersList();
        }
      }
    );
  }

  getUsersList() {
    this.apiService.getData('/UserManagementSetup/GetUsersList').subscribe(
      data => {
        if (data.Status === 'Success') {
          this.chRef.detectChanges();
          if (this.dataTableUser) {
            this.chRef.detectChanges();
            this.dataTableUser.destroy();
          }
          this.listUser = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableUser');
          this.dataTableUser = table.DataTable({
            columnDefs: [
              { orderable: false, targets: -1 }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
        } else {
          this.toaster.error(data.Status, 'Failed');
        }
      });
  }

  onEditClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['edit', this.listUser[ndx].UserId], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listUser[ndx].UserId], { relativeTo: this.activatedRoute });
  }

  onActiveDeactive(ndx: any, status: boolean) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', `Are you sure you want to ${status ? 'inactive' : 'active'} this user?`, () => {
      this.apiService.PostData('/UserManagementSetup/ChangeUserStatus', new UserStatusChangeViewModel(this.listUser[ndx].UserId, !status), (response) => {
        if (response.Status === 'Success') {
          this.toaster.success('User status has been changed successfully.', 'Success');
          this.getUsersList();
        } else {

          this.toaster.error(response.Status, 'Failed');
        }
      });
    });
  }

  onResetPasswordClick(ndx: any) {
    this.selectedRow = ndx;
    this.passwordReset.Id = this.listUser[ndx].UserId;
    this.passwordReset.show();

  }
}

