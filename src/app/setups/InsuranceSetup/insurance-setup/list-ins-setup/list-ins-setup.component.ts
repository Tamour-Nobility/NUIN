import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { InsModel } from '../../classes/insurance-setup-model';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { Common } from '../../../../services/common/common';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
    selector: 'app-list-ins-setup',
    templateUrl: './list-ins-setup.component.html'
})
export class ListInsSetupComponent implements OnInit {
    insPayerList: SelectListViewModel[];
    dataTable: any;
    insModel: InsModel;
    subsSearch: Subscription;
    subsList: Subscription;
    insPayerId: number;
    groupsSelectList: SelectListViewModel[];
    searchForm: FormGroup;
    allgroup:any;
    constructor(
        private chRef: ChangeDetectorRef,
        public API: APIService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleCase: TitleCasePipe,
        private upperCase: UpperCasePipe,
        private tableRefreshService: TableRefreshService,
        private fb: FormBuilder
    ) {
        this.insModel = new InsModel();
        this.insPayerList = [];
        this.groupsSelectList=[]
    }

    ngOnInit() {
        this.GetAllGroups(); 
        this.searchForm = this.fb.group({
            groupId: [null],         // Numeric ID (nullable)
            payerName: [''],         // Text input
            insuranceName: [''],     // Text input
          });
          
          // Enable or disable the button based on form values
          this.searchForm.valueChanges.subscribe((values) => {
            const hasValue = Object.values(values).some((value) => {
              if (typeof value === 'string') {
                return value.trim() !== ''; // Check non-empty strings
              }
              if (typeof value === 'number') {
                return value !== null; // Check non-null numbers
              }
              return false; // For other cases
            });
          
            if (hasValue) {
              this.searchForm.get('groupId').clearValidators();
            } else {
              this.searchForm.get('groupId').setValidators(Validators.required);
            }
          });
          
        this.InitDatatable();
        this.tableRefreshService.refresh.subscribe(r => {
            if (r.type == 'insSetup') {
               
                //this.GetInsurances();
            }
        })
    }
    canEnableSearchButton(): boolean {
        const values = this.searchForm.value;
        return Object.values(values).some((value) => {
            debugger
          if (typeof value === 'string') {
            return value.trim() !== ''; // For non-empty strings
          }
          if (typeof value === 'number') {
            return value !== null; // For numbers
          }
          return false;
        });
      }
      
    checkSpcialCharfornum(event: KeyboardEvent) {
        if (!((event.charCode >= 65) && (event.charCode <= 90) || (event.charCode >= 97) && (event.charCode <= 122) || (event.charCode >= 48) && (event.charCode <= 57) || (event.charCode == 32))) {
          event.returnValue = false;
          return;
        }
      }
    GetInsurances() {
        if (!isNullOrUndefined(this.subsList)) {
            this.subsList.unsubscribe();
        }
        if(this.searchForm.valid){
           var  GroupId=this.searchForm.value.groupId;
           var insuranceName= this.searchForm.value.insuranceName;
           var payername=this.searchForm.value.payerName
            this.subsList = this.API.getData('/InsuranceSetup/GetInsuranceList?GroupId=' + GroupId+'&insuranceName='+insuranceName+'&insurancePayerName='+payername).subscribe(
                d => {
                    if (d.Status == "Sucess") {
                        debugger
                        if (this.dataTable) {
                            this.chRef.detectChanges();
                            this.dataTable.destroy();
                        }
                        this.insModel.Response = d.Response;
                        this.chRef.detectChanges();
                        const table: any = $('#tblInsSetup');
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

    }

    onTypeInsurancePayer(value: any) {
        if (!Common.isNullOrEmpty(value) && value.length >= 3) {
            if (!isNullOrUndefined(this.subsSearch)) {
                this.subsSearch.unsubscribe();
            }
            this.subsSearch = this.API.getData(`/InsuranceSetup/GetSmartInsurancePayersList?searchText=${value}`).subscribe(
                res => {
                    if (res.Status == "Success") {
                        this.insPayerList = res.Response;
                    }
                    else {
                        swal('Failed', res.Status, 'error');
                    }
                });
        }
    }

    // onSelectPayer(e: any) {
    //     if (!Common.isNullOrEmpty(e)) {
    //         this.GetInsurances(e);
    //     }
    // }

    onRemovePayer(e: any) {
        if (this.dataTable) {
            this.dataTable.destroy();
        }
        this.insModel.Response = [];
        this.chRef.detectChanges();
        this.InitDatatable();
    }
    onTypeGroups(e: any) {
        if (!Common.isNullOrEmpty(e) && e.length >= 3) {
          this.API.getData(`/InsuranceSetup/GetSmartInsuranceGroupsSelectList?searchText=${e}`).subscribe(
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
   
     GetAllGroups() {
   
          this.API.getData(`/InsuranceSetup/GetInsuranceGroupsSelectList`).subscribe(
            d => {
              if (d.Status == "Success") {
                 this.allgroup = d.Response;
                
                console.log("All Groups", this.allgroup)
              }
              else {
                swal('Failed', d.Status, 'error');
              }
            });
    
        
      }
    
    private InitDatatable() {
        this.dataTable = $('#tblInsSetup').DataTable({
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets: 0
                },
                {
                    orderable: false,
                    targets: 9
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
            order: [1, 'asc']
        });
    }

    onDeleteClick(Insurance_Id: any,insPayerId:any) {
        if (isNullOrUndefined(Insurance_Id))
            return;
        this.API.confirmFun('Delete Insurance', 'Are you sure you want to delete this Insurance?', () => {
            this.API.getData('/InsuranceSetup/DeleteInsurance?InsuranceId=' + Insurance_Id + '&InsurancePayerId=' + insPayerId).subscribe(
                d => {
                    if (d.Status == "Sucess") {
                        this.router.navigate(['/InsuranceSetup/insSetup']);
                        swal('Delete Insurance', 'Insurance has been deleted successfully.', 'success');
                        if (this.dataTable) {
                            this.chRef.detectChanges();
                            this.dataTable.destroy();
                        }
                        this.insModel.Response = d.Response;
                        this.chRef.detectChanges();
                        const table: any = $('#tblInsSetup');
                        this.dataTable = table.DataTable({
                            columnDefs: [
                                {
                                    className: 'control',
                                    orderable: false,
                                    targets: 0
                                },
                                {
                                    orderable: false,
                                    targets: 9
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
                        });
                    }
                    else {
                        swal('Failed', d.Status, 'error');
                    }
                })
        });
    }

    onEditClick(Insgroup_Id: any,InsuranceNameID:any,InsPayerID:any) {
        this.router.navigate(['edit', Insgroup_Id,InsuranceNameID,InsPayerID], { relativeTo: this.activatedRoute });
    }

    onViewClick(Insgroup_Id: any,InsuranceNameID:any,InsPayerID:any) {
        this.router.navigate(['detail', Insgroup_Id,InsuranceNameID,InsPayerID], { relativeTo: this.activatedRoute });
    }

    getFormattedAddress(StreetAddress: string = "", Zip: string = "", City: string = "", State: string = "") {
        let pipedCity = this.titleCase.transform(City);
        let maskedZip = (Common.isNullOrEmpty(Zip) ? '' : (Zip.length == 9 ? Zip.substring(0, 5) + '-' + Zip.substring(5, 9) : Zip));
        let pipedState = this.upperCase.transform(State);
        return `${StreetAddress} ${pipedCity}, ${pipedState} ${maskedZip}`;
    }
}
