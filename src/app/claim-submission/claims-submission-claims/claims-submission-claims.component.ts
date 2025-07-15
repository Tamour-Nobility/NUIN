import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimSearchViewModel, ClaimSearchResponseViewModel, BatchCreateViewModel, BatchListRequestViewModel, AddInBatchRequestViewModel, LockBatchRequestViewModel, BatchListViewModel, HoldBatchRequestViewModel } from '../models/claims-submission.model';
import { Subscription } from 'rxjs';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { BatchUploadRequest } from '../../models/common/dateRange.model';
import { PatientSummaryVM } from '../../patient/Classes/patientSummary.model';
import { DatatableService } from '../../../app/services/data/datatable.service';

import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';
import { ClaimSummaryVM } from '../../Claims/Classes/ClaimSummary.model';
import { isNullOrUndefined } from 'util';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { ClaimDetail } from '../../edisetup/classes/edi-general-class';
import * as JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
declare var $: any;

@Component({
  selector: 'app-claims-submission-claims',
  templateUrl: './claims-submission-claims.component.html',
  styleUrls: ['./claims-submission-claims.component.css']
})
export class ClaimsSubmissionClaimsComponent implements OnInit {
  // tables
  dataTableClaimsSummary: any;
  // tables
  // form controls
  searchForm: FormGroup;
  batchForm: FormGroup;
  objClaimDetail: ClaimDetail;
  batchName: string
  batchProviderControl = new FormControl('');
  batchAddEditProviderControl = new FormControl('', [Validators.required]);
  batchAddEditSubmissionControl = new FormControl('Electronic', [Validators.required]);
  batchAddEditSubmissionTypeControl = new FormControl('P', [Validators.required]);
  batchIds: string
  batchSelectControl = new FormControl('', [Validators.required]);
  AddInBatchProviderFormControl = new FormControl();
  // Select lists
  patientSelectList: SelectListViewModel[];
  insuranceSelectList: SelectListViewModel[];
  providerSelectList: SelectListViewModel[];
  addInBatchProviderSelectList: SelectListViewModel[];
  AddUpdateBatchProviderSelectList: SelectListViewModel[];
  locationSelectList: SelectListViewModel[];
  batchesSelectList: SelectListViewModel[];
  // Subscriptions
  subsPatientSelectList: Subscription;
  subInsuranceSelectList: Subscription;
  subProviderSelectList: Subscription;
  subAddUpdateBatchProviderSelectList: Subscription;
  subLocationSelectList: Subscription;
  subBatchSelectList: Subscription;
  batchCreateViewModel: BatchCreateViewModel;
  batchDetailsRequest: BatchListRequestViewModel;
  batchDetailsResponseList: BatchListViewModel[];
  claimsSearch: ClaimSearchViewModel;
  claimSearchResponse: ClaimSearchResponseViewModel[];
  addInBatchViewModel: AddInBatchRequestViewModel;
  AddInBatchProvider: number;
  // claimUploadDateRange: DateRangeViewModel;
  batchUploadRequest: BatchUploadRequest;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
  }
  public myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
  }
  patientSummary: PatientSummaryVM;
  claimSummary: ClaimSummaryVM;
  dataTableBatches: any;
  //ng multiselect
  locationsSettings = {};
  providerSettings = {};
  insuranceSettings = {};
  patientSettings = {};
  selectedLocations: SelectListViewModel[];
  selectedProviders: SelectListViewModel[];
  selectedInsurances: SelectListViewModel[];
  selectedPatients: SelectListViewModel[];
  //subscriptions
  subsLocationSelectList: Subscription;
  patientSearchSubscription: Subscription;
  insuranceSearchSubscription: Subscription;
  loggedInUser: CurrentUserViewModel;
  claimsForm: FormGroup;
  claimsForm1: FormGroup;
  typeSelected: string
  selType: string
  BillingType: string
  PracticeBillingType: any = '';
  dataTable: any;
  submissionTypes = [
    { id: 'Electronic', name: 'Electronic' },
    { id: 'Paper', name: 'Paper' }
  ];
  batchClaimType = [
    { id: 'P', name: 'Primary' },
    { id: 'S', name: 'Secondary' }
  ];
  LastestBatchDetailsResponseList: any = []
  isPrintable: boolean = false;
  selectedBatchIds: number[] = [];
  choice = '';
  constructor(public datepipe: DatePipe,
    private toastService: ToastrService,
    public apiService: APIService,
    public GV: GvarsService,
    public router: Router,
    private chRef: ChangeDetectorRef, private gvService: GvarsService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private toast: ToastrService, public API: APIService, private datatableService: DatatableService) {
    this.claimsSearch = new ClaimSearchViewModel();
    this.claimSearchResponse = [];
    this.patientSelectList = [];
    this.insuranceSelectList = [];
    this.providerSelectList = [];
    this.objClaimDetail = new ClaimDetail();
    this.addInBatchProviderSelectList = [];
    this.AddUpdateBatchProviderSelectList = [];
    this.locationSelectList = [];
    this.batchesSelectList = [];
    this.batchCreateViewModel = new BatchCreateViewModel();
    this.batchDetailsRequest = new BatchListRequestViewModel();
    this.batchDetailsResponseList = [];
    this.addInBatchViewModel = new AddInBatchRequestViewModel();
    this.patientSummary = new PatientSummaryVM();
    this.claimSummary = new ClaimSummaryVM();
    // this.claimUploadDateRange = new DateRangeViewModel();
    this.batchUploadRequest = new BatchUploadRequest();
    this.claimsForm = this.fb.group({
      type: ['']
    });
    this.claimsForm1 = this.fb.group({
      billedTo: ['P']  // 'P' for Primary as default
    });
  }

  ngOnInit() {
    debugger
    this.InitForm();
    // this.GetBatchesDetail();
    this.selectedLocations = [];
    this.selectedProviders = [];
    this.selectedInsurances = [];
    this.selectedPatients = [];
    this.locationsSettings = {
      text: "Select Locations",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Id",
      labelKey: "Name",
      noDataLabel: "Search Locations...",
      enableSearchFilter: true,
      badgeShowLimit: 3
    };
    this.providerSettings = {
      text: "Select Providers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Id",
      labelKey: "Name",
      noDataLabel: "Search Providers...",
      enableSearchFilter: true,
      badgeShowLimit: 3
    };
    this.patientSettings = {
      text: "Select Patients",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Id",
      labelKey: "Name",
      noDataLabel: "Search Patients...",
      enableSearchFilter: true,
      badgeShowLimit: 3
    };
    this.insuranceSettings = {
      text: "Select Insurances",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Id",
      labelKey: "Name",
      noDataLabel: "Search Insurances...",
      enableSearchFilter: true,
      badgeShowLimit: 3
    };
    this.getProvidersAndLocations();
    debugger
    this.loggedInUser = this.gvService.currentUser;

    //     if(!Common.isNullOrEmpty(this.loggedInUser.selectedPractice.Billing_Type))
    //       {
    //         if (this.loggedInUser.selectedPractice.Billing_Type.toLocaleLowerCase() == "professional" || this.loggedInUser.selectedPractice.Billing_Type == "P&I" || this.loggedInUser.selectedPractice.Billing_Type == null) 
    //         {
    //           this.claimsForm.get('type').setValue('professional');
    //         } 
    //         else
    //         {
    //           this.claimsForm.get('type').setValue('institutional');
    //         }
    //       }
    // debugger
    // if(this.loggedInUser.selectedPractice.Billing_Type)
    //   {
    //     if(this.loggedInUser.selectedPractice.Billing_Type.toLowerCase() == "institutional")
    //       {
    //         this.selType = "I"
    //         this.typeSelected = this.selType
    //       }
    //       else if(this.loggedInUser.selectedPractice.Billing_Type.toLowerCase() == "professional")
    //       {
    //         this.selType = "P"
    //         this.typeSelected = this.selType
    //       }
    //       else
    //       this.selType = "P"
    //         this.typeSelected = this.selType
    //   }

    this.PracticeBillingType = this.loggedInUser.selectedPractice.Billing_Type.toLowerCase()
    switch (this.PracticeBillingType) {
      case "p":
        this.claimsForm.get('type').setValue('professional');
        this.BillingType = "P"
        this.selType = "P"
        this.typeSelected = this.selType
        break;
      case "i":
        this.claimsForm.get('type').setValue('institutional');
        this.BillingType = "I"
        this.selType = "I"
        this.typeSelected = this.selType
        break;
      case "p&i":
        this.claimsForm.get('type').setValue('professional');
        this.BillingType = "all"
        this.selType = "P"
        this.typeSelected = this.selType
        break;
      case "null":
        this.claimsForm.get('type').setValue('professional');
        this.BillingType = "P"
        this.selType = "P"
        this.typeSelected = this.selType
        break;
      case "institutional":
        this.claimsForm.get('type').setValue('institutional');
        this.BillingType = "I"
        this.selType = "I"
        this.typeSelected = this.selType
        break;
      case "professional":
        this.claimsForm.get('type').setValue('professional');
        this.BillingType = "P"
        this.selType = "P"
        this.typeSelected = this.selType
        break;
      default:
        this.claimsForm.get('type').setValue('professional');
        this.BillingType = "P"
        this.selType = "P"
        this.typeSelected = this.selType
    }
    this.GetBatchesDetail();
    this.initializeTabs();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    $('#Confirmation').modal('hide');
    $('.modal-backdrop').remove();
  }
  initializeTabs() {
    // Get the tab elements
    const tabReadable = document.getElementById('tab-readable') as HTMLElement;
    const tabStandard = document.getElementById('tab-standard') as HTMLElement;
    const tab1 = document.getElementById('Readable-tab-1') as HTMLElement;
    const tab2 = document.getElementById('Standard-tab-2') as HTMLElement;

    // Set the default tab when the modal is opened
    const setDefaultTab = () => {
      // Reset all tabs to unactive
      tabReadable.classList.remove('active');
      tabStandard.classList.remove('active');
      tab1.classList.remove('active');
      tab2.classList.remove('active');

      // Set the default tab (Readable tab in this case)
      tabReadable.classList.add('active');
      tab1.classList.add('active');
    };

    // Run the setDefaultTab when modal is opened
    setDefaultTab();  // Ensure the default tab is set when initializing

    // Switch to Readable tab when clicked
    tabReadable.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      tabReadable.classList.add('active');
      tabStandard.classList.remove('active');
      tab1.classList.add('active');
      tab2.classList.remove('active');
    });

    // Switch to Standard tab when clicked
    tabStandard.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      tabStandard.classList.add('active');
      tabReadable.classList.remove('active');
      tab2.classList.add('active');
      tab1.classList.remove('active');
    });
  }




  onBillingTypeChange(selectedValue: string) {
    debugger
    if (selectedValue == "institutional") {
      this.typeSelected = "I"
    }
    else if (selectedValue == "professional") {
      this.typeSelected = "P"
    }
    else
      this.typeSelected = selectedValue
  }

  getProvidersAndLocations() {
    if (!Common.isNullOrEmpty(this.subsLocationSelectList))
      this.subsLocationSelectList.unsubscribe();
    this.subsLocationSelectList = this.apiService.getDataWithoutSpinner(`/Scheduler/GetProvidersAndLocations?practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe(
      res => {
        if (res.Status == "Success") {
          this.locationSelectList = res.Response.Locations;
          this.providerSelectList = res.Response.Providers;
          if (this.addInBatchProviderSelectList == null) {
            this.addInBatchProviderSelectList = [];
          }
          if (this.addInBatchProviderSelectList.find(p => p.Name == 'All') == null) {
            this.addInBatchProviderSelectList = [new SelectListViewModel(-1, 'All')]
          }
          this.addInBatchProviderSelectList = [...this.addInBatchProviderSelectList, ...JSON.parse(JSON.stringify(res.Response.Providers))]
        }
      });
  }

  InitForm(): any {
    this.searchForm = new FormGroup({
      dosFrom: new FormControl(''),
      dosTo: new FormControl(''),
      icd9: new FormControl(''),
      type: new FormControl(''),
      billedTo: new FormControl(''),
      status: new FormControl(''),
      location: new FormControl([]),
      provider: new FormControl([]),
      patientAccount: new FormControl([]),
      insurance: new FormControl([])
    });
    this.batchForm = new FormGroup({
      type: new FormControl(),
      date: new FormControl('', [Validators.required])
    });
  }

  newBatchClick() {
    this.defaultBatchTypeSelection();
    this.onTypeAddUpdateBatchProvider();
  }

  onSearch() {
    debugger
    this.selType = this.typeSelected
    this.GetBatchesDetail();
    if (this.canSearch()) {
      this.setMultiSelectIdsInRequest();
      this.claimsSearch.status = "unprocessed";
      this.claimsSearch.PracticeCode = this.GV.currentUser.selectedPractice.PracticeCode;
      this.claimsSearch.type = this.selType;
      this.claimsSearch.billedTo = this.claimsForm1.value.billedTo;
      console.log("this.claimsForm1 ",this.claimsForm1.value.billedTo )
      console.log("this.claimsSearch",this.claimsSearch)
      this.apiService.PostData(`/Submission/SearchClaim`, this.claimsSearch, (response) => {
        if (response.Status == "Success") {
          if (this.dataTableClaimsSummary) {
            this.dataTableClaimsSummary.destroy();
          }
          this.claimSearchResponse = response.Response;
          console.log(this.claimSearchResponse)
          this.chRef.detectChanges();
          const table: any = $('.dataTableClaimsSummary');
          this.dataTableClaimsSummary = table.DataTable({
            columnDefs: [{
              'targets': 0,
              'checkboxes': {
                'selectRow': true
              }
            }, {
              className: 'control',
              orderable: false,
              targets: 1
            }, {
              visible: false,
              targets: 3
            },
            {
              visible: false,
              targets: 2
            }
            ],
            responsive: {
              details: {
                type: 'column',
                target: 1
              }
            },
            select: {
              style: 'multi',
            },
            order: [2, 'asc'],
            language: {
              buttons: {
                emptyTable: "No data available"
              },
              select: {
                rows: ""
              }
            }
          });
        }
        else {
          swal('Claim Search', 'No claim found.', 'info');
        }
      });
    } else {
      swal('Claim Search', 'Please provide any search criteria', 'warning');
    }
  }

  setMultiSelectIdsInRequest() {
    if (isNullOrUndefined(this.selectedInsurances))
      this.selectedInsurances = []
    this.claimsSearch.insurance = this.selectedInsurances.map(ins => ins.Id);
    if (isNullOrUndefined(this.selectedLocations))
      this.selectedLocations = []
    this.claimsSearch.location = this.selectedLocations.map(loc => loc.Id);
    if (isNullOrUndefined(this.selectedPatients))
      this.selectedPatients = []
    this.claimsSearch.PatientAccount = this.selectedPatients.map(pat => pat.Id);
    if (isNullOrUndefined(this.selectedProviders))
      this.selectedProviders = []
    this.claimsSearch.Provider = this.selectedProviders.map(pro => pro.Id);
  }


  onSearchPatients(value: any) {
    let searchText = value.trim() || "";
    if (!Common.isNullOrEmpty(searchText) && (searchText.length == 3 || searchText.length == 5 || searchText.length >= 7)) {
      if (!isNullOrUndefined(this.patientSearchSubscription))
        this.patientSearchSubscription.unsubscribe();
      this.patientSearchSubscription = this.apiService.getData(`/Demographic/GetPatientSelectList?searchText=${value}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe(r => {
        if (r.Status == "Success") {
          this.patientSelectList = r.Response;
        }
      })
    }
  }

  onSearchInsurances(value: any) {
    let searchText = value.trim() || "";
    if (!Common.isNullOrEmpty(searchText) && (searchText.length == 3 || searchText.length == 5 || searchText.length >= 7)) {
      if (!isNullOrUndefined(this.insuranceSearchSubscription))
        this.insuranceSearchSubscription.unsubscribe();
      this.insuranceSearchSubscription = this.apiService.getData(`/Demographic/GetInsuranceSelectList?searchText=${value}`).subscribe(r => {
        if (r.Status == "Success") {
          this.insuranceSelectList = r.Response;
        }
      })
    }
  }


  clearForm() {
    this.searchForm.reset();
    this.claimsSearch = new ClaimSearchViewModel();
    this.claimSearchResponse = [];
    this.selectedLocations = [];
    this.selectedPatients = [];
    this.selectedProviders = [];
    this.selectedInsurances = [];
    this.chRef.detectChanges();
  }

  canSearch(): boolean {
    if ((!Common.isNullOrEmpty(this.claimsSearch.DOSFrom)) && (!Common.isNullOrEmpty(this.claimsSearch.DOSTo)) ||
      (!Common.isNullOrEmpty(this.selectedPatients) && this.selectedPatients.length > 0) ||
      (!Common.isNullOrEmpty(this.selectedProviders) && this.selectedProviders.length > 0) ||
      !Common.isNullOrEmpty(this.claimsSearch.icd9) ||
      (!Common.isNullOrEmpty(this.selectedInsurances) && this.selectedInsurances.length > 0) ||
      (!Common.isNullOrEmpty(this.selectedLocations) && this.selectedLocations.length > 0) ||
      !Common.isNullOrEmpty(this.selType)
    ) {
      return true;
    } else {
      return false;
    }
  }


  //#region Batch
  onAddInBatchSelect() {
    this.addInBatchViewModel.ClaimIds = [];
    this.addInBatchViewModel.ClaimInsuranceIds = [];
    this.AddInBatchProviderFormControl.reset();
    this.batchesSelectList = [];
    this.batchSelectControl.reset();
    let selectedRows = this.dataTableClaimsSummary.rows({ selected: true });
    let selectedClaimsIds = this.dataTableClaimsSummary.cells(selectedRows.nodes(), 2).data();
    let selectedInsuranceIds = this.dataTableClaimsSummary.cells(selectedRows.nodes(), 3).data();
    for (let i = 0; i < selectedClaimsIds.length; i++) {
      this.addInBatchViewModel.ClaimIds.push(selectedClaimsIds[i]);
      this.addInBatchViewModel.ClaimInsuranceIds.push(selectedInsuranceIds[i]);
    }
    if (this.addInBatchViewModel && this.addInBatchViewModel.ClaimIds.length > 0) {
      $('#addInBatchClaimModal').modal('show');
      this.AddInBatchProvider = -1;
      this.onTypeBatch();
    }
    else {
      swal("Claims", 'Please select at least one claim to add in batch', 'info');
    }
  }

  onSaveNewBatch() {
    if (this.batchForm.valid) {
      this.batchCreateViewModel.PracticeCode = this.GV.currentUser.selectedPractice.PracticeCode;
      this.batchCreateViewModel.DateStr = this.batchCreateViewModel.Date.toDateString();
      this.apiService.PostData(`/Submission/AddUpdateBatch`, this.batchCreateViewModel, (res) => {
        if (res.Status == "Success") {
          $('#batchModal').modal('hide');
          this.resetBatchForm();
          this.GetBatchesDetail();
          swal('Claim Batch', 'Batch has been created successfully.', 'success');
        }
        else {
          swal('Claim Batch', res.Status, 'error');
        }
      });
    }
  }

  resetBatchForm(): any {
    this.batchForm.reset();
    this.batchAddEditProviderControl.reset();
    (<FormControl>this.batchForm.get('type')).setValue('P', { emitEvent: true });
  }

  resetAddInBatch() {
    this.AddInBatchProviderFormControl.reset();
    this.batchSelectControl.reset();
  }

  onAddInBatch() {
    debugger
    if (this.batchSelectControl.valid) {
      this.addInBatchViewModel.PracticeCode = this.GV.currentUser.selectedPractice.PracticeCode;
      this.addInBatchViewModel.type = this.typeSelected;
      this.apiService.PostData(`/Submission/AddInBatch`, this.addInBatchViewModel, (res) => {
        if (res.Status == "Success") {
          $('#addInBatchClaimModal').modal('hide');
          this.resetAddInBatch();
          this.GetBatchesDetail();
          this.clearForm();
          swal('Claim Batch', 'Claim has been added to batch successfully.', 'success');
        }
        else {
          swal('Claim Batch', res.Status, 'error');
        }
      });
    }
  }

  GetBatchesDetail() {
    this.batchDetailsRequest.PracticeCode = this.GV.currentUser.selectedPractice.PracticeCode;
    this.batchDetailsRequest.prac_type = this.typeSelected ? this.typeSelected : this.selType;
    this.apiService.PostData(`/Submission/GetBatchesDetail`, this.batchDetailsRequest, (response) => {
      if (response.Status == "Success") {
        if (this.dataTableBatches) {
          this.dataTableBatches.destroy();
        }
        this.batchDetailsResponseList = response.Response;
        this.chRef.detectChanges();
        const table: any = $('.dataTableBatches');
        this.dataTableBatches = table.DataTable({
          lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
          columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
          },
          {
            visible: false,
            targets: 1
          }],
          select: {
            style: 'multi',
            selector: 'td:first-child'
          },
          order: [],  // <-- No default ordering
          language: {
            emptyTable: "No data available"
          }
        });
      }
      else {
        swal('Batches', response.Status, 'error');
      }
    });
  }

  askToLockBatch(batchId: number, claimsCount: number) {
    if (claimsCount > 0) {
      this.apiService.confirmFun('Batch Submission', 'Are you sure that you want to lock the selected batch?', () => {
        let request = new LockBatchRequestViewModel();
        request.BatchId = batchId;
        this.apiService.PostData(`/Submission/LockBatch`, request, (res) => {
          if (res.Status == "Success") {
            this.GetBatchesDetail();
            swal('Batch Lock', 'Batch has been locked successfully', 'success');
          } else {
            swal('Batch Lock', res.Status, 'error');
          }
        })
      })
    } else {
      swal('Batch Lock', 'The batch should have at least one claim to lock.', 'warning');
    }
  }

  GetPatientSummary(PatientAccount: any): any {
    if (!Common.isNullOrEmpty(PatientAccount)) {
      this.apiService.getDataWithoutSpinner(`/Demographic/GetPatientSummary?patientAccount=${PatientAccount}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe((res) => {
        if (res.Status == "Success") {
          this.patientSummary = res.Response;
        } else {
          swal('Patient Summary', res.Status, 'error');
        }
      })
    }
  }

  GetClaimSummary(ClaimNo: any) {
    if (!Common.isNullOrEmpty(ClaimNo)) {
      this.apiService.getDataWithoutSpinner(`/Demographic/GetClaimSummaryByNo?claimNo=${ClaimNo}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe((res) => {
        if (res.Status == "Success") {
          this.claimSummary = res.Response;
        } else {
          swal('Claim Summary', res.Status, 'error');
        }
      })
    }
  }

  // UploadBatches() {
  //   if (this.claimUploadDateRange.BeginDate != null && this.claimUploadDateRange.EndDate != null) {
  //     this.apiService.PostData(`/Submission/UploadBatches`, this.claimUploadDateRange, (res) => {
  //       if (res.Status == "Success") {
  //         if (res.Response.Type == 1) {
  //           swal('Batch upload', res.Response.Message, 'success');
  //         } else if (res.Response.Type == 2) {
  //           swal('Batch upload', res.Response.Message, 'warning');
  //         } else if (res.Response.Type == 3) {
  //           swal('Batch upload', res.Response.Message, 'info');
  //         }
  //       } else {
  //         swal('Batch upload', res.Status, 'error');
  //       }
  //     })
  //   }
  // }

  UploadBatches() {
    this.LastestBatchDetailsResponseList = []
    this.apiService.PostData(`/Submission/GetBatchesDetail`, this.batchDetailsRequest, (response) => {
      if (response.Status == "Success") {
        this.LastestBatchDetailsResponseList = response.Response;
        let containsPaper = false;
        let onHold = false;
        let hasZeroClaims = false;
        this.batchUploadRequest.BatcheIds = [];
        let selectedRows = this.dataTableBatches.rows({ selected: true });
        let selectedBatchesIds = this.dataTableBatches.cells(selectedRows.nodes(), 1).data();
        for (let index = 0; index < selectedBatchesIds.length; index++) {
          this.batchUploadRequest.BatcheIds.push(selectedBatchesIds[index]);
        }
        let batchDetail;
        let LatestBatchDetail;
        for (let index = 0; index < this.batchUploadRequest.BatcheIds.length; index++) {
          const batchId = this.batchUploadRequest.BatcheIds[index];

          batchDetail = this.batchDetailsResponseList.find(batch => batch.batch_id == batchId);
          LatestBatchDetail = this.LastestBatchDetailsResponseList.find(batch => batch.batch_id == batchId);
          if (LatestBatchDetail && LatestBatchDetail.On_Hold) {
            onHold = true
            break;
          }
          if (batchDetail && (batchDetail.Submission_Type == "Paper" || batchDetail.Submission_Type == "paper")) {
            containsPaper = true;
            break;
          }
          if (batchDetail && batchDetail.claimsTotal == 0) {
            hasZeroClaims = true;
          }
        }
        if (onHold == true) {
          swal("Batch upload", `Batch '${batchDetail.batch_name}' is on hold and can not be uploaded.`, "error");
          let selectedRows = this.dataTableBatches.rows({ selected: true });
          selectedRows.every((rowIdx) => {
            const rowData = this.dataTableBatches.row(rowIdx).data();
            const batchId = rowData[1];
            const batchRecord = this.LastestBatchDetailsResponseList.find(record => record.batch_id == batchId);
            let hold = false;
            if ((batchRecord && batchRecord.On_Hold === true) || (batchRecord && batchRecord.Submission_Type == 'Paper')) {
              hold = true;
            }
            if ((rowData && hold)) {
              this.dataTableBatches.row(rowIdx).deselect();
            }
          });
          // selectedRows.every((rowIdx) => {
          //   const rowData = this.dataTableBatches.row(rowIdx).data();
          //   const holdString = rowData[8].toString().trim();
          //   const parser = new DOMParser();
          //   const doc = parser.parseFromString(holdString, 'text/html');
          //   const checkbox = doc.querySelector('input[type="checkbox"]');
          //   let hold = false;
          //   debugger
          //   if (checkbox) {
          //     const inputCheckbox = checkbox as HTMLInputElement;
          //     const ngModel = inputCheckbox.getAttribute('ng-reflect-model');
          //     if (ngModel === "true") {
          //       hold = true;
          //     } else {
          //       hold = inputCheckbox.checked;
          //     }
          //   }
          //   if ((rowData && hold) || (rowData[4] && /paper/i.test(rowData[4]))) {
          //     this.dataTableBatches.row(rowIdx).deselect();
          //   }
          // });
        }
        else if (containsPaper == true) {
          swal("Batch upload", "Paper batch can not be uploaded.", "error");
          let selectedRows = this.dataTableBatches.rows({ selected: true });

          selectedRows.every((rowIdx) => {
            const rowData = this.dataTableBatches.row(rowIdx).data();
            const abc = rowData[8].toString();

            console.log("rowData", abc.includes('true'));

            const abcd = abc.includes('true');

            if (rowData) {
              console.log("rowData data", rowData);

              if (abcd) {
                this.dataTableBatches.row(rowIdx).deselect();

              }
            }
          });
          //this.GetBatchesDetail();
        }
        else if (hasZeroClaims) {
          swal("Batch upload", "No claim found in batches", "error");
          //this.GetBatchesDetail();
        }

        else {
          if (this.batchUploadRequest != null && this.batchUploadRequest.BatcheIds && this.batchUploadRequest.BatcheIds.length > 0) {
            this.apiService.PostData(`/Submission/UploadBatches`, this.batchUploadRequest, (res) => {
              if (res.Status == "Success") {
                if (res.Response.Type == 1) {
                  swal('Batch upload', res.Response.Message, 'success');
                } else if (res.Response.Type == 2) {
                  swal('Batch upload', res.Response.Message, 'warning');
                } else if (res.Response.Type == 3) {
                  swal('Batch upload', res.Response.Message, 'info');
                }
              } else {
                this.toastService.error(res.Response,'error');
                // swal('Batch upload', res.Response, 'error');
              }
              this.GetBatchesDetail();
            })
          } else {
            swal("Batch Upload", "Please select at least one batch to upload.", "warning");
          }
        }
      }
      else {
        swal('Batches', response.Status, 'error');
      }
    });
  }
  CanPrint(type: any) {
    debugger
    this.batchUploadRequest.BatcheIds = [];
    let selectedRows = this.dataTableBatches.rows({ selected: true });
    let selectedBatchesIds = this.dataTableBatches.cells(selectedRows.nodes(), 1).data();
    for (let index = 0; index < selectedBatchesIds.length; index++) {
      this.batchUploadRequest.BatcheIds.push(selectedBatchesIds[index]);
    }
    debugger
    this.batchIds = this.batchUploadRequest.BatcheIds.join(',');
    this.PrintBatches(type)

  }

  PrintBatches(type: any) {
    debugger
    if (type === "P") {
      this.isPrintable = true;
    }
    else
      this.isPrintable = false;
    this.batchUploadRequest.BatcheIds = [];

    let selectedRows = this.dataTableBatches.rows({ selected: true });
    let selectedBatchesIds = this.dataTableBatches.cells(selectedRows.nodes(), 1).data();

    for (let index = 0; index < selectedBatchesIds.length; index++) {
      this.batchUploadRequest.BatcheIds.push(selectedBatchesIds[index]);
    }

    if (!this.batchUploadRequest || this.batchUploadRequest.BatcheIds.length === 0) {
      swal("Batch Upload", "Please select Batches to print", "warning");
      return;
    }
    this.batchUploadRequest.BatcheIds.forEach(batchId => {
      debugger
      this.apiService.downloadFile(`/hcfa/GenerateBatchHcfa?batchIds=${batchId}&isPrintable=${this.isPrintable}&insuranceType=${'P'}`)
        .subscribe(response => {
          debugger
          const batchDetail = this.batchDetailsResponseList.find(detail => detail.batch_id == batchId);
          const batchName = batchDetail ? batchDetail.batch_name : 'Unknown Batch';
          if (response.type === 'application/json') {
            this.toast.warning(`No record found for batch ID: ${batchName}`);
          }
          else if (this.isPrintable && response.type === 'application/zip') {
            let blob = new Blob([response], { type: 'application/zip' });
            saveAs(blob, `${batchName}.zip`);
          }
          else if (this.isPrintable) {
            let blob = new Blob([response], { type: 'application/pdf' });
            saveAs(blob, `${batchName}.pdf`);
          } else {
            if (response.type === 'application/pdf') {
              let blob = new Blob([response], { type: 'application/pdf' });
              saveAs(blob, `${batchName}.pdf`);
            } else if (response.type === 'application/zip') {
              let blob = new Blob([response], { type: 'application/zip' });
              saveAs(blob, `${batchName}.zip`);
            }
          }
        }, error => {
          console.error(`Error downloading batch ID ${batchId}:`, error);
          swal("Error", `Failed to download batch ID ${batchId}`, "error");
        });
    });
  }

  //#endregion

  //#region ngx-select-ex
  // onTypePatient(value: any) {
  //   if (!Common.isNullOrEmpty(value) && value.length > 2) {
  //     if (!Common.isNullOrEmpty(this.subsPatientSelectList)) {
  //       this.subsPatientSelectList.unsubscribe();
  //     }
  //     this.subsPatientSelectList = this.apiService.getDataWithoutSpinner(`/Demographic/GetPatientSelectList?searchText=${value}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe(
  //       res => {
  //         if (res.Status == "Success") {
  //           this.patientSelectList = res.Response;
  //         }
  //       });
  //   }
  // }

  // onTypeInsurance(value: any) {
  //   if (!Common.isNullOrEmpty(value) && value.length > 2) {
  //     if (!Common.isNullOrEmpty(this.subInsuranceSelectList)) {
  //       this.subInsuranceSelectList.unsubscribe();
  //     }
  //     this.subInsuranceSelectList = this.apiService.getDataWithoutSpinner(`/Demographic/GetInsuranceSelectList?searchText=${value}`).subscribe(
  //       res => {
  //         if (res.Status == "Success") {
  //           this.insuranceSelectList = res.Response;
  //         }
  //       });
  //   }
  // }

  // onTypeProvider(value: any) {
  //   if (!Common.isNullOrEmpty(value) && value.length > 2) {
  //     if (!Common.isNullOrEmpty(this.subProviderSelectList)) {
  //       this.subProviderSelectList.unsubscribe();
  //     }
  //     this.subProviderSelectList = this.apiService.getDataWithoutSpinner(`/Demographic/GetProviderSelectList?searchText=${value}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe(
  //       res => {
  //         if (res.Status == "Success") {
  //           this.providerSelectList = res.Response;
  //         }
  //       });
  //   }
  // }

  onTypeAddUpdateBatchProvider() {
    if (!Common.isNullOrEmpty(this.subAddUpdateBatchProviderSelectList)) {
      this.subAddUpdateBatchProviderSelectList.unsubscribe();
    }
    this.batchAddEditSubmissionControl.setValue('Electronic');
    this.batchAddEditSubmissionTypeControl.setValue('P');
    this.subAddUpdateBatchProviderSelectList = this.apiService.getDataWithoutSpinner(`/Demographic/GetProviderSelectList?searchText=${''}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}&all=${true}`).subscribe(
      res => {
        if (res.Status == "Success") {
          this.AddUpdateBatchProviderSelectList = res.Response;
          if (this.AddUpdateBatchProviderSelectList.find(p => p.Name == 'All') == null) {
            this.AddUpdateBatchProviderSelectList = [new SelectListViewModel(-1, 'All'), ...this.AddUpdateBatchProviderSelectList];
          }
          this.batchCreateViewModel.ProviderCode = -1;
        }
      });
  }

  // onTypeLocation(value: any) {
  //   if (!Common.isNullOrEmpty(value) && value.length > 2) {
  //     if (!Common.isNullOrEmpty(this.subLocationSelectList)) {
  //       this.subLocationSelectList.unsubscribe();
  //     }
  //     this.subLocationSelectList = this.apiService.getDataWithoutSpinner(`/Demographic/GetLocationSelectList?searchText=${value}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}`).subscribe(
  //       res => {
  //         if (res.Status == "Success") {
  //           this.locationSelectList = res.Response;
  //         }
  //       });
  //   }
  // }
  //this is the from where we call this method
  onTypeBatch() {
    debugger
    if (!Common.isNullOrEmpty(this.subBatchSelectList)) {
      this.subBatchSelectList.unsubscribe();
    }
    this.subBatchSelectList =
      this.apiService.getDataWithoutSpinner(`/Submission/GetPendingBatchSelectList?practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}&providerCode=${this.AddInBatchProvider}&practype=${this.selType}&batch_claim_type=${this.claimsForm1.value.billedTo}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.batchesSelectList = res.Response;
          }
        });
  }

  onBatchSearchProviderSelect(e: any) {
    this.GetBatchesDetail();
  }

  resetBatchSelectList() {
    this.batchesSelectList = [];
    this.batchSelectControl.reset();
    this.onTypeBatch();
  }
  //#endregion

  //#region my-date-picker
  dateMaskGS(event: any) {
    var v = event.target.value;
    if (v.match(/^\d{2}$/) !== null) {
      event.target.value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      event.target.value = v + '/';
    }
  }

  onDateChange(value: IMyDateModel, type: string) {
    switch (type) {
      case 'dosFrom': {
        this.claimsSearch.DOSFrom = value.formatted;
        break;
      }
      case 'dosTo': {
        this.claimsSearch.DOSTo = value.formatted;
        break;
      }
      case 'date': {
        this.batchCreateViewModel.Date = new Date(value.formatted);
      }
    }

  }
  defaultBatchTypeSelection() {
    debugger
    if (!this.loggedInUser.selectedPractice.Billing_Type ||
      this.loggedInUser.selectedPractice.Billing_Type.toLocaleLowerCase() === "professional" ||
      this.loggedInUser.selectedPractice.Billing_Type === 'P&I') {
      this.batchCreateViewModel.BatchType = 'P';
    } else {
      this.batchCreateViewModel.BatchType = 'I';
    }
  }

  // onDateRangeChanged(event: IMyDateRangeModel) {
  //   this.claimUploadDateRange.BeginDate = event.beginJsDate;
  //   this.claimUploadDateRange.EndDate = event.endJsDate;
  //   this.claimUploadDateRange.BeginDateStr = event.beginJsDate.toDateString();
  //   this.claimUploadDateRange.EndDateStr = event.endJsDate.toDateString();
  // }
  //#endregion
  printBtnClick() {
    let containsElectronic = false;
    let hasZeroClaims = false;
    this.batchUploadRequest.BatcheIds = [];
    let selectedRows = this.dataTableBatches.rows({ selected: true });
    let selectedBatchesIds = this.dataTableBatches.cells(selectedRows.nodes(), 1).data();
    for (let index = 0; index < selectedBatchesIds.length; index++) {
      this.batchUploadRequest.BatcheIds.push(selectedBatchesIds[index]);
    }
    for (let index = 0; index < this.batchUploadRequest.BatcheIds.length; index++) {
      const batchId = this.batchUploadRequest.BatcheIds[index];

      const batchDetail = this.batchDetailsResponseList.find(batch => batch.batch_id == batchId);

      if (batchDetail && (batchDetail.Submission_Type == "Electronic" || batchDetail.Submission_Type == "electronic")) {
        containsElectronic = true;
        break;
      }
      if (batchDetail && batchDetail.claimsTotal == 0) {
        hasZeroClaims = true;
      }
    }
    debugger
    if (!this.batchUploadRequest || this.batchUploadRequest.BatcheIds.length == 0) {
      swal("Batch Print", "Please select at least one batch to print.", "warning");
      return
    }
    if (containsElectronic == true) {
      swal("Batch print", "Electronic batch can not be printed.", "error");
      //this.GetBatchesDetail();
      return
    }
    if (hasZeroClaims) {
      swal("Batch print", "No claim found in batches", "error");
      return;
    }
    $('#batchModal1').modal('show');
    (<FormControl>this.batchForm.get('type')).setValue('P', { emitEvent: true });

  }
  onHoldChange(batch) {
    debugger
    let request = new HoldBatchRequestViewModel();
    request.holdStatus = batch.On_Hold;
    request.BatchId = batch.batch_id

    this.apiService.PostData(`/Submission/HoldBatch`, request, (res) => {
      if (res.Status == "Success") {
        debugger
        const onHoldStatus = res.Response.On_Hold;
        batch.isHeld = !!onHoldStatus;
        this.GetBatchesDetail();
      }
      else {
        swal('Batch Hold', res.Status, 'error');
      }
    });
  }
  view837(batch) {
    let batch_id = batch.batch_id
    let practice_code = batch.practice_id
    this.batchName = batch.batch_name
    debugger
    this.API.getData('/Submission/View837?batchId=' + batch_id + '&practice_id=' + practice_code).subscribe(
      d => {
        this.objClaimDetail.ReadableDetailsError = "";
        if (d.Status === "Success") {
          if (d.Response.length == 0) {
            this.objClaimDetail.Details = 'No data Found';
            this.objClaimDetail.ReadableDetails = [];
            this.objClaimDetail.ReadableDetailsError = 'No data Found';
          }
          else {
            this.objClaimDetail.Details = d.Response.map(item => item.Response).join('\n');
            this.objClaimDetail.ReadableDetails = d.Response.map(item => item.Response1).join('\n');
            console.log("this.objClaimDetail.ReadableDetails", this.objClaimDetail.ReadableDetails);

            let result = [];

            // Split the input string by '~'
            let segments = this.objClaimDetail.ReadableDetails.split('~');


            console.log("segments", segments)
            let name = ''
            let value = ''
            // Create an array of objects to hold the name and value

            for (let i = 0; i < segments.length && segments.length > 1; i++) {
              debugger
              if (!segments[i].includes('*')) {
                name = segments[i].toUpperCase();
                ++i
                if (segments[i].includes('*')) {
                  value = segments[i];
                } else {
                  debugger
                  value = "";
                  --i
                }

              }
              else {
                value = segments[i];
                ++i
                if (!segments[i].includes('*')) {
                  name = segments[i].toUpperCase();
                } else {
                  debugger
                  name = "";
                  --i
                }

              }
              // The first part is the name, and the rest are the value


              // Return an object with the name and value
              result.push({ name: name, value: value });
            }

            // Output the result
            console.log(result);
            this.objClaimDetail.ReadableDetails = result
            this.objClaimDetail.ReadableDetails.shift();

            if (this.dataTable) {
              this.chRef.detectChanges();
              this.dataTable.destroy();
            }

            this.chRef.detectChanges();
            const table: any = $('.datatableReadable');
            this.dataTable = table.DataTable({
              language: {
                emptyTable: "No data available"
              },
              dom: this.datatableService.getDom(),
              buttons: this.datatableService.getExportButtons(['User Readable EDI file']),
              paging: false,  // Disable pagination, all records will be shown
              searching: false,  // Disable the search box to show all records by default
              info: false,
              ordering: false,
            });

          }
          $('#claimDetailModal').modal('show');
          this.initializeTabs();
        }

        else {
          let error = d.Response;
          if (error && error.length > 0) {
            let errorStr = error.join(', ');
            this.objClaimDetail.Details = error.join(', ').replace(/, /g, '\n');
            this.objClaimDetail.ReadableDetailsError = error.join(', ').replace(/, /g, '\n');
            this.objClaimDetail.ReadableDetails = error.join(', ').replace(/, /g, '\n');
            $('#claimDetailModal').modal('show');
            this.initializeTabs();
          }
          else {
            swal('Error', 'There was an error while generating EDI file', 'error');
          }
        }
      })
  }
  closeModal() {
    $('#claimDetailModal').modal('hide');
  }
  Export837() {
    if (this.objClaimDetail.Details !== 'No data Found') {
      let blob: any = new Blob([this.objClaimDetail.Details], { type: 'text/plain; charset=utf-8' });
      saveAs(blob, `${this.batchName}.txt`);
    }
    else {
      this.toast.warning('No Data to Export');
    }
  }
  printBtnClk(type: any) {
    $('#Confirmation').modal('show');
  }
  closeInsuranceModel(ch, type) {
    this.printBatchesOnly(ch, type)
    $('#Confirmation').modal('hide');
    $('.modal-backdrop').remove();
  }
  printBatchesOnly(ch, type , batchId = null) {
   this.choice = ch;
    if (type === "P") {
      this.isPrintable = true;
    }
    else
      this.isPrintable = false;
    this.batchUploadRequest.BatcheIds = [];

    let selectedRows = this.dataTableBatches.rows({ selected: true });
    let selectedBatchesIds = this.dataTableBatches.cells(selectedRows.nodes(), 1).data();
    if(batchId != null && batchId.length>0)
    {
      this.batchUploadRequest.BatcheIds.push(batchId);
    }

    for (let index = 0; index < selectedBatchesIds.length; index++) {
      this.batchUploadRequest.BatcheIds.push(selectedBatchesIds[index]);
    }

    if (!this.batchUploadRequest || this.batchUploadRequest.BatcheIds.length === 0) {
      swal("Batch Print", "Please select Batches to print", "warning");
      return;
    }

    this.batchUploadRequest.BatcheIds.forEach(batchId => {
      this.apiService.downloadFile(`/hcfa/GenerateBatchHcfa?batchIds=${batchId}&isPrintable=${this.isPrintable}&insuranceType=P&status=${ch}`)
        .subscribe(async (response: any) => {
          const batchDetail = this.batchDetailsResponseList.find(detail => detail.batch_id == batchId);
          const batchName = batchDetail ? batchDetail.batch_name : 'Unknown Batch';

          await this.handleBatchPrintResponse(response, batchName,this.choice);
        }, error => {
          console.error(`Error printing batch ID ${batchId}:`, error);
          swal("Error", `Failed to print batch ID ${batchId}`, "error");
        });
    });
  }
  async handleBatchPrintResponse(response: Blob, batchName: string, printCh: string) {
    if (response.type === 'application/zip' || response.type === 'application/pdf') {
          const mergedPdf = await PDFDocument.create();
        
          if (response.type === 'application/zip') {
            const zip = new JSZip();
            const arrayBuffer = await new Response(response).arrayBuffer();
            const unzipped = await zip.loadAsync(arrayBuffer);
            const fileEntries = Object.entries(unzipped.files);
        
            for (const [fileName, file] of fileEntries) {
              if (!fileName.toLowerCase().endsWith('.pdf')) continue;
        
              const fileData = await file.async('uint8array');
              const sourcePdf = await PDFDocument.load(fileData);
              const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
              copiedPages.forEach(page => mergedPdf.addPage(page));
            }
          } else if (response.type === 'application/pdf') {
            const arrayBuffer = await new Response(response).arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
          }
        
          // Generate merged PDF blob and open it
          const mergedPdfBytes = await mergedPdf.save();
          const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(mergedBlob);
        
          const printWindow = window.open(fileUrl, '_blank');
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }
        }
    if (response.type === 'application/zip' || response.type === 'application/pdf') {
      const zip = new JSZip();
      const arrayBuffer = await new Response(response).arrayBuffer();
      const unzipped = await zip.loadAsync(arrayBuffer);
      const fileEntries = Object.entries(unzipped.files);

      const mergedPdf = await PDFDocument.create();

      for (const [fileName, file] of fileEntries) {
        if (!fileName.toLowerCase().endsWith('.pdf')) continue;

        const fileData = await file.async('uint8array');
        const sourcePdf = await PDFDocument.load(fileData);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());

        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(mergedBlob);

      const printWindow = window.open(fileUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    }
   else
    {
      this.toast.warning(`No record found for batch ID: ${batchName}`);
    }
    if(printCh == 'Yes')
    {
      this.GetBatchesDetail();
    }
  }
}
