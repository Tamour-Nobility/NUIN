import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../components/services/api.service';
import { ReportRequestModel } from '../../dynamic-reports/models/report-request.model';
import { Common } from '../../services/common/common';
import { DatatableService } from '../../services/data/datatable.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-claim-submission-report',
  templateUrl: './claim-submission-report.component.html',
  styleUrls: ['./claim-submission-report.component.css']
})
export class ClaimSubmissionReportComponent implements OnInit {
  showFullMessage: { [key: string]: boolean } = {};
  Clear = true;
  prac: any; 
  SearchForm: FormGroup;
  showHistory = false;
  DataTable: any;
  selectedStatus: string = 'All';
  request: ReportRequestModel;
  public myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', 
    height: '25px', 
    width: '115%'
  }
  ClaimSubmissionReport: any[] = [];

  EDIHistory:any;
  ScrubberRejectionCountDetail: any;
  ScrubberRejectionCountDetailclaimwise: any;
  ClaimSubmissionReportTable: any = [];
  ediHistoryTable: any;
  totalChargeAmountSum: number = 0;
  totalClaim: number = 0;
  listPracticesList: any;
  requestPayload: any = {
    practiceCode: '',
    Date_From: '',
    Date_To: '',
    Status:''
  };
  claimStatues:any=[ {status:"Accepted",label:"Accepted"},{status:"Rejected",label:"Rejected"},{status: "PR", label: "Payer" },{status: "AY", label: "Clearing house"},{status:"PayerRejected",label:"PayerRejected"},{status:"PayerAccepted",label:"PayerAccepted"}]
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
  @ViewChild(ClaimSubmissionReportComponent) patientAttachments;
  @ViewChild('patientAttachments') patientAttachmentsModal: any;
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
      Status:''
    });
    this.ClaimSubmissionReport=[];
  }
  ngOnInit() {
    this.getPractices();
    this.InitForm();
    this.prac = { RejectionReason: "Your long rejection reason goes here." };
  }
  toggleFullMessage(attribute: string) {
    this.showFullMessage[attribute] = !this.showFullMessage[attribute];
  }
  onchangePractices() {
    let practiceCode=this.SearchForm.get('PracCode').value
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.requestPayload.practiceCode = practiceCode;
  }
  onchangeStatus(Status: string) {
    this.requestPayload.Status = Status.toString();
  }
  InitForm() {
    this.SearchForm = this.formBuilder.group({
      PracCode: ['', Validators.required],
      DOSRange: [null],
      Status:'All'
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
  fetchEdiHistory(claimNo : any,Status:any,statusLevel:any,File277CA:any) {
    if (this.ediHistoryTable) {
      this.ediHistoryTable.destroy();
      this.ediHistoryTable = null;
    }
    this.API.getData(`/Scrubber/GetEdiHistory?ClaimNo=${claimNo}&Status=${Status}&statusLevel=${statusLevel}&File277CA=${File277CA}`).subscribe(
      (res) => {
        if (res.Status == 'Success') {
          this.EDIHistory = res.obj;
          this.chRef.detectChanges();
          const table: any = $('.ediHistoryTable');          
          this.ediHistoryTable = table.DataTable({
            language: {
              emptyTable: "No data available"
            },
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(["Claim Submission Report"])
          });
          this.patientAttachmentsModal.show();
        } 
        else {
          console.log('Error fetching EDI history');
          swal('Failed', 'Error fetching EDI history', 'error');
        }
      }
    );
  }
  onSearch() {
    this.isSearchInitiated=true;
    // if (this.ClaimSubmissionReport) {
    //   this.ClaimSubmissionReport.destroy();
    //   this.ClaimSubmissionReport = null;
    // }
    let practiceCode=this.SearchForm.get('PracCode').value
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
     console.log("requestPayload",this.requestPayload);
    if (
      practiceCode &&
      this.requestPayload.Date_From &&
      this.requestPayload.Date_To &&
      this.selectedStatus

    ) {
      this.showHistory = true;
     this.ddlPracticeCode=  practiceCode
      this.API.PostData(`/Scrubber/GetClaimSubmissionReport?PracticeCode=${practiceCode}&Date_From=${this.requestPayload.Date_From}&Date_To=${this.requestPayload.Date_To}&Status=${this.selectedStatus}`, '', (res) => {
        if (res.Status === 'Success') {
          // if (this.ClaimSubmissionReport) {    
          //   this.chRef.detectChanges();
          //   this.ClaimSubmissionReport.destroy();
          // }
          this.exportdata = res.Response;
          // this.chRef.detectChanges();
          // const table: any = $('.ClaimSubmissionReport');
          // this.ClaimSubmissionReport = table.DataTable({
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["Claim Submission Report"])
          // });
        } else {
          console.log('Error fetching Claim Submission Report');
          // this.ClaimSubmissionReport = $(
          //   '.ClaimSubmissionReport'
          // ).DataTable({
          //   columnDefs: [{ orderable: false, targets: -1 }],
          //   language: {
          //     emptyTable: 'No data available',
          //   },
          // });
        }
      });
      this.getpaginatedData();
    }
    else {
      swal('Failed', 'Please insert data', 'error');
    }
  }
  getpaginatedData(){
    let practiceCode=this.SearchForm.get('PracCode').value
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.PostData(`/Scrubber/GetClaimSubmissionReportPagiantion?PracticeCode=${practiceCode}&Date_From=${this.requestPayload.Date_From}&Date_To=${this.requestPayload.Date_To}&Status=${this.selectedStatus}&page=${this.currentPage}&size=${this.count}`, '', (res) => {
      if (res.Status === 'Success') {
        // if (this.ClaimSubmissionReport) {    
        //   this.chRef.detectChanges();
        //   this.ClaimSubmissionReport.destroy();
        // }
        this.ClaimSubmissionReport =  res.Response.data;
        this.totalResults = res.Response.TotalRecords;
        this.currentPage = res.Response.CurrentPage;
        this.filteredRecords = res.Response.FilteredRecords;
        this.totalPages = Math.ceil(this.totalResults / this.count);
        console.log("Data",this.ClaimSubmissionReport)
        // this.chRef.detectChanges();
        // const table: any = $('.ClaimSubmissionReport');
        // this.ClaimSubmissionReport = table.DataTable({
        //   language: {
        //     emptyTable: "No data available"
        //   },
        //   dom: this.datatableService.getDom(),
        //   buttons: this.datatableService.getExportButtons(["Claim Submission Report"])
        // });
      } else {
        console.log('Error fetching Claim Submission Report');
        // this.ClaimSubmissionReport = $(
        //   '.ClaimSubmissionReport'
        // ).DataTable({
        //   columnDefs: [{ orderable: false, targets: -1 }],
        //   language: {
        //     emptyTable: 'No data available',
        //   },
        // });
      }
    });
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
    this.selectedStatus="All"
    this.showHistory = false;
    this.chRef.detectChanges();
    this.isSearchInitiated=false;
    this.ddlPracticeCode=0;
    this.ClaimSubmissionReport=[];
    this.SearchForm.reset();
    // if (this.ClaimSubmissionReport) {
    //   this.ClaimSubmissionReport.destroy();
    //   this.ClaimSubmissionReport = null;
    // }
    if (this.ediHistoryTable) {
      this.ediHistoryTable.destroy();
      this.ediHistoryTable = null;
    }
    if (this.ediHistoryTable) {
      this.ediHistoryTable.destroy();
      this.ediHistoryTable = null;
    }
    this.ClaimSubmissionReportTable = [];
    this.ediHistoryTable = [];
    setTimeout(() => {
      this.InitForm();
      this.requestPayload = {
        Status:"All",
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
    this.ClaimSubmissionReport.sort((a, b) => {
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
          } else if (key === 'Account_No') {
                // Treat PATIENT_ACCOUNT as text to prevent rounding
                worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
                worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
            } else if (key === 'DOS' || key === 'Status_Date'|| key === 'Submission_Date') {
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

    this.saveAsExcelFile(excelBuffer, 'Claim Submission Report');
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



