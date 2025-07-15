import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { IMyDpOptions } from 'mydatepicker';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { DenialReport } from '../classes/denial-report-model';
import { ActivatedRoute } from '@angular/router';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { DatatableService } from '../../../app/services/data/datatable.service';

@Component({
  selector: 'app-denial-report',
  templateUrl: './denial-report.component.html',
})
export class DenialReportComponent implements OnInit {
    public myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', 
        height: '25px', 
        width: '115%'
      }
      requestPayload: any = {
        practiceCode: '',
        Date_From: '',
        Date_To: '',
        criteria: ''
      };
      
      listPracticesList: any;
      SearchForm: FormGroup;
      denialReportDetailList: DenialReport[];
      denialReportDetail: any;

      ddlPracticeCode: number = 0;
      dateCriteria: '';
      isRouted: boolean = false;
  isSearchInitiated: boolean;
  exportdata:DenialReport[];
  searchText: string;
  count = 10;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  filteredRecords: any;


    constructor(
        public API: APIService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private chRef: ChangeDetectorRef,
        public toaster: ToastrService,
        private datatableService: DatatableService,

      
      ) {
        this.SearchForm = this.formBuilder.group({
            PracCode: ['', Validators.required],
            DateRange: [null, Validators.required],
            Criteria: ['', Validators.required],
          });

          this.denialReportDetailList = [];
      }
    
  ngOnInit() {
    this.getPractices();
    this.InitForm();

    // this.route.queryParams.subscribe(qs => {
    //   debugger
    //   if (qs && qs['PracticeCode']) {
    //     this.isRouted = true;
    //     this.ddlPracticeCode = qs['PracticeCode'];
    //     //this.getPatientAgingReport(qs['PracticeCode']);
    //   }
    // })


    console.log('HI i am on denial report');
  }
  InitForm() {
    this.SearchForm = this.formBuilder.group({
        PracCode: ['', Validators.required],
        DateRange: [null, Validators.required],
        Criteria: ['', Validators.required],
    });
  }
  onDateChanged(event: IMyDateRangeModel) {
    this.requestPayload.Date_From = Common.isNullOrEmpty(event.beginJsDate)
      ? null
      : moment(event.beginJsDate).format('MM/DD/YYYY');
    this.requestPayload.Date_To = Common.isNullOrEmpty(event.endJsDate)
      ? null
      : moment(event.endJsDate).format('MM/DD/YYYY');
  }
  getPractices() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      (d) => {
        if (d.Status === 'Sucess') {
          console.log('listPracticesList',d.Response);
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
        } else {
          console.log('Error');
          swal('Failed', d.Status, 'error');
        }
      }
    );
  }
  onSearch() {
    
    if (
     !this.canSearch()
    ) {
        return;

    } else {
      this.getDenialReportDetail();
      this.getDenialReportDetailExport();

      }
 

}
getDenialReportDetail(){
  debugger;
  let practiceCode=this.SearchForm.get('PracCode').value
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
  this.API.getData('/Report/DenialReportDetailPagination?PracticeCode='+practiceCode+'&Criteria='+this.requestPayload.criteria+'&DateFrom='+ this.requestPayload.Date_From+'&DateTo='+this.requestPayload.Date_To+'&Page='+this.currentPage + '&Count=' + this.count).subscribe(
   data => {
     debugger;
     this.isSearchInitiated = true;
     if (data.Status == 'Success') {
       this.denialReportDetailList =  data.Response.data;
       this.totalResults = data.Response.TotalRecords;
       this.currentPage = data.Response.CurrentPage;
       this.totalPages = Math.ceil(this.totalResults / this.count);
       this.filteredRecords = data.Response.FilteredRecords;
       console.log("Data",data.Response.data)
       console.log('DenialReportDetailPagination', data);

     } else {
      this.denialReportDetailList = [];
      console.log('DenialReportDetailPagination', this.denialReportDetailList.length);
    } }
   )
}
getDenialReportDetailExport(){
  debugger;
  let practiceCode=this.SearchForm.get('PracCode').value
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
  this.API.getData('/Report/DenialReportDetail?PracticeCode='+practiceCode+'&Criteria='+this.requestPayload.criteria+'&DateFrom='+ this.requestPayload.Date_From+'&DateTo='+this.requestPayload.Date_To).subscribe(
    data => {
     debugger;
     this.isSearchInitiated = true;
     if (data.Status == 'Success') {
       this.exportdata=data.Response.data;
       console.log('export data', data);
     } }
   )
}




canSearch(): boolean
{
  let practiceCode=this.SearchForm.get('PracCode').value
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
    if (isNullOrUndefined(practiceCode) || $.trim(practiceCode) == '') {
        swal('Facility', 'Please select Practice.', 'error');
        return false;
    }
    if (isNullOrUndefined(this.requestPayload.criteria) || $.trim(this.requestPayload.criteria) == '') {
        swal('Facility', 'Please select Date Criteria.', 'error');
        return false;
    }
    if (isNullOrUndefined(this.requestPayload.Date_From) || $.trim(this.requestPayload.Date_From) == '' || isNullOrUndefined(this.requestPayload.Date_To) || $.trim(this.requestPayload.Date_To) == '') {
        swal('Facility', 'Please select From-To Date.', 'error');
        return false;
    }
    return true;
}
onchangeCriteria(value: string){
  this.requestPayload.criteria = value.toString();
}
onchangePractices() {
  let practiceCode=this.SearchForm.get('PracCode').value
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
  this.requestPayload.practiceCode = practiceCode;
}



exportExcel() {
  // Remove PATIENT_DOBDAY from data and rename headers
  const modifiedData = this.exportdata.map(({ ...rest }) => {
      return rest;
  });
  const currencyKeys = ['AMOUNT_PAID', 'AMOUNT_ADJUSTED', 'REJECT_AMOUNT'];
  // Convert modified data to worksheet
  const worksheet = xlsx.utils.json_to_sheet(modifiedData);
  // Format the headers: Remove underscores and apply bold
  const headers = Object.keys(modifiedData[0]).map(header => {
      return header.replace(/_/g, ' ');  // Remove underscores
  });
  // Update the worksheet headers and apply bold style
  headers.forEach((header, index) => {
      const cellRef = xlsx.utils.encode_cell({ c: index, r: 0 });
      worksheet[cellRef] = { v: header, t: 's', s: { font: { bold: true } } };  // Apply bold style to header
  });
  // Specify column widths and format values correctly
  worksheet['!cols'] = [];
  modifiedData.forEach((row, rowIndex) => {
      Object.keys(row).forEach((key, colIndex) => {
          const cellRef = xlsx.utils.encode_cell({ c: colIndex, r: rowIndex + 1 });
          if (currencyKeys.includes(key) && typeof row[key] === 'number') {
            // Convert number to currency format for specific keys
            const currencyValue = `$ ${row[key].toFixed(2)}`;
            worksheet[cellRef] = { v: currencyValue, t: 's' }; // Set cell value and type to string
            worksheet['!cols'].push({ wch: currencyValue.length + 2 });
        } else if (key === 'PATIENT_ACCOUNT') {
              // Treat PATIENT_ACCOUNT as text to prevent rounding
              worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
              worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
          } else if (key === 'DOS' || key === 'DOS_FROM'|| key === 'DOS_TO'|| key === 'CHEQUE_DATE') {
              // Format dates as MM/DD/YYYY, or show empty string if null
              const dateValue = row[key];
              if (dateValue) {
                  const date = new Date(dateValue);
                  worksheet[cellRef] = { 
                      v: `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`, 
                      t: 's' 
                  };
              } else {
                  worksheet[cellRef] = { v: '', t: 's' };  // Display empty string for null dates
              }
              worksheet['!cols'].push({ wch: 12 });  // Set width for date columns
          } else if (typeof row[key] === 'number') {
              // For other numbers, keep them as numeric types
              worksheet[cellRef] = { v: row[key], t: 'n' };
              worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
          }
      });
  });

  // Create workbook and write it to buffer
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
  });

  this.saveAsExcelFile(excelBuffer, 'Denial Detail Report');
}
saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
  });
  FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
  );
}

onClear() {
  this.isSearchInitiated = false;
  this.chRef.detectChanges();
  // this.requestPayload.Response.=0;
  // if (this.dtCptWisePaymentDetail) {
  //   this.dtCptWisePaymentDetail.destroy();
  // }
  // this.PDForm.reset();
  this.denialReportDetailList = [];
  this.SearchForm.reset({
    PracCode: '',
    DateRange: null,
    Criteria: ''
});
}

countValueChanged(event) {
  const selectedCount = event.target.value;
  this.count = +selectedCount; // Convert the value to a number
  this.currentPage = 1; // Reset to the first page when count changes
  this.getDenialReportDetail();
}
loadPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.getDenialReportDetail();
  }
}

loadNextPage() {
  debugger
  if (this.currentPage < this.totalPages) {

    this.currentPage= this.currentPage + 1
    this.loadPage(this.currentPage);
  }
}

loadPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage = this.currentPage - 1;
    this.loadPage(this.currentPage);
  }
}


}



