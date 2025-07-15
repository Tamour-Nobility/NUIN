import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Common } from '../../services/common/common';
import { PatientSearchRequest } from '../Classes/patientSearchModel';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../core/base/base.component';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { PatientRefreshService } from '../../services/data/patient-refresh.service';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'app-patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: ['./patient-search.component.css']
})
export class PatientSearchComponent extends BaseComponent implements OnInit {
    SearchForm: FormGroup;
    searchModel: PatientSearchRequest;
    dataTablePatients: any;
    patients: any = [];
  
    dateRangeTypes = [
        { id: 'claim_date', label: 'Entry Date' },
        { id: 'dos', label: 'DOS' }
    ];
    // constants
    today = new Date();
    isSearchInitiated: boolean = false;
    myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy',
        height: '25px',
        width: '100%',
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1,
        },
    };
    myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
    };
    @Output() onSelectpatient: EventEmitter<any> = new EventEmitter();
    constructor(private chRef: ChangeDetectorRef, private patientRefresh:PatientRefreshService,
        private API: APIService,
        private Gv: GvarsService,
        private router: Router,
        private toastService: ToastrService) {
        super();
        this.searchModel = new PatientSearchRequest();
      
    }

    ngOnInit() {
        this.IsButtonDisable();
        this.initForm();
        this.patientRefresh.refresh.subscribe((r) => {
         this.resetFields()
          })
        // this.setDefaultFilter();
        // this.searchPatient();
        // this.SearchForm.reset();
        //this.resetFields();
    }

    setDefaultFilter() {
        this.searchModel.dateType = 'claim_date';
        let date = new Date();
        let beginDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let endDate = date;
        this.setDateRange(beginDate, endDate);
        this.searchModel.dateFrom = moment(beginDate).format('MM/DD/YYYY');
        this.searchModel.dateTo = moment(endDate).format('MM/DD/YYYY');
    }

    setDateRange(begin, end): void {
        this.SearchForm.patchValue({
            DOSRange: {
                beginDate: {
                    year: begin.getFullYear(),
                    month: begin.getMonth() + 1,
                    day: begin.getDate()
                },
                endDate: {
                    year: end.getFullYear(),
                    month: end.getMonth() + 1,
                    day: end.getDate()
                }
            }
        });
    }

    initForm() {
        this.SearchForm = new FormGroup({
            ptl: new FormControl(''),
            patientAccount: new FormControl('', [Validators.maxLength(18)]),
            lastName: new FormControl('', [Validators.maxLength(50)]),
            firstName: new FormControl('', [Validators.maxLength(50)]),
            ssn: new FormControl('', [Validators.maxLength(9), Validators.minLength(9)]),
            claimNo: new FormControl('', [Validators.maxLength(19)]),
            policyNo: new FormControl('', [Validators.maxLength(19)]),
            homePhone: new FormControl('', [Validators.maxLength(10), Validators.minLength(10)]),
            zip: new FormControl('', [Validators.maxLength(9), Validators.minLength(5)]),
            dob: new FormControl(''),
            dateRangeType: new FormControl(null),
            DOSRange: new FormControl('')
        });
        this.formControls['dateRangeType'].valueChanges.subscribe((value) => {
            if (value !== null) {
                this.formControls['dateRangeType'].setValidators(Validators.required);
                this.formControls['dateRangeType'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
            } else {
                this.formControls['dateRangeType'].clearValidators();
                this.formControls['dateRangeType'].updateValueAndValidity({ emitEvent: false, onlySelf: true });
            }
        });
    }

    get formControls() {
        return this.SearchForm.controls;
    }

    dateMask(event: any) {
        Common.DateMask(event);
    }

    onDateChangedDOB(event) {
        this.searchModel.dob = event.formatted;
    }

    searchPatient() {
        if ((!Common.isNullOrEmpty(this.searchModel.PatientAccount) ||
            !Common.isNullOrEmpty(this.searchModel.LastName) ||
            !Common.isNullOrEmpty(this.searchModel.FirstName) ||
            !Common.isNullOrEmpty(this.searchModel.SSN) ||
            !Common.isNullOrEmpty(this.searchModel.ClaimNo) ||
            !Common.isNullOrEmpty(this.searchModel.PolicyNo) ||
            !Common.isNullOrEmpty(this.searchModel.HomePhone) ||
            !Common.isNullOrEmpty(this.searchModel.ZIP) ||
            (!Common.isNullOrEmpty(this.searchModel.dateType) && !Common.isNullOrEmpty(this.searchModel.dateFrom) && !Common.isNullOrEmpty(this.searchModel.dateTo)) ||
            !Common.isNullOrEmpty(this.searchModel.dob)) && this.formControls['zip'].valid && this.formControls['ssn'].valid && this.formControls['homePhone'].valid) {
            this.searchModel.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;
            this.isSearchInitiated = true;
            this.API.PostData('/Demographic/SearchPatient', this.searchModel, (d) => {
                if (d.Status == "Sucess") {
                    if (this.dataTablePatients) {
                        this.chRef.detectChanges();
                        this.dataTablePatients.destroy();
                    }
                    this.patients = d.Response;
                    this.chRef.detectChanges();
                    const table: any = $('.dataTablePatients');
                    this.dataTablePatients = table.DataTable({
                        columnDefs: [
                            { orderable: false, targets: -1 }
                        ],
                        language: {
                            emptyTable: "No data available"
                        }
                    })
                }
                else if(d.Status="Invalid"){
                    swal('Failed', d.Status, 'error');
                }
                else {
                    swal('Failed', d.Status, 'error');
                }
            })
        } else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
    }

    resetFields() {
        this.chRef.detectChanges();
        this.dataTablePatients.destroy();
        this.searchModel = new PatientSearchRequest();
        this.patients = [];
        this.isSearchInitiated = false;
    }

    onAction(action: any) {
        switch (action.type) {
            case 'Delete': {
                this.API.confirmFun('Confirm Delete', 'Do you want to delete this Patient?', () => {
                    this.API.getData('/Demographic/DeletePatient?PatientAccount=' + action.payload.patientAccount).subscribe(
                        data => {
                            if (data.Status == "Sucess") {
                                swal('Patient', 'Patient has been Deleted.', 'success');
                                this.searchPatient();
                            }
                        });
                });
                break;
            }
            case 'New': {
                this.router.navigate(['/Patient/Demographics/New', Common.encodeBase64(JSON.stringify({
                    Patient_Account: 0
                }))])
                break;
            }
            case 'Edit': {
                this.router.navigate(['/Patient/Demographics/Edit/',
                    Common.encodeBase64(JSON.stringify({
                        Patient_Account: action.payload.patientAccount,
                        PatientFirstName: action.payload.firstName,
                        PatientLastName: action.payload.lastName,
                        claimNo: 0,
                        disableForm: false
                    }))
                ]);
                break;
            }
            case 'View': {
                this.router.navigate(['/Patient/Demographics/Detail/',
                    Common.encodeBase64(JSON.stringify({
                        Patient_Account: action.payload.patientAccount,
                        PatientFirstName: action.payload.firstName,
                        PatientLastName: action.payload.lastName,
                        claimNo: 0,
                        disableForm: true
                    }))
                ])
                break;
            }
        }
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.searchModel.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
        this.searchModel.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    }

    onChangeDateRangeType() {
        if (this.searchModel.dateType === null) {
            this.searchModel.dateFrom = null;
            this.searchModel.dateTo = null;
            this.clearDateRange();
            this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: true };
        } else {
            this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: false };
        }
    }

    clearDateRange(): void {
        this.SearchForm.patchValue({ DOSRange: '' });
    }

    onDbcPatient(Patient_Account, Last_Name, First_Name) {
        this.onSelectpatient.emit({ Patient_Account, Last_Name, First_Name });
    }
    DisableBtn:boolean=false
    IsButtonDisable(){
    debugger
     this.DisableBtn= this.Gv.IsbuttonDisable();
     
     
    }
}