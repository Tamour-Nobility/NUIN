import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import 'datatables.net';
import { Module } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-module',
  templateUrl: './list-module.component.html',
  styleUrls: ['./list-module.component.css']
})
export class ListModuleComponent implements OnInit {
  listModule: Module[];
  dataTableModule: any;
  selectedRow: number;
  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listModule = [];
  }

  ngOnInit() {
    this.getModulesList();
    this.refreshGrid.refresh.subscribe(res => {
      if (res === 'module') {
        this.getModulesList();
      }
    });
  }

  getModulesList() {
    this.apiService.getData('/UserManagementSetup/GetModulesList').subscribe(
      data => {
        if (data.Status === 'Success') {
          this.chRef.detectChanges();
          if (this.dataTableModule) {
            this.chRef.detectChanges();
            this.dataTableModule.destroy();
          }
          this.listModule = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableModule');
          this.dataTableModule = table.DataTable({
            columnDefs: [
              { orderable: false, targets: -1 },
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
    this.router.navigate(['edit', this.listModule[ndx].Module_Id], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listModule[ndx].Module_Id], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(ndx: any) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', 'Do you want to delete this Module?', () => {
      this.apiService.getData(`/UserManagementSetup/DeleteModule?id=${this.listModule[ndx].Module_Id}`).subscribe(
        response => {
          if (response.Status === 'Success') {
            this.toaster.info('Module has been deleted.', 'Delete Success');
          }
        }, () => {

        }, () => {
          this.getModulesList();
        });
    });
  }
}