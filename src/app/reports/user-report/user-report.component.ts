import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatatableService } from '../../services/data/datatable.service';
import { APIService } from '../../components/services/api.service'
import { IMyDrpOptions } from 'mydaterangepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {

  CPDForm: FormGroup;
  isSearchInitiated: boolean;
  dtuserreportdetials: any;
  usersDetailReport: any;
  listUserList:any;  
  listPracticesList: any;
  DateF:any =null
  DateT:any=null
  public placeholder: string = 'MM/DD/YYYY';
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
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
  constructor(public toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public datatableService: DatatableService,
    private API: APIService) { 
      this.usersDetailReport=[];
    }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
  }

  InitForm() {
    this.CPDForm = new FormGroup({
      PracCode: new FormControl('', [
        Validators.required,
      ]),
      userid: new FormControl('', [
        Validators.required,
      ]),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null)
    
    
    })
  }
  get f() {
    return this.CPDForm.controls;
  }
  
  onDateChanged(e, dType: string) {
    debugger
    if (dType == 'From') {
      this.DateF=e.formatted
    }
    else {
      this.DateT=e.formatted;
    }
  }
onsearch(){
  this.currentPage=1;
  this.count=10;
  this.ddlPracticeCode=this.CPDForm.value.PracCode;
  this.getUserReportDetail();
  this.getUserReportDetailPagination();
}
  getUserReportDetail() {
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData('/Report/GetUserReport?PracCode=' + practiceCode + '&userid=' + this.CPDForm.value.userid + '&DateFrom=' + this.DateF + '&DateTo=' + this.DateT).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
       
          this.exportdata = data.Response;
    console.log("Data",this.usersDetailReport)
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
          this.f.userid.setValue(0);
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  getUserReportDetailPagination() {
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData('/Report/GetUserReportPagination?PracCode=' + practiceCode + '&userid=' + this.CPDForm.value.userid + '&DateFrom=' + this.DateF + '&DateTo=' + this.DateT+'&page='+this.currentPage+'&size='+this.count).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
          this.usersDetailReport =  data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
    console.log("Data",this.usersDetailReport)
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
          this.f.userid.setValue(0);
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
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
          this.f.userid.setValue(0);

        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  getUserList(){
    debugger
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData('/Setup/GetuserList?pracCode=' + practiceCode).subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listUserList = d.Response;
     
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    this.ddlPracticeCode=0;
    // if (this.dtuserreportdetials) {
    //   this.dtuserreportdetials.destroy();
    // }
    this.CPDForm.reset();
    this.usersDetailReport = [];
  }
  onchangePractice() {
    
    if (this.CPDForm.value.PracCode == undefined || this.CPDForm.value.PracCode == null || this.CPDForm.value.PracCode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }else {
    
     
      this.onsearch();
    }
    
  }
  onchangeuser(){
   
    this.f.userid.setValue(0);
    this.getUserList();
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
    this.usersDetailReport.sort((a, b) => {
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
      this.getUserReportDetailPagination();
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
    this.getUserReportDetailPagination();
  }

  exportExcel() {
    debugger;
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ useridbycreated,useridbymodified,Modified_ByN,CreatedDate,ModifiedDate, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['BILLED_CHARGE'];
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
            } else if (key === 'DOS' || key === 'Entry_Date') {
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

    this.saveAsExcelFile(excelBuffer, 'CPT Wise Charges Detail Report');
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
