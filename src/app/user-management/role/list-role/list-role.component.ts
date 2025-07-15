import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import 'datatables.net';
import { Role } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {
  listRoles: Role[];
  nSelectedRow = 0;
  selectedModuleId: number;
  dataTableRole: any;
  selectedRow: number;
  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listRoles = [];
  }

  ngOnInit() {
    this.getRoleList();
    this.refreshGrid.refresh.subscribe(res => {
      if (res === 'role') {
        this.getRoleList();
      }
    });
  }

  getRoleList() {
    this.apiService.getData('/UserManagementSetup/GetRoleList').subscribe(
      data => {
        if (data.Status === 'Success') {
          this.chRef.detectChanges();
          if (this.dataTableRole) {
            this.chRef.detectChanges();
            this.dataTableRole.destroy();
          }
          this.listRoles = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableRole');
          this.dataTableRole = table.DataTable({
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
    this.router.navigate(['edit', this.listRoles[ndx].RoleId], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listRoles[ndx].RoleId], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(ndx: any) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', 'Do you want to delete this Role?', () => {
      this.apiService.getData(`/UserManagementSetup/DeleteRole?id=${this.listRoles[ndx].RoleId}`).subscribe(response => {
        if (response.Status === 'Success') {
          this.toaster.info('Role has been Deleted.', 'Delete Success');
          this.getRoleList();
        }
      });
    });
  }
}