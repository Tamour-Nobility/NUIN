import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { ReportforAccountasssignee} from '../../Claims/Classes/ClaimAssignee';

import { Aging_Summary_Analysis_Report_Result, PracticesList } from '../classes/aging-summary-report-model'
import { APIService } from '../../components/services/api.service';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';
import { GvarsService } from '../../services/G_vars/gvars.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-account-assignmentreport',
  templateUrl: './account-assignmentreport.component.html',
 
})
export class AccountAssignmentreportComponent implements OnInit {

  listPracticesList: PracticesList[];
  isRouted: boolean = false;
  AccountAssigneeReports :any;
  PracticeCode: string | number = 0;
  AccountAssigneeReportDetail: any;
  dataTable: any;
  PDForm: FormGroup;
  strFromDate: string;
  strToDate: string;
  isSearchInitiated: boolean = false;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  ddlPracticeCode: string | number = 0;
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
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute,
    public toaster: ToastrService,
    private Gv: GvarsService) { 

      this.AccountAssigneeReports = [];
    }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
  }
  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      dateFrom: new FormControl('', [
        Validators.required,
      ]),
      dateTo: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.strFromDate = e.formatted;
    }
    else {
      this.strToDate = e.formatted;
    }
  }
 

  getAccountAssignmentReport() {
    let practiceCode=this.PracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
      
this.ddlPracticeCode=practiceCode;
    this.API.getData('/Report/AccounAssignmentReport?practiceCode=' +
      practiceCode+ '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
     data => {
       if (data.Status == 'Success') {
        this.isSearchInitiated=true;
        // console.log("mydata" + data.Response)
      
        // if (this.AccountAssigneeReportDetail) {
        //   this.chRef.detectChanges();
        //   this.AccountAssigneeReportDetail.destroy();
        // }
        this.exportdata = data.Response;
      


        


        
        // this.chRef.detectChanges();
        // const table: any = $('.AccountAssigneReportDetail');
        // this.AccountAssigneeReportDetail = table.DataTable({
        //   width: '100%',
        //   columnDefs: [
        //     {
        //       type: 'date', targets: [5]
        //     },
        //     {
        //       width: '15%', targets: [1]
        //     },
        //     {
        //       width: '15%', targets: [0, 2, 5]
        //     }
    
        //   ],
        //   language: {
        //     emptyTable: "No data available"
        //   },
        //   autoWidth: false,
        //   paging: true,
        //   scrollX: true,
        //   scrollY: '290',
        //   dom: this.datatableService.getDom(),
        //   buttons: this.datatableService.getExportButtons(["Account Assignment Report"])
        // })


        

       }
      
     }
   )
 }
 getAccountAssignmentReportPagination() {
  let practiceCode=this.PracticeCode
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
      
  this.ddlPracticeCode=practiceCode;
      this.API.getData('/Report/AccounAssignmentReportPagination?practiceCode=' +
        practiceCode+ '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate +'&page='+this.currentPage+'&size='+this.count).subscribe(
       data => {
         if (data.Status == 'Success') {
          this.isSearchInitiated=true;
          //console.log("mydata" + data.Response)
        
          // if (this.AccountAssigneeReportDetail) {
          //   this.chRef.detectChanges();
          //   this.AccountAssigneeReportDetail.destroy();
          // }
          this.AccountAssigneeReports =  data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
  
  
          
  
  
          
          // this.chRef.detectChanges();
          // const table: any = $('.AccountAssigneReportDetail');
          // this.AccountAssigneeReportDetail = table.DataTable({
          //   width: '100%',
          //   columnDefs: [
          //     {
          //       type: 'date', targets: [5]
          //     },
          //     {
          //       width: '15%', targets: [1]
          //     },
          //     {
          //       width: '15%', targets: [0, 2, 5]
          //     }
      
          //   ],
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   autoWidth: false,
          //   paging: true,
          //   scrollX: true,
          //   scrollY: '290',
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["Account Assignment Report"])
          // })
  
  
          
  
         }
        
       }
     )
   }

 onchangePractice() {
  if (this.PracticeCode == undefined || this.PracticeCode == null || this.PracticeCode == 0)
    return;

 // this.getAccountAssignmentReport();
  
}
onsearch(){
  this.getAccountAssignmentReport();
  this.getAccountAssignmentReportPagination();
}

  getPractices() {

    this.API.getData('/Setup/GetPracticeList').subscribe(
      
      d => {
          
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
          console.log(this.listPracticesList)
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
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
    this.AccountAssigneeReports.sort((a, b) => {
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
      this.getAccountAssignmentReportPagination();
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
    this.getAccountAssignmentReportPagination();
  }

  exportExcel() {

    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ Account_AssigneeID,AssignedToUserId,AssignedToUserName,
      AssignedByUserId,AssignedByUserName,PracticeCode,Deleted,CreatedBy,ModifiedBy,ModifiedDate,ModificationAllowed, ...rest }) => {
        return rest;
    });
    const currencyKeys = [];
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
            } else if (key === 'Task_Created_Date' || key === 'Start_Date'|| key === 'Due_Date') {
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

    this.saveAsExcelFile(excelBuffer, 'Account Assignment Report');
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
  this.ddlPracticeCode=0;
  // if (this.dtInsuranceDetail) {
  //   this.dtInsuranceDetail.destroy();
  // }
  this.PDForm.reset();
  this.AccountAssigneeReports = [];
}
}