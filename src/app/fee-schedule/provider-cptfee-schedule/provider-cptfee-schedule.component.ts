import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProviderCptPlan, ProviderCptPlan_Details, Practice, ProviderFeeScheduleSearchVM, StandartCPTFee, CreateProviderCPTPlanVM } from '../fee-schedule-model'
import { APIService } from '../../components/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { Subscription } from 'rxjs';
import { Common } from '../../services/common/common';
import { Pager, PagingResponse } from '../../models/common/pagination.model';

@Component({
  selector: 'app-provider-cptfee-schedule',
  templateUrl: './provider-cptfee-schedule.component.html'
})
export class ProviderCPTFeeScheduleComponent implements OnInit {
  hasFieldError: any[];
  mode: string = "";
  selectedProviderCPTPlanId: any;
  // Datatables
  dtProviderCPTFee: any;
  dtProviderDetailCPTFee: any;
  dtStandardCPTFee: any;
  searchRequest: ProviderFeeScheduleSearchVM;
  providerPlan: CreateProviderCPTPlanVM;
  // Forms
  searchForm: FormGroup;
  newProviderFeePlanForm: FormGroup;
  provider = new FormControl('');
  location = new FormControl('');
  insurance = new FormControl('');
  facility = new FormControl('');
  // Subscription
  subProviderSelectList: Subscription;
  subLocationSelectList: Subscription;
  subInsuranceSelectList: Subscription;
  // Select Lists
  insuranceSelectList: SelectListViewModel[];
  providerSelectList: SelectListViewModel[];
  locationSelectList: SelectListViewModel[];
  listProviderCPTFee: ProviderCptPlan[];
  listCPTDetail: ProviderCptPlan_Details[];
  listStandardCPTFee: StandartCPTFee[];
  listPractice: SelectListViewModel[];
  listStates: SelectListViewModel[];
  listOfCPTModified: ProviderCptPlan_Details[];
  pager: Pager;
  pagingResponse: PagingResponse;
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService) {
    this.listProviderCPTFee = [];
    this.listPractice = [];
    this.listStates = [];
    this.listCPTDetail = [];
    this.providerSelectList = [];
    this.locationSelectList = [];
    this.insuranceSelectList = [];
    this.searchRequest = new ProviderFeeScheduleSearchVM();
    this.providerPlan = new CreateProviderCPTPlanVM();
    this.listStandardCPTFee = [];
    this.ResetPagination();
    this.selectedProviderCPTPlanId = "";
    this.listOfCPTModified = [];
    this.hasFieldError = [];
  }

  ngOnInit() {
    this.InitForm();
    this.getDropDowns();
  }

  getDropDowns() {
    this.API.getData('/Setup/GetProviderFeeScheduleDD').subscribe(
      d => {
        if (d.Status == "Success" && d.Response != null) {
          this.listPractice = d.Response.Practices;
          this.listStates = d.Response.States;
          if (this.insuranceSelectList == null) {
            this.insuranceSelectList = [];
          }
          if (this.insuranceSelectList.find(p => p.Name == "All") == null) {
            this.insuranceSelectList.push(new SelectListViewModel(0, "All", "0"));
          }
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  InitForm() {
    this.searchForm = new FormGroup({
      practice: new FormControl('', [Validators.required]),
      state: new FormControl(''),
      facility: new FormControl(''),
      insurance: new FormControl(),
      insuranceOrSelfPay: new FormControl(),
      faciltiyOrLocation: new FormControl()
    });
    this.newProviderFeePlanForm = new FormGroup({
      standardOrPercentage: new FormControl(),
      percentageHigher: new FormControl(''),
      customize: new FormControl(),
      modificationAllowed: new FormControl(),
      computed: new FormControl()
    });
    this.newProviderFeePlanForm.valueChanges.subscribe(checked => {
      if (this.newProviderFeePlanForm.get('standardOrPercentage').value == "Percentage") {
        this.newProviderFeePlanForm.get('percentageHigher').setValidators([Validators.required]);
        this.newProviderFeePlanForm.get('percentageHigher').updateValueAndValidity({ onlySelf: true, emitEvent: true });
      } else {
        this.newProviderFeePlanForm.get('percentageHigher').clearValidators();
        this.newProviderFeePlanForm.get('percentageHigher').updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    });
  }

  onClickCPTPlan(Provider_Cpt_Plan_Id: any) {
    debugger
    this.selectedProviderCPTPlanId = Provider_Cpt_Plan_Id;
    this.ResetPagination();
    this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
  }

  onchangePractice() {
    //#region Reset Provider
    this.providerSelectList = this.providerSelectList.filter(f => f.Name == "All");
    if (this.providerSelectList == null) {
      this.providerSelectList = [];
    }
    if (this.providerSelectList.find(p => p.Name == "All") == null) {
      this.providerSelectList.push(new SelectListViewModel(0, "All", "0"));
    }
    this.searchRequest.ProviderCode = 0;
    //#endregion

    //#region Reset Facility
    this.locationSelectList = this.locationSelectList.filter(f => f.Name == "All");
    if (this.locationSelectList == null) {
      this.locationSelectList = [];
    }
    if (this.locationSelectList.find(p => p.Name == "All") == null) {
      this.locationSelectList.push(new SelectListViewModel(0, "All", "0"));
    }
    this.searchRequest.FacilityCode = 0
    //#endregion

    //#region Reset Insurance
    if (this.insuranceSelectList == null) {
      this.insuranceSelectList = [];
    }
    if (this.insuranceSelectList.find(p => p.Name == "All") == null) {
      this.insuranceSelectList.push(new SelectListViewModel(0, "All", "0"));
    }
    this.searchRequest.InsuranceId = Common.isNullOrEmpty(this.searchRequest.InsuranceId) ? 0 : this.searchRequest.InsuranceId;
    //#endregion

    this.searchRequest.FaciltiyOrLocation = "Facility";
    this.searchRequest.InsuranceOrSelfPay = "Insurance";
    this.searchRequest.State = Common.isNullOrEmpty(this.searchRequest.State) ? "0" : this.searchRequest.State;

  }

  GetProviderCPTDetailsList(ProviderCPTPlanId: any) {
    this.API.PostData('/Setup/GetProviderPlanDetails?ProviderCPTPlanId=' + ProviderCPTPlanId, this.pager, (d) => {
      if (d.Status == "Success") {
        this.mode = "edit";
        this.pagingResponse = d.Response;
      }
      else {
        swal('Failed', d.Status, 'error');
      }
    })
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.ResetPagination();
      this.listProviderCPTFee = [];
      this.listCPTDetail = [];
      this.API.PostData(`/Setup/GetProviderFeeSchedule`, this.searchRequest, (res) => {
        if (res.Status == "Success") {
          if (this.dtProviderCPTFee) {
            this.dtProviderCPTFee.destroy();
          }
          this.listProviderCPTFee = res.Response;
          this.mode = "";
          this.chRef.detectChanges();
          const table: any = $('.dtProviderCPTFee');
          this.dtProviderCPTFee = table.DataTable({
            select: true,
            language: {
              emptyTable: "No data available"
            }
          });
        } else if (res.Status == "Error") {
          swal("Provider CPT Fee Plan", "An error occured while getting Provider CPT Fee Plans.", "error");
        } else {
          swal("Provider CPT Fee Plan", res.Status, "info");
        }
      })
    }
  }

  //#region Ngx Select
  onTypeProvider(value: any) {
    if (!Common.isNullOrEmpty(value) && value.length > 2) {
      if (!Common.isNullOrEmpty(this.subProviderSelectList)) {
        this.subProviderSelectList.unsubscribe();
      }
      this.subProviderSelectList = this.API.getDataWithoutSpinner(`/Demographic/GetProviderSelectList?searchText=${value}&practiceCode=${this.searchRequest.PracticeCode}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.providerSelectList = res.Response;
            if (this.providerSelectList == null) {
              this.providerSelectList = [];
            }
            if (this.providerSelectList.find(p => p.Name == "All") == null) {
              this.providerSelectList.push(new SelectListViewModel(0, "All", "0"));
            }
          }
        });
    }
  }

  onTypeLocation(value: any) {
    if (!Common.isNullOrEmpty(value) && value.length > 2) {
      if (!Common.isNullOrEmpty(this.subLocationSelectList)) {
        this.subLocationSelectList.unsubscribe();
      }
      this.subLocationSelectList = this.API.getDataWithoutSpinner(`/Demographic/GetLocationSelectList?searchText=${value}&practiceCode=${this.searchRequest.PracticeCode}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.locationSelectList = res.Response;
            if (this.locationSelectList == null) {
              this.locationSelectList = [];
            }
            if (this.locationSelectList.find(p => p.Name == "All") == null) {
              this.locationSelectList.push(new SelectListViewModel(0, "All", "0"));
            }
          }
        });
    }
  }

  onTypeInsurance(value: any) {
    if (!Common.isNullOrEmpty(value) && value.length > 2) {
      if (!Common.isNullOrEmpty(this.subInsuranceSelectList)) {
        this.subInsuranceSelectList.unsubscribe();
      }
      this.subInsuranceSelectList = this.API.getDataWithoutSpinner(`/Demographic/GetInsuranceSelectList?searchText=${value}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.insuranceSelectList = res.Response;
            if (this.insuranceSelectList == null) {
              this.insuranceSelectList = [];
            }
            if (this.insuranceSelectList.find(p => p.Name == "All") == null) {
              this.insuranceSelectList.push(new SelectListViewModel(0, "All", "0"));
            }
          }
        });
    }
  }
  //#endregion

  new() {
    this.listProviderCPTFee = [];
    this.mode = "";
    this.ResetPagination();
    if (this.searchForm.valid) {
      this.API.PostData(`/Setup/InitProviderFeePlan`, this.searchRequest, (res) => {
        if (res.Status == "Success") {
          if (this.dtProviderCPTFee) {
            this.dtProviderCPTFee.destroy();
          }
          if (res.Response && res.Response.length > 0) {
            this.mode = "edit";
            this.listProviderCPTFee = res.Response;
            this.chRef.detectChanges();
            const table: any = $('.dtProviderCPTFee');
            this.dtProviderCPTFee = table.DataTable({
              select: true,
              language: {
                emptyTable: "No data available"
              }
            });
          } else {
            this.ResetPagination();
            this.GetStandardCPTsList();
          }
        }
        else if (res.Status == "Error") {
          swal("Fee Schedule", res.Status, "error");
        } else {
          this.mode = "new";
          this.providerPlan.StandardOrPercentAge = "Standard";
        }
      })
    }
  }

  canSave(): boolean {
    if (this.mode == 'new' && this.newProviderFeePlanForm.valid)
      return false;
    else if (this.mode == 'edit' && this.hasFieldError.length == 0)
      return false;
    return true;
  }

  save() {
    if (this.mode == 'new' && this.newProviderFeePlanForm.valid) {
      this.providerPlan.PracticeCode = this.searchRequest.PracticeCode;
      this.providerPlan.ProviderCode = this.searchRequest.ProviderCode;
      this.providerPlan.State = this.searchRequest.State;
      this.providerPlan.FacilityCode = this.searchRequest.FacilityCode;
      this.providerPlan.LocationCode = this.searchRequest.LocationCode;
      this.providerPlan.InsuranceId = this.searchRequest.InsuranceId;
      this.providerPlan.InsuranceOrSelfPay = this.searchRequest.InsuranceOrSelfPay;
      this.providerPlan.FaciltiyOrLocation = this.searchRequest.FaciltiyOrLocation;
      this.API.PostData('/Setup/CreateProviderCPTPlan', this.providerPlan, (response) => {
        if (response.Status == 'Success') {
          this.mode = "";
          swal("Provider CPF Fee Plan", "Provider CPT Fee Plan has been created successfully.", "success")
          this.providerPlan = new CreateProviderCPTPlanVM();
          this.newProviderFeePlanForm.reset();
        }
        else {
          swal("Provider CPF Fee Plan", response.Status, "error");
        }
      })
    } else if (this.mode == 'edit' && this.listOfCPTModified.length > 0) {
      this.SubmitChangedCPTs(this.listOfCPTModified, 'btnSave');
    }
  }

  DeleteProviderCPTPlan(planId: any) {
    this.API.confirmFun("Confirm Delete", "Are you sure that you want to delete selected Plan and all of it's CPT's?", () => {
      this.API.getData(`/Setup/DeleteProviderPlanAndCPT?planId=${planId}`).subscribe(response => {
        if (response.Status == 'Success') {
          this.mode = "";
          swal("Provider CPF Fee Plan", "Provider CPT Plan has been deleted.", "success");
          this.onSearch();
        } else {
          swal("Provider CPF Fee Plan", response.Status, "error");
        }
      })
    })
  }

  FilterStandardCPTS() {
    this.pager.Page = 1;
    this.GetStandardCPTsList();
  }

  GetStandardCPTsList() {
    this.API.PostData(`/Setup/PaginateStandardCPTFee?practiceCode=${this.searchRequest.PracticeCode}`, this.pager, (response) => {
      if (response.Status == 'Success') {
        this.mode = "new";
        this.pagingResponse = response.Response;
        this.providerPlan.StandardOrPercentAge = "Standard";
      }
    })
  }

  ResetPagination() {
    this.pager = new Pager(1, 25);
    this.pagingResponse = new PagingResponse();
    this.hasFieldError = [];
    this.listOfCPTModified = [];
  }

  FilterProviderCPTs() {
    if (this.listOfCPTModified.length > 0) {
      swal({
        title: "Submit changes",
        text: "Do you want to submit changes of current page before moving to the next?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes! submit',
        cancelButtonText: 'No, changes will be lost'
      }).then((willSave) => {
        if (willSave) {
          this.pager.Page = 1;
          this.hasFieldError = [];
          this.SubmitChangedCPTs(this.listOfCPTModified);
          this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
        }
      }, () => {
        this.listOfCPTModified = [];
        this.pager.Page = 1;
        this.hasFieldError = [];
        this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
      });
    }
    else {
      this.listOfCPTModified = [];
      this.pager.Page = 1;
      this.hasFieldError = [];
      this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
    }
  }

  pageChanged(e, type: string) {
    switch (type) {
      case 'standardCPT': {
        this.GetStandardCPTsList();
        this.pager.Page = e;
      }
        break;
      case 'cptDetail':
        {
          if (this.listOfCPTModified.length > 0) {
            swal({
              title: "Submit changes",
              text: "Do you want to submit changes of current page before moving to the next?",
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes! submit',
              cancelButtonText: 'No, changes will be lost'
            }).then((willSave) => {
              if (willSave) {
                this.pager.Page = e;
                this.hasFieldError = [];
                this.SubmitChangedCPTs(this.listOfCPTModified);
                this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
              }
            }, () => {
              this.listOfCPTModified = [];
              this.pager.Page = e;
              this.hasFieldError = [];
              this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
            });
          }
          else {
            this.listOfCPTModified = [];
            this.pager.Page = e;
            this.hasFieldError = [];
            this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
          }
          break;
        }
    }
  }

  SubmitChangedCPTs(listOfCPTModified: ProviderCptPlan_Details[], calledFrom: any = 'pagination') {
    this.API.PostData(`/Setup/UpdateProviderCPTDetails?Id=${this.selectedProviderCPTPlanId}`, this.listOfCPTModified, (response) => {
      if (response.Status == 'Success') {
        this.listOfCPTModified = [];
        if (calledFrom != 'pagination') {
          swal("Provider CPT Details", 'Provider CPT Details has been updated successfully', 'success');
          this.GetProviderCPTDetailsList(this.selectedProviderCPTPlanId);
        }
      } else {
        swal("Provider CPT Details", response.Status, 'error');
      }
    })
  }

  ValidateInput(e: any, index: number, type: string) {
    let regexExpression = new RegExp(/^-?\d+\.?\d*$/);
    if (regexExpression.test(e.target.textContent)) {
      //CPT Modified
      let indexFromModifiedList;
      if (this.listOfCPTModified == null) {
        this.listOfCPTModified = [];
      }
      let currentCPT = this.listOfCPTModified.find(f => f.Cpt_Code == this.pagingResponse.data[index].Cpt_Code);
      if (currentCPT == null) {
        currentCPT = new ProviderCptPlan_Details();
        currentCPT.Cpt_Code = this.pagingResponse.data[index].Cpt_Code;
        currentCPT.Cpt_Description = this.pagingResponse.data[index].Cpt_Description;
        currentCPT.Cpt_Modifier = this.pagingResponse.data[index].Cpt_Modifier;
        currentCPT.Created_By = this.pagingResponse.data[index].Created_By;
        currentCPT.Deleted = this.pagingResponse.data[index].Deleted;
        currentCPT.Facility_Non_Participating_Fee = this.pagingResponse.data[index].Facility_Non_Participating_Fee;
        currentCPT.Facility_Non_Participating_Fee_ctrl_Fee = this.pagingResponse.data[index].Facility_Non_Participating_Fee_ctrl_Fee;
        currentCPT.Facility_Participating_Fee = this.pagingResponse.data[index].Facility_Participating_Fee;
        currentCPT.Facility_Participating_Fee_ctrl_Fee = this.pagingResponse.data[index].Facility_Participating_Fee_ctrl_Fee;
        currentCPT.Modified_By = this.pagingResponse.data[index].Modified_By;
        currentCPT.Non_Facility_Non_Participating_Fee = this.pagingResponse.data[index].Non_Facility_Non_Participating_Fee;
        currentCPT.Non_Facility_Non_Participating_Fee_ctrl_Fee = this.pagingResponse.data[index].Non_Facility_Non_Participating_Fee_ctrl_Fee;
        currentCPT.Non_Facility_Participating_Fee = this.pagingResponse.data[index].Non_Facility_Participating_Fee;
        currentCPT.Non_Facility_Participating_Fee_ctrl_Fee = this.pagingResponse.data[index].Non_Facility_Participating_Fee_ctrl_Fee;
        currentCPT.Provider_Cpt_Plan_Detail_Id = this.pagingResponse.data[index].Provider_Cpt_Plan_Detail_Id;
        currentCPT.Provider_Cpt_Plan_Id = this.pagingResponse.data[index].Provider_Cpt_Plan_Id;
        this.listOfCPTModified.push(currentCPT);
      }
      indexFromModifiedList = this.listOfCPTModified.findIndex(f => f.Cpt_Code == this.pagingResponse.data[index].Cpt_Code);
      switch (type) {
        case 'nfpf':
          this.pagingResponse.data[index].Non_Facility_Participating_Fee = e.target.textContent;
          this.listOfCPTModified[indexFromModifiedList].Non_Facility_Participating_Fee = e.target.textContent;
          break;
        case 'nfnpf':
          this.pagingResponse.data[index].Non_Facility_Non_Participating_Fee = e.target.textContent;
          this.listOfCPTModified[indexFromModifiedList].Non_Facility_Non_Participating_Fee = e.target.textContent;
          break;
        case 'fpf':
          this.pagingResponse.data[index].Facility_Participating_Fee = e.target.textContent;
          this.listOfCPTModified[indexFromModifiedList].Facility_Participating_Fee = e.target.textContent;
          break;
        case 'fnpf':
          this.pagingResponse.data[index].Facility_Non_Participating_Fee = e.target.textContent;
          this.listOfCPTModified[indexFromModifiedList].Facility_Non_Participating_Fee = e.target.textContent;
          break;
      }
      if (e.target.classList.contains('red')) {
        e.target.classList.remove('red');
      }
      e.target.classList.add('green');
      if (this.hasFieldError.findIndex(f => f.index == index && f.type == type) > -1) {
        this.hasFieldError.splice(this.hasFieldError.findIndex(f => f.index == index && f.type == type), 1);
      }
    } else {
      if (this.hasFieldError.findIndex(f => f.index == index && f.type == type) < 0) {
        this.hasFieldError.push({ index: index, type: type });
      }
      if (e.target.classList.contains('green')) {
        e.target.classList.remove('green');
      }
      e.target.classList.add('red');
    }
  }
}