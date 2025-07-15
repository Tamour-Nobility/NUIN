import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../../components/services/api.service';
import { DatatableService } from '../../../services/data/datatable.service';
import { CtpWisePaymentDetailReport } from '../../classes/ctp-wise-payment-detail-report';
import { ActivatedRoute } from '@angular/router';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-ctp-wise-payment-details',
  templateUrl: './ctp-wise-payment-details.component.html',
  styleUrls: ['./ctp-wise-payment-details.component.css']
})
export class CtpWisePaymentDetailsComponent implements OnInit {
  PDForm: FormGroup;
  listPracticesList: any[];
  cptWisePaymentDetailList: CtpWisePaymentDetailReport[];
  dtCptWisePaymentDetail: any;
  PracticeCode:String | number;
  ddlPracticeCode:String | number = 0;
  strFromDate: string;
  strToDate: string;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  public placeholder: string = 'MM/DD/YYYY';
  Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  isSearchInitiated: boolean = false;
  isRouted: boolean = false;
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
  constructor(
    public API: APIService,
    private chRef: ChangeDetectorRef,
    public toaster: ToastrService,
    public datatableService: DatatableService,
    private route: ActivatedRoute,
  ) {
    this.cptWisePaymentDetailList = [];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        //this.getPatientAgingReport(qs['PracticeCode']);
      }
    })
    this.InitForm();
    this.getPractices();
    // this.getPaymentDetailReport();
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

  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.strFromDate = e.formatted;
    }
    else {
      this.strToDate = e.formatted;
    }
  }
onsearch(){
  this.ddlPracticeCode=this.PracticeCode
  this.getCptWisePaymentDetailReportExport();
  this.getCptWisePaymentDetailReport();
}
  getCptWisePaymentDetailReportExport() {
    let practiceCode=this.PracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData('/Report/CPTWisePaymentDetail?PracticeCode=' + practiceCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
      data => {
        if (data.Status == 'Success') {
          this.isSearchInitiated = true;
          // if (this.dtCptWisePaymentDetail) {
          //   this.chRef.detectChanges();
          //   this.dtCptWisePaymentDetail.destroy();
          // }
          this.exportdata = data.Response;
          console.log("Data",this.cptWisePaymentDetailList)
          // this.chRef.detectChanges();
          // const table: any = $('.dtCptWisePaymentDetail');
          // this.dtCptWisePaymentDetail = table.DataTable({
          //   columnDefs: [
          //     {
          //       type: 'date', targets: [3, 7, 13]
          //     },
          //     {
          //       width: '14.5em', targets: [1]
          //     },
          //     {
          //       width: '10em', targets: [9, 10]
          //     },
          //     {
          //       width: '8.5em', targets: [0, 4, 5, 6, 8, 11, 12, 13, 14]
          //     },
          //     {
          //       width: '7.5em', targets: [2, 3, 7]
          //     }
          //   ],
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   paging: true,
          //   scrollX: true,
          //   scrollY: '290',
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["CPT Wise Payment Details"])
          // })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  getCptWisePaymentDetailReport() {
     let practiceCode=this.PracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
   //this.ddlPracticeCode- practiceCode
    this.API.getData('/Report/CPTWisePaymentDetailPagination?PracticeCode=' +practiceCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate +'&page='+this.currentPage + '&count='+ this.count).subscribe(
      data => {
        if (data.Status == 'Success') {
          this.isSearchInitiated = true;
          // if (this.dtCptWisePaymentDetail) {
          //   this.chRef.detectChanges();
          //   this.dtCptWisePaymentDetail.destroy();
          // }
          this.cptWisePaymentDetailList =  data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
          console.log("Data",data.Response.data)
          // this.chRef.detectChanges();
          // const table: any = $('.dtCptWisePaymentDetail');
          // this.dtCptWisePaymentDetail = table.DataTable({
          //   columnDefs: [
          //     {
          //       type: 'date', targets: [3, 7, 13]
          //     },
          //     {
          //       width: '14.5em', targets: [1]
          //     },
          //     {
          //       width: '10em', targets: [9, 10]
          //     },
          //     {
          //       width: '8.5em', targets: [0, 4, 5, 6, 8, 11, 12, 13, 14]
          //     },
          //     {
          //       width: '7.5em', targets: [2, 3, 7]
          //     }
          //   ],
          //   language: {
          //     emptyTable: "No data available"
          //   },
          //   paging: true,
          //   scrollX: true,
          //   scrollY: '290',
          //   dom: this.datatableService.getDom(),
          //   buttons: this.datatableService.getExportButtons(["CPT Wise Payment Details"])
          // })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    this.ddlPracticeCode=0;
    // if (this.dtCptWisePaymentDetail) {
    //   this.dtCptWisePaymentDetail.destroy();
    // }
    this.PDForm.reset();
    this.cptWisePaymentDetailList = [];
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
    this.cptWisePaymentDetailList.sort((a, b) => {
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
      this.getCptWisePaymentDetailReport();
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
    this.getCptWisePaymentDetailReport();
  }

  exportExcel() {
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ claim_payments_id,ATTENDING_PHYSICIAN, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['AMOUNT_PAID', 'AMOUNT_ADJUSTED', 'AMOUNT_REJECTED'];
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

    this.saveAsExcelFile(excelBuffer, 'CPT Wise Payment Detail Report');
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
