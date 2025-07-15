import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../components/services/api.service';
import { ReportRequestModel } from '../../dynamic-reports/models/report-request.model';
import { Common } from '../../services/common/common';
import { DatatableService } from '../../services/data/datatable.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-scrubber-rejection-report',
  templateUrl: './scrubber-rejection-report.component.html',
  styleUrls: ['./scrubber-rejection-report.component.css']
})
export class ScrubberRejectionReportComponent implements OnInit {
  Clear = true;
  SearchForm: FormGroup;
  showHistory = false;
  DataTable: any;
  request: ReportRequestModel;
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '167%',
  };
  scrubberrejectionhistory: any;
  ScrubberRejectionCountDetail: any;
  ScrubberRejectionCountDetailclaimwise: any;
  ScrubberRejectionReport: any = [];
  ScrubberRejectionCount: any = [];
  ScrubberRejectionCountClaimwise: any = [];
  totalChargeAmountSum: number = 0;
  totalClaim: number = 0;
  listPracticesList: any;
  requestPayload: any = {
    practiceCode: '',
    Date_From: '',
    Date_To: ''
  };
  ddlPracticeCode: number = 0;
  //: boolean = false;
  sortingColumn: string = '';
  sortingDirection: number = 1;
  count = 10;
  searchTerm: string;
filteredData: any[];
fullData: any[];
searchText: string;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;

  filteredRecords: any;
  exportdata:any;
  isSearchInitiated: boolean;
  @ViewChild(ScrubberRejectionReportComponent) patientAttachments;
  

  constructor(
    private chRef: ChangeDetectorRef,
    private toastService: ToastrService,
    private API: APIService,
    public datatableService: DatatableService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.request = new ReportRequestModel();
    this.SearchForm = this.formBuilder.group({
      PracCode: ['0', Validators.required],
      DOSRange: [null],
    });
  }

  ngOnInit() {
    this.getPractices();
    this.InitForm();
  }

  onchangePractices() {

   
    let practiceCode=this.SearchForm.get('PracCode').value
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.requestPayload.practiceCode = practiceCode ;
    this.showHistory = false;
    if (this.scrubberrejectionhistory) {
      this.scrubberrejectionhistory.destroy();
      this.scrubberrejectionhistory = null;
    }

    if (this.ScrubberRejectionCountDetailclaimwise) {
      this.ScrubberRejectionCountDetailclaimwise.destroy();
      this.ScrubberRejectionCountDetailclaimwise = null;
    }

    if (this.ScrubberRejectionCountDetail) {
      this.ScrubberRejectionCountDetail.destroy();
      this.ScrubberRejectionCountDetail = null;
    }

    this.ScrubberRejectionReport = [];
    this.ScrubberRejectionCount = [];
    this.ScrubberRejectionCountClaimwise = [];
    this.totalChargeAmountSum = 0;
    this.totalClaim = 0;


    console.log(typeof this.requestPayload.practiceCode);
  }

  InitForm() {
    this.SearchForm = this.formBuilder.group({
      PracCode: ['', Validators.required],
      DOSRange: [null],
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

  onSearch() {
    if (this.scrubberrejectionhistory) {
      this.scrubberrejectionhistory.destroy();
      this.scrubberrejectionhistory = null;
    }

    if (
      this.requestPayload.practiceCode &&
      this.requestPayload.Date_From &&
      this.requestPayload.Date_To
    ) {
      this.showHistory = true;
this .ddlPracticeCode= this.requestPayload.practiceCode
      this.API.PostData(`/Scrubber/GetScrubberReport?PracticeCode=${this.requestPayload.practiceCode}&Date_From=${this.requestPayload.Date_From}&Date_To=${this.requestPayload.Date_To}`, '', (res) => {
        debugger
        if (res.Status === 'Success') {
          // if (this.scrubberrejectionhistory) {
          //   this.chRef.detectChanges();
          //   this.scrubberrejectionhistory.destroy();
          // }
          this.isSearchInitiated=true;
          this.exportdata = res.Response;

          // this.totalChargeAmountSum = 0;
          // this.ScrubberRejectionReport.forEach((rejection: any) => {
          //   this.totalChargeAmountSum += rejection.Chargeamount as number;
          // });
          this.totalClaim = this.exportdata.length;
          this.totalClaim = this.exportdata.reduce((sum: number, rejection: any) => sum + rejection.Claim_Number as number, 0);
          this.totalClaim = new Set(this.exportdata.map((rejection: any) => rejection.Claim_Number)).size;
          
          const uniqueClaimNumbers = new Set<number>();
          this.totalChargeAmountSum = 0;
          this.exportdata.forEach(rejection => {
            const claimNumber = rejection.Claim_Number as number;
            if (!uniqueClaimNumbers.has(claimNumber)) {
              uniqueClaimNumbers.add(claimNumber);
              this.totalChargeAmountSum += rejection.Charge_amount as number;
            }
          });
          // this.chRef.detectChanges();
          // const table: any = $('.scrubberrejectionhistory');
          // this.scrubberrejectionhistory = table.DataTable({

          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["Scrubber report"])
          // });
        } else {
          console.log('my error message');
          this.scrubberrejectionhistory = $(
            '.scrubberrejectionhistory'
          ).DataTable({
            columnDefs: [{ orderable: false, targets: -1 }],
            language: {
              emptyTable: 'No data available',
            },
          });
        }
      }
      );
      this.getpaginatedData();
      if (this.ScrubberRejectionCountDetail) {
        this.ScrubberRejectionCountDetail.destroy();
        this.ScrubberRejectionCountDetail = null;
      }
      this.showHistory = true;
      this.API.PostData(`/Scrubber/GetScrubberRejectionDetail?PracticeCode=${this.requestPayload.practiceCode}&Date_From=${this.requestPayload.Date_From}&Date_To=${this.requestPayload.Date_To}`, '', (res) => {
        if (res.Status === 'Success') {
          this.ScrubberRejectionCount = res.Response;
          if (this.ScrubberRejectionCountDetail) {
            this.chRef.detectChanges();
            this.ScrubberRejectionCountDetail.destroy();
          }
          this.ScrubberRejectionCount = res.Response;
          this.totalChargeAmountSum = 0;
          this.chRef.detectChanges();
          const table: any = $('.ScrubberRejectionCountDetail');
          this.ScrubberRejectionCountDetail = table.DataTable({
            language: {
              emptyTable: "No data available"
            },
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(["Scrubber report"])
          });
        } else {
          swal(res.status, res.Response, 'error');
          this.ScrubberRejectionCountDetail = $(
            '.ScrubberRejectionCountDetail'
          ).DataTable({
            columnDefs: [{ orderable: false, targets: -1 }],
            language: {
              emptyTable: 'No data available',
            },
          });
        }
      }
      );
    }
    else {
      swal("Failed", "Please select  " + (this.requestPayload.practiceCode === '' ? 'Practice' :this.requestPayload.Date_From == '' && this.requestPayload.Date_To == '' ? 'Date' : ''), "error");
    }
  }
getpaginatedData(){
  this.API.PostData(`/Scrubber/GetScrubberReportPagination?PracticeCode=${this.requestPayload.practiceCode}&Date_From=${this.requestPayload.Date_From}&Date_To=${this.requestPayload.Date_To}&page=${this.currentPage}&size=${this.count}`, '', (res) => {
   debugger
      // if (this.scrubberrejectionhistory) {
      //   this.chRef.detectChanges();
      //   this.scrubberrejectionhistory.destroy();
      // }
      this.ScrubberRejectionReport =  res.Response.data;
      this.totalResults = res.Response.TotalRecords;
      this.currentPage = res.Response.CurrentPage;
      this.filteredRecords = res.Response.FilteredRecords;
      this.totalPages = Math.ceil(this.totalResults / this.count);
  
   
  }
  );
}
  getPractices() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      (d) => {
        if (d.Status === 'Sucess') {
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
  onClear() {
    this.showHistory = false;
    this.chRef.detectChanges();
    this.isSearchInitiated=false
this.ddlPracticeCode=0;
    if (this.scrubberrejectionhistory) {
      this.scrubberrejectionhistory.destroy();
      this.scrubberrejectionhistory = null;
    }

    if (this.ScrubberRejectionCountDetailclaimwise) {
      this.ScrubberRejectionCountDetailclaimwise.destroy();
      this.ScrubberRejectionCountDetailclaimwise = null;
    }

    if (this.ScrubberRejectionCountDetail) {
      this.ScrubberRejectionCountDetail.destroy();
      this.ScrubberRejectionCountDetail = null;
    }

    this.ScrubberRejectionReport = [];
    this.ScrubberRejectionCount = [];
    this.ScrubberRejectionCountClaimwise = [];

    setTimeout(() => {
      this.InitForm();
      this.requestPayload = {
        practiceCode: '',
        Date_From: '',
        Date_To: ''
      };
    }, 100);
  }
  onCloseButtonClick(event: Event) {
    event.stopPropagation();
    this.patientAttachments.hide();
  }
  toggleSorting(column: string) {
    if (column === this.sortingColumn) {
      this.sortingDirection = -this.sortingDirection;
    } else {
      this.sortingColumn = column;
      this.sortingDirection = 1;
    }

    this.sortData();
  }
  
  sortData() {
    this.ScrubberRejectionReport.sort((a, b) => {
      const direction = this.sortingDirection;
      const column = this.sortingColumn;

      if (a[column] < b[column]) {
        return -1 * direction;
      } else if (a[column] > b[column]) {
        return 1 * direction;
      } else {
        return 0;
      }
    }); 
  }
  getPages() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getpaginatedData();
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
  countValueChanged(event) {
    const selectedCount = event.target.value;
    this.count = +selectedCount; // Convert the value to a number
    this.currentPage = 1; // Reset to the first page when count changes
    this.getpaginatedData();
  }

  exportExcel() {
    debugger;
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ claim_payments_id,ATTENDING_PHYSICIAN, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['Charge_amount'];
    // Convert modified data to worksheet
    const worksheet = xlsx.utils.json_to_sheet(modifiedData);
    // Format the headers: Remove underscores and apply bold
    const headers = Object.keys(modifiedData[0]).map(header => {
        return header.replace(/_/g, ' ').toUpperCase();  // Remove underscores
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
          } else if (key === 'Account_Number') {
                // Treat PATIENT_ACCOUNT as text to prevent rounding
                worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
                worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
            } else if (key === 'Date_Of_Service'||key === 'Rejection_Date') {
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
            }
           // else if (key === 'Rejection_Date' ) {
              // Format dates as MM/DD/YYYY HH:MM AM/PM, or show empty string if null
              // const dateValue = row[key];
              // if (dateValue) {
              //     const date = new Date(dateValue);
              //     // Format date to MM/DD/YYYY HH:MM AM/PM
              //     const hours = date.getHours();
              //     const minutes = ('0' + date.getMinutes()).slice(-2);
              //     const ampm = hours >= 12 ? 'PM' : 'AM';
              //     const formattedHours = hours % 12 || 12; // Convert 0 to 12
              //     const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()} ${formattedHours}:${minutes} ${ampm}`;
              //     worksheet[cellRef] = { 
              //         v: formattedDate, 
              //         t: 's' // Store as string to avoid date issues
              //     };
              // } else {
              //     worksheet[cellRef] = { v: '', t: 's' };  // Display empty string for null dates
              // }
              // worksheet['!cols'].push({ wch: 20 });  // Set width for date columns
          //}  
          else if (typeof row[key] === 'number') {
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

    this.saveAsExcelFile(excelBuffer, 'Scrubber Rejection Report');
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
}