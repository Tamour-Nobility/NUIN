import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { ERASearchRequestModel } from '../models/era-search-request.model';
import { ERASearchResponseModel } from '../models/era-search-response.model';
import { ERACheckDetails } from '../models/era-check-details.model';
import { Common } from '../../services/common/common';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { get, post } from 'jquery';
declare var $: any

@Component({
  selector: 'app-eraimport',
  templateUrl: './eraimport.component.html',
  styleUrls: ['./eraimport.component.css']
})
export class ERAImportComponent implements OnInit  {
  ERASearchForm: FormGroup;
  eraSearchRequest: ERASearchRequestModel;
  eraSearchResponse: ERASearchResponseModel[];
  eraSummary: ERACheckDetails[];
  dataTableERA: any;
  isSearchInitiated: boolean = false;
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
  };
  prac:any;
  ERADownloadButtonStatus:any=[];
  constructor(private API: APIService,
    public Gv: GvarsService,
    private toastService: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
    this.eraSearchRequest = new ERASearchRequestModel();
    this.eraSearchResponse = [];
    this.eraSummary = [];
  }







  ngOnInit() {
    console.log("this.Gv.ERADownloadButtonStatus",this.Gv.ERADownloadButtonStatus);
    // this.Gv.ERADownloadButtonStatus !=null ?  this.Gv.ERADownloadButtonStatus= JSON.parse(localStorage.getItem('ERADownloadButtonStatus')) : this.Gv.ERADownloadButtonStatus=[];
    // console.log("this.Gv.ERADownloadButtonStatus",this.Gv.ERADownloadButtonStatus);

    if( localStorage.getItem('sp') === null){
      this.prac = {PracticeCode: '1010999'}
      this.prac = Number(this.prac['PracticeCode']);
      console.log("default Practice",this.prac);
    }else{
      this.prac=JSON.parse(localStorage.getItem('sp'));
      this.prac= this.prac['PracticeCode'];
      this.prac= Number(this.prac); 
      console.log("change Practice ERA/Import?practiceCode=",this.prac);
    }

    this.ERADownloadBTStatus()

    this.InitializeForm();
    const { snapshot } = this.route;
    const { queryParamMap } = snapshot;
    this.eraSearchRequest.status = queryParamMap.get('status');
    this.eraSearchRequest.practiceCode = Number(queryParamMap.get('practiceCode'));
    this.eraSearchRequest.patientAccount = queryParamMap.get('patientAccount');
    this.eraSearchRequest.icnNo = queryParamMap.get('icnNo');
    this.eraSearchRequest.checkNo = queryParamMap.get('checkNo');
    this.eraSearchRequest.dateTo = queryParamMap.get('dateTo');
    this.eraSearchRequest.dateFrom = queryParamMap.get('dateFrom');
    this.eraSearchRequest.checkAmount = queryParamMap.get('checkAmount');
    this.eraSearchRequest.dateType = queryParamMap.get('dateType');
    if (this.canSearch()) {
      if (!Common.isNullOrEmpty(this.eraSearchRequest.dateTo) && !Common.isNullOrEmpty(this.eraSearchRequest.dateFrom))
        this.setDateRange(new Date(this.eraSearchRequest.dateFrom), new Date(this.eraSearchRequest.dateTo));
      this.onSearch();
    }
    else {
      this.setDefaultFilter();
      this.onSearch();
    }
  }

  ERADownloadBTStatus(){
    console.log("this.Gv.ERADownloadButtonStatus.includes(this.prac)",this.Gv.ERADownloadButtonStatus)
    if(this.Gv.ERADownloadButtonStatus.includes(this.prac)){
      this.Gv.ERADownloadButton=true
      this.Gv.ERADownloadButtonTooltip="ERA downloading is In-process. records will be available shortly. Meanwhile, you can perform other tasks."
    }else{
      this.Gv.ERADownloadButton=false
      this.Gv.ERADownloadButtonTooltip="Click to start ERA downloading process."
    }
  }

  downloadCustomERA(){
if(this.Gv.ERADownloadButton!=true){
  this.Gv.ERADownloadButtonTooltip="ERA downloading is In-process. records will be available shortly. Meanwhile, you can perform other tasks."
  localStorage.setItem('ERADownloadButtonTooltip', JSON.stringify('ERA downloading is In-process. records will be available shortly. Meanwhile, you can perform other tasks.'));
  this.Gv.ERADownloadButton=true
  localStorage.setItem('ERADownloadButton', JSON.stringify(true));
  this.toastService.success('The processing of your Manual ERA request has begin. Just be patient. '+this.prac, 'Manual ERA Download');
 
  
  var RolesAndRights=JSON.parse(localStorage.getItem('rr'));
  console.log("User Name:",RolesAndRights[0].UserName,"User ID",RolesAndRights[0].UserId)
  
  let userDetails = {
    UserID  : RolesAndRights[0].UserId,
    UserName : RolesAndRights[0].UserName,
    PracticeCde:this.prac,
  };
   if(this.Gv.ERADownloadButtonStatus.includes(this.prac)){
    
   }else{
    this.Gv.ERADownloadButtonStatus.push(this.prac)
    console.log("this.Gv.ERADownloadButtonStatus",this.Gv.ERADownloadButtonStatus);
   }

  localStorage.setItem('ERADownloadButtonStatus', JSON.stringify(this.prac));
  
  

  this.API.PostDataWithoutSpinnerERA('/ERA/Import',userDetails, (res) => {
    console.log("Custom download ERA",res)
    if(res.Status='Successfull'){
      this.Gv.ERAResponse=res.Response;
      this.Gv.ERADownloadButtonTooltip="Click to start ERA downloading process."
      localStorage.setItem('ERADownloadButtonTooltip', JSON.stringify('Click to start ERA downloading process.'));
      
      localStorage.setItem('ERADownloadButton', JSON.stringify(false));
      this.toastService.success('Your  Manual ERA request are complete please check it.'+ this.Gv.ERAResponse.PracticeCode, 'Manual ERA Download');
      if( localStorage.getItem('sp') === null){
        this.prac = {PracticeCode: '1010999'}
        this.prac = Number(this.prac['PracticeCode']);
        console.log("default Practice",this.prac);
      }else{
        this.prac=JSON.parse(localStorage.getItem('sp'));
        this.prac= this.prac['PracticeCode'];
        this.prac= Number(this.prac); 
        console.log("change Practice ERA/Import?practiceCode=",this.prac);
      }
      if(this.Gv.ERAResponse.PracticeCode==this.prac){
        
        $('#ERAModal').modal('show');
      }

      if(this.Gv.ERADownloadButtonStatus.includes(this.Gv.ERAResponse.PracticeCode)){
        this.Gv.ERADownloadButton=false
        const index = this.Gv.ERADownloadButtonStatus.indexOf(this.Gv.ERAResponse.PracticeCode);
if (index > -1) { // only splice array when item is found
  this.Gv.ERADownloadButtonStatus.splice(index, 1); // 2nd parameter means remove one item only
}
      }
      this.ERADownloadBTStatus()

      

    }
  });
}
   

  }
  setDefaultFilter() {
    this.eraSearchRequest = new ERASearchRequestModel();
    let date = new Date();
    let beginDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDate = date;
    this.setDateRange(beginDate, endDate);
    this.eraSearchRequest.dateFrom = moment(beginDate).format('MM/DD/YYYY');
    this.eraSearchRequest.dateTo = moment(endDate).format('MM/DD/YYYY');
  }

  setDateRange(begin, end): void {
    this.ERASearchForm.patchValue({
      dateRange: {
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

  InitializeForm(): any {
    this.ERASearchForm = new FormGroup({
      checkNo: new FormControl(null),
      checkAmount: new FormControl(null),
      dateRange: new FormControl(null),
      dateType: new FormControl(null),
      patientAccount: new FormControl(null),
      icnNo: new FormControl(null),
      status: new FormControl()
    });
  }

  onDateRangeChanged(event: IMyDateRangeModel) {
    this.eraSearchRequest.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
    this.eraSearchRequest.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    if (this.eraSearchRequest.dateFrom === null && this.eraSearchRequest.dateTo === null)
      this.eraSearchRequest.dateType = null;
  }
  // my date picker methods
  dateMaskGS(event: any) {
    var v = event.target.value;
    if (v.match(/^\d{2}$/) !== null) {
      event.target.value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      event.target.value = v + '/';
    }
  }

  onSearch() {
    if (this.canSearch()) {
      this.eraSearchRequest.practiceCode = this.Gv.currentUser.selectedPractice.PracticeCode;
      this.API.PostData('/Submission/SearchERA', this.eraSearchRequest, (res) => {
        this.generateQueryString(this.eraSearchRequest);
        this.isSearchInitiated = true;
        if (res.Status == "success") {
          if (this.dataTableERA) {
            this.chRef.detectChanges();
            this.dataTableERA.destroy();
          }
          this.eraSearchResponse = res.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableERA');
          this.dataTableERA = table.DataTable({
            columnDefs: [
              { orderable: false, targets: -1 }
            ],
            language: {
              emptyTable: "No data available"
            },
            order: [1, 'desc'],
          })
        }
        else
          swal(res.status, res.Response, 'error');
      });
    } else {
      this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
    }
  }

  generateQueryString(obj: any) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: obj,
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
      // do not trigger navigation
    });
  }

  canSearch() {
    return (!Common.isNullOrEmpty(this.eraSearchRequest.checkNo) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.checkAmount) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.dateFrom) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.dateTo) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.patientAccount) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.icnNo) ||
      !Common.isNullOrEmpty(this.eraSearchRequest.status));
  }

  onClear() {
    this.chRef.detectChanges();
    this.dataTableERA.destroy();
    this.eraSearchRequest = new ERASearchRequestModel();
    this.eraSearchResponse = [];
    this.isSearchInitiated = false;
    this.ERASearchForm.reset();
  }

  onChangeDateRangeType() {
    if (this.eraSearchRequest.dateType === null) {
      this.eraSearchRequest.dateFrom = null;
      this.eraSearchRequest.dateTo = null;
      this.clearDateRange();
      this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: true };
    } else {
      this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: false };
    }
  }

  clearDateRange(): void {
    this.ERASearchForm.patchValue({ dateRange: '' });
  }

}