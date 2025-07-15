import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { ReportRequestModel } from '../../../models/report-request.model';
import { Common } from '../../../../../app/services/common/common';
import { APIService } from '../../../../components/services/api.service';
import { CPA_DATA_CRITERIA, CPA_DATA_CRITERIA_NOBILITY, CPA_DATE_CRITERIA, CPA_FAILITIES } from '../../../models/report-criterias';
import { DatatableService } from '../../../../services/data/datatable.service';
import { CurrencyPipe } from '@angular/common';
import { GvarsService } from '../../../../services/G_vars/gvars.service';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { NO_DATA_AGAINST_FILTER } from '../../../../constants/messages';

@Component({
  selector: 'app-cpa',
  templateUrl: './cpa.component.html',
  styleUrls: ['./cpa.component.css']
})

export class CpaComponent implements OnInit {
  
    //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  value1:any=0;
  value2:any=0;
  columnNumber:any=6;
  isReportingPractice:any;


  form: FormGroup;
  request: ReportRequestModel;
  dataTable: any;
  isSearchInitiated: boolean = false;
  today = new Date();
  isDateValid: boolean;
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
    disableSince: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() + 1,
    },
  };
  mappedReportData: any[] = [];
  reportColumns: any[] = [];
  dateRangeTypes = CPA_DATE_CRITERIA;
  dataCriteria = CPA_DATA_CRITERIA;
//  dataCriteriaNobility = CPA_DATA_CRITERIA_NOBILITY;
  cpaFacilities = CPA_FAILITIES;
  locationSelectList: SelectListViewModel[];
  selectedLocations: SelectListViewModel[];
  locationsSettings = {};
      //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  facilitiesSettings = {};
  constructor(
    private chRef: ChangeDetectorRef,
    private toastService: ToastrService,
    private API: APIService,
    private gv: GvarsService,
    private datatableService: DatatableService,
    private currency: CurrencyPipe) {
    this.request = new ReportRequestModel();
    this.locationSelectList = [];
    this.selectedLocations = [];
  }

    //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
criteriaSelection()
{
if(this.gv.isReportingPerson())
{
this.dataCriteria = CPA_DATA_CRITERIA;
this.value1=5;
this.value2=6;
this.columnNumber=6;
}
else{
  this.dataCriteria = CPA_DATA_CRITERIA_NOBILITY;
  this.value1=4;
  this.value2=3;
  this.columnNumber=4
}
}
  ngOnInit() {
    //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
    this.criteriaSelection();
    this.initForm();
    this.request.dateType = this.dateRangeTypes[0].id;
    this.request.dataType = this.dataCriteria[0].id;
    this.getLocations();
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

    //Updated by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
    this.facilitiesSettings={
      text: "Select Facilities",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Id",
      labelKey: "Name",
      noDataLabel: "No Facilities Exists...",
//      enableSearchFilter: true,
      badgeShowLimit: 2
    };

    this.isDateValid = false;
  }

  initForm() {
    this.form = new FormGroup({
      dateRangeType: new FormControl(null, [Validators.required]),
      dateRange: new FormControl(null, [Validators.required]),
      dataCriteria: new FormControl(null, [Validators.required]),
      location: new FormControl(null)
    });
  }

    //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  getLocations() {
      
    this.locationSelectList=[];
    this.selectedLocations=[];
    this.mappedReportData = [];
if(this.request.dataType=='FACILITY_WISE' && !this.gv.isReportingPerson())
{
  this.API.getData(`/Demographic/GetFacilitySelectList?practiceCode=${this.gv.currentUser.selectedPractice.PracticeCode}`).subscribe(res => {
    if (res.Status === 'Success')
      this.locationSelectList = res.Response;
      if(this.locationSelectList.length>0)
      {
        this.facilitiesSettings = { ...this.facilitiesSettings, enableSearchFilter: true, };
      }
  });
}
else
{
    this.API.getData(`/Demographic/GetLocationSelectList?searchText=''&practiceCode=${this.gv.currentUser.selectedPractice.PracticeCode}&all=${true}`).subscribe(res => {
      if (res.Status === 'Success')
        this.locationSelectList = res.Response;
    });
}
}
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.request.dateFrom = Common.isNullOrEmpty(event.beginDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
    this.request.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
  }

  canSearch() {
    return (
      !Common.isNullOrEmpty(this.request.dateType) &&
      !Common.isNullOrEmpty(this.request.dateFrom) &&
      !Common.isNullOrEmpty(this.request.dateTo) &&
      !Common.isNullOrEmpty(this.request.dataType) &&
      (!Common.isNullOrEmpty(this.selectedLocations) && this.selectedLocations.length > 0) &&
      this.form.valid && this.isDateValid
    );
  }

  onSearch() {
    if (this.canSearch()) {
      this.request.practiceCode = this.gv.currentUser.selectedPractice.PracticeCode;
      this.request.locationCode = this.selectedLocations.map(l => l.Id);
      this.API.PostData('/report/cpa', this.request, (res) => {
        this.isSearchInitiated = true;
          if (res.Status == "success" && res.Response && res.Response.length > 0) {
          this.updateDatatable(res.Response);
        }
        else {
          this.toastService.warning(NO_DATA_AGAINST_FILTER, 'No result');
          this.updateDatatable(res.Response);
        }
      });
    }
    else {
      this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
    }
  }

  updateDatatable(data) {
    this.mappedReportData = [];
    this.reportColumns = [];
    if (this.dataTable) {
      this.chRef.detectChanges();
      this.dataTable.destroy();
    }
    this.mappedReportData = data.map(obj => Object.values(obj).map((v, index) => index > this.columnNumber ? this.currency.transform(v) : v));
    if (data.length > 0)
      this.reportColumns = Object.keys(data[0]).map((key) => ({ title: key }));
    this.chRef.detectChanges();
    const table: any = $('.dataTableChargesCPA');
    this.dataTable = table.DataTable({
      "data": this.mappedReportData,
      "columns": this.reportColumns,
      "scrollX": true,
      'order': [[this.value1, 'desc'], [this.value2, 'desc']],
      dom: this.datatableService.getDom(),
      buttons: this.datatableService.getExportButtons(['CPA', this.request.dateFrom, this.request.dateTo]),
    });
  }

  onClear() {
    this.chRef.detectChanges();
    this.mappedReportData = [];
    this.reportColumns = [];
    this.isSearchInitiated = false;
    this.form.reset();
    this.request = new ReportRequestModel();
    this.selectedLocations = [];
  }

  onDeSelectAllLocations() {
    this.selectedLocations = [];
  }

  inputFieldChanged({ valid }) {
    this.isDateValid = valid;
  }
}
 