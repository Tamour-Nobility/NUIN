import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import 'datatables.net';
import { SubModuleProperties } from '../../classes/requestResponse';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { FormControl } from '@angular/forms';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-properties',
  templateUrl: './list-properties.component.html',
  styleUrls: ['./list-properties.component.css']
})
export class ListPropertiesComponent implements OnInit {
  listProperties: SubModuleProperties[];
  dataTableSubModuleProperties: any;
  subModuleSelectList: SelectListViewModel[];
  SubModuleFilterSelectControl: FormControl = new FormControl();
  selectedSubModule: number;
  selectedRow: number;
  subModuleSelectListBackup: SelectListViewModel[];

  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listProperties = [];
    this.subModuleSelectList = [];
    this.subModuleSelectListBackup = [];
  }

  ngOnInit() {
    this.GetSubModuleSelectList();
    this.refreshGrid.refresh.subscribe(res => {
      if (res === 'property') {
        this.GetSubModuleSelectList();
      }
    });
  }

  getSubModuleList(subModuleId: number = 0): any {
    this.apiService.getData(`/UserManagementSetup/GetSubModulePropertiesList?subModuleId=${subModuleId}`).subscribe(
      data => {
        if (data.Status === 'Success') {
          this.chRef.detectChanges();
          if (this.dataTableSubModuleProperties) {
            this.chRef.detectChanges();
            this.dataTableSubModuleProperties.destroy();
          }
          this.listProperties = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableSubModuleProperties');
          this.dataTableSubModuleProperties = table.DataTable({
            columnDefs: [
              { orderable: false, targets: -1 }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
        } else {
          this.toaster.error(data.Status, 'Error');
        }
      });
  }


  onEditClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['edit', this.listProperties[ndx].Property_Id], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listProperties[ndx].Property_Id], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(ndx: any) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', 'Do you want to delete this Property?', () => {
      this.apiService.getData(`/UserManagementSetup/DeleteProperty?id=${this.listProperties[ndx].Property_Id}`).subscribe(response => {
        if (response.Status === 'Success') {
          this.toaster.info('Property has been Deleted.', 'Delete Success');
          this.getSubModuleList(this.selectedSubModule);
        }
      });
    });
  }

  // ngx-select Module
  onTypeSubModules(value: string) {
    this.subModuleSelectList = JSON.parse(JSON.stringify(this.subModuleSelectListBackup.filter(f => f.Name.toLowerCase().includes(value.toLowerCase()))));
  }

  GetSubModuleSelectList() {
    this.apiService.getDataWithoutSpinner(`/UserManagementSetup/GetSubModulesSelectList?searchText=`).subscribe(
      res => {
        if (res.Status === 'Success') {
          this.subModuleSelectListBackup = JSON.parse(JSON.stringify(res.Response));
          if (this.subModuleSelectListBackup.length > 0) {
            if (this.subModuleSelectList == null) {
              this.subModuleSelectList = [];
            }
            if (this.subModuleSelectList.find(t => t.Id == this.subModuleSelectListBackup[0].Id) == null) {
              this.subModuleSelectList.push(new SelectListViewModel(this.subModuleSelectListBackup[0].Id, this.subModuleSelectListBackup[0].Name));
              this.selectedSubModule = this.subModuleSelectListBackup[0].Id;
              this.getSubModuleList(this.subModuleSelectListBackup[0].Id);
            }
          }
        }
      });
  }

  onSelectSubModule(value: any) {
    this.getSubModuleList(value);
  }

  onRemoveSubModule(value: any) {
    this.chRef.detectChanges();
    if (this.dataTableSubModuleProperties) {
      this.chRef.detectChanges();
      this.dataTableSubModuleProperties.destroy();
    }
    this.listProperties = [];
    this.chRef.detectChanges();
    const table: any = $('.dataTableSubModuleProperties');
    this.dataTableSubModuleProperties = table.DataTable({
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      language: {
        emptyTable: "No data available"
      }
    });
  }
  // ngx-select Module
}