import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { Common } from '../../../../services/common/common';
import { Subscription } from 'rxjs';
import { InsuranceNameViewModel } from '../../classes/insurance-name-model';
import { isNullOrUndefined } from 'util';
declare var $: any;

@Component({
    selector: 'app-list-ins-name-setup',
    templateUrl: './list-ins-name-setup.component.html'
})
export class ListInsNameSetupComponent implements OnInit {
    dataTable: any;
    objInsuranceName: InsuranceNameViewModel[];
    groupsSelectList: SelectListViewModel[];
    insGroupId: number;
    subGroupList: Subscription;
    constructor(
        private chRef: ChangeDetectorRef,
        public API: APIService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private refreshGrid: TableRefreshService
    ) {
        this.objInsuranceName = [];
        this.groupsSelectList = [];
    }

    ngOnInit() {
        this.InitDatatable();
        this.refreshGrid.refresh.subscribe(res => {
            if (res.name === 'insName') {
                this.insGroupId = res.insGroup.Id;
                if (this.groupsSelectList == null) {
                    this.groupsSelectList = [];
                }
                if (this.groupsSelectList.find(i => i.Id == this.insGroupId) == null) {
                    this.groupsSelectList.push(res.insGroup);
                }
                this.onSelectGroup(this.insGroupId);
            }
        })
    }

    GetInsNameList(Insgroup_Id: any) {
        this.API.getData('/InsuranceSetup/GetInsuranceNameList?InsuranceGroupId=' + Insgroup_Id + '').subscribe(
            d => {
                if (d.Status == "Sucess") {
                    if (this.dataTable) {
                        this.chRef.detectChanges();
                        this.dataTable.destroy();
                    }
                    this.objInsuranceName = d.Response;
                    this.chRef.detectChanges();
                    const table: any = $('.dataTableInsName');
                    this.dataTable = table.DataTable({
                        columnDefs: [
                            {
                                className: 'control',
                                orderable: false,
                                targets: 0
                            },
                            {
                                orderable: false,
                                targets: 7
                            }],
                        language: {
                            emptyTable: "No data available"
                        },
                        responsive: {
                            details: {
                                type: 'column',
                                target: 0
                            }
                        },
                        order: [3, 'desc']
                    }
                    );
                }
                else {
                    swal('Failed', d.Status, 'error');
                }
            })
    }

    onDeleteClick(InsuranceNameId: any) {
        if (InsuranceNameId == undefined || InsuranceNameId == null || InsuranceNameId == 0)
            return;
        this.API.confirmFun('Delete Name', 'Are you sure you want to delete this name?', () => {
            this.API.getData('/InsuranceSetup/DeleteInsuranceName?InsuranceNameId=' + InsuranceNameId + '').subscribe(
                d => {
                    if (d.Status == "Sucess") {
                        swal('Delete Name', 'Name has been deleted successfully.', 'success');
                        if (this.dataTable) {
                            this.chRef.detectChanges();
                            this.dataTable.destroy();
                        }
                        this.objInsuranceName = d.Response;
                        this.chRef.detectChanges();
                        const table: any = $('.dataTableInsName');
                        this.dataTable = table.DataTable({
                            columnDefs: [
                                {
                                    className: 'control',
                                    orderable: false,
                                    targets: 0
                                },
                                {
                                    orderable: false,
                                    targets: 7
                                }],
                            language: {
                                emptyTable: "No data available"
                            },
                            responsive: {
                                details: {
                                    type: 'column',
                                    target: 0
                                }
                            },
                            order: [3, 'desc']
                        });
                    }
                    else {
                        swal('Failed', d.Status, 'error');
                    }
                })
        });
    }

    onEditClick(Insgroup_Id: any) {
        this.router.navigate(['edit', Insgroup_Id], { relativeTo: this.activatedRoute });
    }

    onViewClick(Insgroup_Id: any) {
        this.router.navigate(['detail', Insgroup_Id], { relativeTo: this.activatedRoute });
    }

    onTypeGroups(e: any) {
        if (!Common.isNullOrEmpty(e) && e.length >= 3) {
            if (!isNullOrUndefined(this.subGroupList))
                this.subGroupList.unsubscribe();
            this.subGroupList = this.API.getData(`/InsuranceSetup/GetSmartInsuranceGroupsSelectList?searchText=${e}`).subscribe(
                d => {
                    if (d.Status == "Success") {
                        this.groupsSelectList = d.Response;
                    }
                    else {
                        swal('Failed', d.Status, 'error');
                    }
                });

        }
    }

    onSelectGroup(e: any) {
        this.GetInsNameList(e);
    }

    onRemoveGroup(e: any) {
        if (this.dataTable) {
            this.dataTable.destroy();
        }
        this.objInsuranceName = [];
        this.chRef.detectChanges();
        this.InitDatatable();
    }


    private InitDatatable() {
        this.dataTable = $('.dataTableInsName').DataTable({
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets: 0
                },
                {
                    orderable: false,
                    targets: 7
                }],
            language: {
                emptyTable: "No data available"
            },
            responsive: {
                details: {
                    type: 'column',
                    target: 0
                }
            },
            order: [3, 'desc']
        });
    }
}
