import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { InsPayerSearchModel, InsurancePayerViewModel } from '../../classes/ins-payer-model';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { Common } from '../../../../services/common/common';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
declare var $: any;

@Component({
    selector: 'app-list-ins-setup-payer',
    templateUrl: './list-ins-setup-payer.component.html'
})
export class ListInsSetupPayerComponent implements OnInit {
    dataTable: any;
    nameSelectList: SelectListViewModel[];
    groupsSelectList: SelectListViewModel[];
    insPayerSearchModel: InsPayerSearchModel;
    insPayerLIst: InsurancePayerViewModel[];
    // Subscription
    subsGetGroups: Subscription;
    subsGetNames: Subscription;
    isSeacrhId: boolean;
    constructor(
        private chRef: ChangeDetectorRef,
        public API: APIService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private tableRefreshService: TableRefreshService
    ) {
        this.nameSelectList = [];
        this.groupsSelectList = [];
        this.insPayerSearchModel = new InsPayerSearchModel();
        this.insPayerLIst = [];
    }

    ngOnInit() {
        this.tableRefreshService.refresh.subscribe(r => {
            if (r.name === 'insPayer') {
                this.insPayerSearchModel.InsuranceGroupId = r.InsuranceGroup.Id;
                this.insPayerSearchModel.InsuranceNameId = r.InsuranceName.Id;
                if (this.groupsSelectList == null)
                    this.groupsSelectList = [];
                if (this.groupsSelectList.find(f => f.Id == r.InsuranceGroup.Id) == null)
                    this.groupsSelectList.push(r.InsuranceGroup);
                if (this.nameSelectList == null)
                    this.nameSelectList = [];
                if (this.nameSelectList.find(f => f.Id == r.InsuranceName.Id) == null)
                    this.nameSelectList.push(r.InsuranceName);
                this.GetInsPayerList(this.insPayerSearchModel.InsuranceGroupId, this.insPayerSearchModel.InsuranceNameId);
            }
        });
        this.InitDatatable();
    }

    GetInsPayerList(Insgroup_Id: any, InsName_Id: any) {
        this.insPayerSearchModel.InsurancePayer_Id = null;
        this.insPayerSearchModel.InsurancePayer_State = '';
        this.API.getData('/InsuranceSetup/GetInsurancePayerList?InsuranceGroupId=' + Insgroup_Id + '&InsuranceNameId=' + InsName_Id).subscribe(
            d => {
                if (d.Status == "Sucess") {
                    if (this.dataTable) {
                        this.chRef.detectChanges();
                        this.dataTable.destroy();
                    }
                    this.updateTable(d.Response);
                }
                else {
                    swal('Failed', d.Status, 'error');
                }
            })
    }

    updateTable(data: any) {
        this.insPayerLIst = data;
        this.chRef.detectChanges();
        const table: any = $('.tblInsPayer');
        this.dataTable = table.DataTable({
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets: 0
                },
                {
                    orderable: false,
                    targets: 8
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
            order: [4, 'asc']
        })
    }

    onDeleteClick(InsurancePayerId: any, InsuranceNameId: any) {
        if (InsuranceNameId == undefined || InsuranceNameId == null || InsuranceNameId == 0)
            return;
        this.API.confirmFun('Delete Payer', 'Are you sure you want to delete this item?', () => {
            this.API.getData('/InsuranceSetup/DeleteInsurancePayer?InsurancePayerId=' + InsurancePayerId + '&InsuranceNameId=' + InsuranceNameId).subscribe(
                d => {
                    if (d.Status == "Sucess") {
                        swal('Delete Payer', 'Payer has been deleted successfully.', 'success');
                        this.onChangeInsName();
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
            if (!isNullOrUndefined(this.subsGetGroups))
                this.subsGetGroups.unsubscribe();
            this.subsGetGroups = this.API.getData(`/InsuranceSetup/GetSmartInsuranceGroupsSelectList?searchText=${e}`).subscribe(
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
        this.nameSelectList = [];
        this.insPayerSearchModel.InsuranceNameId = null;
        this.onRemoveName(null);
    }

    onRemoveGroup(e: any) {
        this.nameSelectList = [];
        this.insPayerSearchModel.InsuranceNameId = null;
        this.onRemoveName(null);
    }

    onTypeName(e: any) {
        if (!Common.isNullOrEmpty(e) && e.length >= 3 && !Common.isNullOrEmpty(this.insPayerSearchModel.InsuranceGroupId)) {
            if (!isNullOrUndefined(this.subsGetNames))
                this.subsGetNames.unsubscribe();
            this.subsGetNames = this.API.getData(`/InsuranceSetup/GetSmartInsuranceNameList?insuranceGroupId=${this.insPayerSearchModel.InsuranceGroupId}&searchText=${e}`).subscribe(
                d => {
                    if (d.Status == "Success") {
                        this.nameSelectList = d.Response;
                    }
                    else {
                        swal('Failed', d.Status, 'error');
                    }
                });

        }
    }

    onSelectName(e: any) {
        this.GetInsPayerList(this.insPayerSearchModel.InsuranceGroupId, this.insPayerSearchModel.InsuranceNameId);
    }

    onRemoveName(e: any) {
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
        this.insPayerLIst = [];
        this.chRef.detectChanges();
        this.InitDatatable();
    }

    onChangeInsName() {
        if (!Common.isNullOrEmpty(this.insPayerSearchModel.InsuranceGroupId) && !Common.isNullOrEmpty(this.insPayerSearchModel.InsuranceNameId)) {
            this.GetInsPayerList(this.insPayerSearchModel.InsuranceGroupId, this.insPayerSearchModel.InsuranceNameId);
        }
    }

    GetInsPayerById(event: KeyboardEvent, value: any) {
        if (value) {
            if (event.key == "Enter" || event.key == "Tab") {
                this.insPayerSearchModel.InsuranceGroupId = null;
                this.insPayerSearchModel.InsuranceNameId = null;
                this.insPayerSearchModel.InsurancePayer_State = '';
                this.API.getData('/InsuranceSetup/GetInsPayerById?InsurancePayerId=' + value).subscribe(
                    d => {
                        if (d.Status == "Sucess") {
                            if (this.dataTable) {
                                this.chRef.detectChanges();
                                this.dataTable.destroy();
                                this.insPayerLIst = [];
                            }
                            //we will not use the updatable() method here because this api call doesn't return an array rather an object
                            this.insPayerLIst.push(d.Response);
                            this.chRef.detectChanges();
                            const table: any = $('.tblInsPayer');
                            this.dataTable = table.DataTable({
                                columnDefs: [
                                    {
                                        className: 'control',
                                        orderable: false,
                                        targets: 0
                                    },
                                    {
                                        orderable: false,
                                        targets: 8
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
                                order: [4, 'asc']
                            })
                        }
                        else {
                            swal('Failed', d.Status, 'error');
                        }
                    })
            }
        }
    }

    GetInsPayerByState(event: KeyboardEvent, value: any) {
        if (value) {
            if (event.key == "Enter" || event.key == "Tab") {
                this.insPayerSearchModel.InsuranceGroupId = null;
                this.insPayerSearchModel.InsuranceNameId = null;
                this.insPayerSearchModel.InsurancePayer_Id = null;
                this.API.getData('/InsuranceSetup/GetInsPayerByState?InsurancePayerState=' + value).subscribe(
                    d => {
                        if (d.Status == "Sucess") {
                            if (this.dataTable) {
                                this.chRef.detectChanges();
                                this.dataTable.destroy();
                            }
                            this.updateTable(d.Response);
                        }
                        else {
                            swal('Failed', d.Status, 'error');
                        }
                    })
            }
        }
    }


    private InitDatatable() {
        this.dataTable = $('.tblInsPayer').DataTable({
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets: 0
                },
                {
                    orderable: false,
                    targets: 8
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
            order: [4, 'asc']
        });
    }

    onFocusIdSearch(e: any) {
        this.isSeacrhId = true;
        this.insPayerSearchModel.InsuranceGroupId = null;
        this.insPayerSearchModel.InsuranceNameId = null;
        this.insPayerSearchModel.InsurancePayer_State = '';
    }

    onBlurIdSearch(e: any) {
        this.isSeacrhId = false;
        this.insPayerSearchModel.InsurancePayer_Id = null;
    }
}
