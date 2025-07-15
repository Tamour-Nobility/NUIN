import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../components/services/api.service'
import { IMyDpOptions } from 'mydatepicker';
import { Common } from '../../services/common/common';
import * as moment from 'moment';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-negative-balance-report',
  templateUrl: './negative-balance-report.component.html',
  styleUrls: ['./negative-balance-report.component.css']
})
export class NegativeBalanceReportComponent implements OnInit {
  NBPForm: FormGroup;
  listPracticesList: any[];
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
};
negativeBalanceReport: any[] = [];
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
isSearchInitiated:boolean;
filteredRecords: any;
exportdata:any;
dateRange:any
  constructor(public API: APIService,
    private chRef: ChangeDetectorRef,
    public toaster: ToastrService,

    private route: ActivatedRoute,) { 
      this.negativeBalanceReport=[]
    }

  ngOnInit() {
    this.InitializeForm();
    this.getPractices();
  }
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.NBPForm.get('dateFrom').setValue(Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY'));
    this.NBPForm.get('dateTo').setValue(Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY'));
}
InitializeForm(): any {
  this.NBPForm = new FormGroup({

      responsible:new FormControl('ALL',Validators.required),
      dateCriteria:new FormControl(null,Validators.required),
      practiceCode: new FormControl(null,Validators.required),
      dateFrom:new FormControl(null,Validators.required),
      dateTo:new FormControl(null,Validators.required),
      dateRange: new FormControl(null),
  });
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
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onsubmit(){

    debugger
    if(this.NBPForm.valid){
      this.ddlPracticeCode=this.NBPForm.value.practiceCode,
      this.getNegativeBalanceReportPagination();
      this.getNegativeBalanceReport();
    }
  }
  getNegativeBalanceReport() {
    debugger
    let practiceCode=this.NBPForm.value.practiceCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    if(this.NBPForm.valid){
      var request={
        practiceCode:this.NBPForm.value.practiceCode,
        responsibleParty:this.NBPForm.value.responsible,
        dateCriteria:this.NBPForm.value.dateCriteria,
        dateFrom:this.NBPForm.value.dateFrom,
        dateTo:this.NBPForm.value.dateTo
       }
       
    this.API.getData(`/Report/GetNegativeBalanceReport?practiceCode=${practiceCode}&responsibleParty=${request.responsibleParty}&dateCriteria=${request.dateCriteria}&dateFrom=${request.dateFrom}&dateTo=${request.dateTo}&isExport=true&pageSize=${this.count}&PageNo=${this.currentPage}`).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
       
          this.exportdata = data.Response;
    console.log("Data",this.exportdata)
          // this.chRef.detectChanges();
          // const table: any = $('.dtuserReportdetials');
          // this.dtuserreportdetials = table.DataTable({
         
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["CPT Wise Charges Detail Report"])
          // })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  else{
  return
  }
}

  getNegativeBalanceReportPagination() {
    debugger;
    let practiceCode=this.NBPForm.value.practiceCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    if(this.NBPForm.valid){
    var request={
      practiceCode:this.NBPForm.value.practiceCode,
      responsibleParty:this.NBPForm.value.responsible,
      dateCriteria:this.NBPForm.value.dateCriteria,
      dateFrom:this.NBPForm.value.dateFrom,
      dateTo:this.NBPForm.value.dateTo
     }
    this.API.getData(`/Report/GetNegativeBalanceReport?practiceCode=${practiceCode}&responsibleParty=${request.responsibleParty}&dateCriteria=${request.dateCriteria}&dateFrom=${request.dateFrom}&dateTo=${request.dateTo}&isExport=false&pageSize=${this.count}&PageNo=${this.currentPage}`).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
          this.negativeBalanceReport =  data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
    console.log("Data",this.negativeBalanceReport)
          // this.chRef.detectChanges();
          // const table: any = $('.dtuserReportdetials');
          // this.dtuserreportdetials = table.DataTable({
         
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["CPT Wise Charges Detail Report"])
          // })
        }
        else {
          
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  else{
    return
  }
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
    this.negativeBalanceReport.sort((a, b) => {
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
    
       
      this.getNegativeBalanceReportPagination();
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
    this.getNegativeBalanceReportPagination();
  }
  exportExcel() {
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ useridbycreated,useridbymodified,Modified_ByN,CreatedDate,ModifiedDate, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['Claim_Total','Amount_Paid','Adjustment','Amount_Due','Primary_Ins_Payment','Secondary_Ins_Payment','Other_Ins_Payment','Patient_Payment','Patient_Credit_Balance','Insurance_Overpaid'];
    // Convert modified data to worksheet
    const worksheet = xlsx.utils.json_to_sheet(modifiedData);
    // Format the headers: Remove underscores and apply bold
    const headers = Object.keys(modifiedData[0]).map(header => {
        return header.replace(/_/g, ' ').toLocaleUpperCase();  // Remove underscores
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
          } else if (key === 'Patient_Account') {
                // Treat PATIENT_ACCOUNT as text to prevent rounding
                worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
                worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
            } else if (key === 'DOS' || key === 'Bill_Date'||key==='Moved_Date') {
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

    this.saveAsExcelFile(excelBuffer, 'Negative Balance Report');
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
  // if (this.dtuserreportdetials) {
  //   this.dtuserreportdetials.destroy();
  // }
  this.NBPForm.reset();
  this.dateRange = { beginDate: null, endDate: null };
  this.negativeBalanceReport = [];
}
}
