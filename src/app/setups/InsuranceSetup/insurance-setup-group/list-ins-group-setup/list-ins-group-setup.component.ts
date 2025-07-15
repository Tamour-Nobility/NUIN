import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { APIService } from '../../../../components/services/api.service';
import { groupModel } from '../../classes/ins-group-model'
import { Router, ActivatedRoute } from '@angular/router';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any;

@Component({
    selector: 'app-list-ins-group-setup',
    templateUrl: './list-ins-group-setup.component.html',
    styleUrls: ['./list-ins-group-setup.component.css']
})
export class ListInsGroupSetupComponent implements OnInit {
    dataTable: any;
    GroupModel: groupModel[];
    @ViewChild('addEditGroupModal') addEditGroupModal: ModalDirective;
    modalTitle: string = '';
    selectedGroupId: number | null = null;
    // Subscriptions
    subsGetInsuranceGroupList: Subscription;
    constructor(
        private chRef: ChangeDetectorRef,
        public API: APIService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private refreshGrid: TableRefreshService
    ) {
        this.GroupModel = [];
    }

    ngOnInit() {
        this.refreshGrid.refresh.subscribe(res => {
            if (res == 'insGroup') {
                // this.GetGroupsList();
            }
        })
        this.GetGroupsList();
    }

    GetGroupsList() {
        debugger
        if (!isNullOrUndefined(this.subsGetInsuranceGroupList))
            this.subsGetInsuranceGroupList.unsubscribe();
        this.subsGetInsuranceGroupList = this.API.getData('/InsuranceSetup/GetInsuranceGroupList').subscribe(
            d => {
                if (d.Status == "Sucess") {
                    if (this.dataTable) {
                        this.chRef.detectChanges();
                        this.dataTable.destroy();
                    }
                    this.GroupModel = d.Response;
                    this.chRef.detectChanges();
                    const table: any = $('#tblInsGroup');
                    this.dataTable = table.DataTable({
                        columnDefs: [
                            {
                                className: 'control',
                                orderable: false,
                                targets: 0
                            },
                            {
                                orderable: false,
                                targets: 6
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
                        order: [3, 'asc']
                    });
                }
                else {
                    swal('Failed', d.Status, 'error');
                }
            })
    }

    onDeleteClick(Insgroup_Id: any) {
        if (Insgroup_Id == undefined || Insgroup_Id == null || Insgroup_Id == 0)
            return;
        this.API.confirmFun('Delete Group', 'Are you sure you want to delete this group?', () => {
            this.API.getData('/InsuranceSetup/DeleteInsuranceGroup?InsuranceGroupId=' + Insgroup_Id + '').subscribe(
                d => {
                    if (d.Status == "Sucess") {
                        swal('Delete Group', 'Group has been deleted successfully.', 'success');
                        if (this.dataTable) {
                            this.chRef.detectChanges();
                            this.dataTable.destroy();
                        }
                        this.GroupModel = d.Response;
                        this.chRef.detectChanges();
                        const table: any = $('#tblInsGroup');
                        this.dataTable = table.DataTable({
                            columnDefs: [
                                {
                                    className: 'control',
                                    orderable: false,
                                    targets: 0
                                },
                                {
                                    orderable: false,
                                    targets: 6
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
                            order: [3, 'asc']
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
    openModal(title: string, groupId: number | null = null): void {
        debugger
        this.modalTitle = title;
        this.selectedGroupId = groupId;
        this.addEditGroupModal.show();
    }

    // Close Modal
    closeModal(): void {
        this.addEditGroupModal.hide();
       
    }

    // Handle Save Event
    onSaveGroup(updatedData: any): void {
        console.log('Group saved successfully:', updatedData);
        this.closeModal();
        this.GetGroupsList();
        // Optionally, refresh the grid or perform further actions.
    }
}
