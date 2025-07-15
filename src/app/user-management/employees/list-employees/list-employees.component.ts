import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeViewModel } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;


@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  listEmployee: EmployeeViewModel[];
  dataTableEmployee: any;
  selectedRow: any;

  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listEmployee = [];
  }

  ngOnInit() {
    this.listEmployee = [];
    this.getEmployeesList();
    this.refreshGrid.refresh.subscribe(
      res => {
        if (res === 'employees') {
          this.getEmployeesList();
        }
      }
    );
  }

  getEmployeesList() {
    this.apiService.getData('/UserManagementSetup/GetEmployeesList').subscribe(
      data => {
        if (data.Status === 'Success') {
          // this.chRef.detectChanges();
          if (this.dataTableEmployee) {
            this.chRef.detectChanges();
            this.dataTableEmployee.destroy();
          }
          this.listEmployee = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableEmployee');
          this.dataTableEmployee = table.DataTable({
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
    this.router.navigate(['edit', this.listEmployee[ndx].Employee_Id], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listEmployee[ndx].Employee_Id], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(ndx: any) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', 'Do you want to delete this employee?', () => {
      this.apiService.getData(`/UserManagementSetup/DeleteEmployee?id=${this.listEmployee[ndx].Employee_Id}`).subscribe(
        response => {
          if (response.Status === 'Success') {
            this.toaster.success('Employee has been Deleted.', 'Deleted');
          }
        }, () => {

        }, () => {
          this.getEmployeesList();
        });
    });
  }
}
