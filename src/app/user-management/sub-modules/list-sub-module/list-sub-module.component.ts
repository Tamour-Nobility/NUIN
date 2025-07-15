import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubModule } from '../../classes/requestResponse';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { FormControl } from '@angular/forms';
import { APIService } from '../../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../services/data/table-refresh.service';
import { ToastrService } from 'ngx-toastr';
// import swal from 'sweetalert';

@Component({
  selector: 'app-list-sub-module',
  templateUrl: './list-sub-module.component.html',
  styleUrls: ['./list-sub-module.component.css']
})
export class ListSubModuleComponent implements OnInit {
  listSubModule: SubModule[];
  dataTableSubModule: any;
  moduleSelectList: SelectListViewModel[];
  ModuleFilterSelectControl: FormControl = new FormControl();
  moduleSelectListBackup: SelectListViewModel[];
  selectedModule: number;
  selectedRow: number;
  constructor(public apiService: APIService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private refreshGrid: TableRefreshService) {
    this.listSubModule = [];
    this.moduleSelectList = [];
    this.moduleSelectListBackup = [];
  }

  ngOnInit() {
    // this.getSubModuleList();
    this.GetModulesList();
    this.refreshGrid.refresh.subscribe(res => {
      if (res === 'subModule') {
        this.GetModulesList();
      }
    });
  }

  getSubModuleList(moduleId: number = 0): any {
    this.apiService.getData(`/UserManagementSetup/GetSubModuleList?moduleId=${moduleId}`).subscribe(
      data => {
        if (data.Status === 'Success') {
          this.chRef.detectChanges();
          if (this.dataTableSubModule) {
            this.chRef.detectChanges();
            this.dataTableSubModule.destroy();
          }
          this.listSubModule = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableSubModule');
          this.dataTableSubModule = table.DataTable({
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
    this.router.navigate(['edit', this.listSubModule[ndx].Sub_Module_Id], { relativeTo: this.activatedRoute });
  }

  onViewClick(ndx: any) {
    this.selectedRow = ndx;
    this.router.navigate(['detail', this.listSubModule[ndx].Sub_Module_Id], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(ndx: any) {
    this.selectedRow = ndx;
    this.apiService.confirmFun('Confirmation', 'Do you want to delete this Sub Module?', () => {
      this.apiService.getData(`/UserManagementSetup/DeleteSubModule?id=${this.listSubModule[ndx].Sub_Module_Id}`).subscribe(response => {
        if (response.Status === 'Success') {
          this.toaster.info('Sub Module has been Deleted.', 'Delete Success');
          this.getSubModuleList(this.selectedModule);
        }
      });
    });
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
          if (this.moduleSelectListBackup.length > 0) {
            if (this.moduleSelectList == null) {
              this.moduleSelectList = [];
            }
            if (this.moduleSelectList.find(t => t.Id == this.moduleSelectListBackup[0].Id) == null) {
              this.moduleSelectList.push(new SelectListViewModel(this.moduleSelectListBackup[0].Id, this.moduleSelectListBackup[0].Name));
              this.selectedModule = this.moduleSelectListBackup[0].Id;
              this.getSubModuleList(this.moduleSelectListBackup[0].Id);
            }
          }
        }
      }
    )
  }

  onSelectModule(value: any) {
    this.getSubModuleList(value);
  }

  onRemoveModule(value: any) {
    this.chRef.detectChanges();
    if (this.dataTableSubModule) {
      this.chRef.detectChanges();
      this.dataTableSubModule.destroy();
    }
    this.listSubModule = [];
    this.chRef.detectChanges();
    const table: any = $('.dataTableSubModule');
    this.dataTableSubModule = table.DataTable({
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