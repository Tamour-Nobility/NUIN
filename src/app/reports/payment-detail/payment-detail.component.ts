import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { DatatableService } from '../../services/data/datatable.service';
import { APIService } from '../../components/services/api.service';
import { PaymentDetailReport } from '../classes/payment-detail-report-model';
import { ActivatedRoute } from '@angular/router';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
@Component({
    selector: 'app-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['../reports.css']
})

export class PaymentDetail implements OnInit {
    PDForm: FormGroup;
    listPracticesList: any[];
    paymentDetailList: PaymentDetailReport[];
    dtPaymentDetail: any;
    PracticeCode:String| number;
    ddlPracticeCode: String | number = 0;
    strFromDate: string;
    strToDate: string;
    patientAccount: string;
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
        private route: ActivatedRoute
    ) {
        this.paymentDetailList = [];
    }

    ngOnInit() {
        this.InitForm();
        this.getPractices();
        this.route.queryParams.subscribe(pqs => {
            if (pqs && pqs['PracticeCode'] && pqs['DateFrom'] && pqs['DateTo']) {
                this.isRouted = true;
                this.ddlPracticeCode = pqs['PracticeCode'];
                this.strFromDate = pqs['DateFrom'];
                this.strToDate = pqs['DateTo'];
                let date = new Date();
                this.PDForm.setValue({
                    practice: pqs['DateFrom'],
                    dateFrom: {
                        year: date.getFullYear(),
                        month: date.getMonth() - 5,
                        day: date.getDate()
                    },
                    dateTo: {
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getDate()
                    },
                    patAccount: ''
                });
                this.getPaymentDetailReport();
                this.getPaymentDetailReportPagination();
            }
        })
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
            patAccount: new FormControl(),
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
        this.getPaymentDetailReport();
        this.getPaymentDetailReportPagination();
      }
    getPaymentDetailReport() {
        let practiceCode=this.PracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.API.getData('/Report/PaymentDetail?PracticeCode=' + practiceCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate + '&PatientAccount=' + this.patientAccount).subscribe(
            data => {
                if (data.Status == 'Success') {
                    this.isSearchInitiated = true;
                    if (this.dtPaymentDetail) {
                        this.chRef.detectChanges();
                        this.dtPaymentDetail.destroy();
                    }
                    this.exportdata = data.Response;
                    // this.chRef.detectChanges();
                    // const table: any = $('.dtPaymentDetail');
                    // this.dtPaymentDetail = table.DataTable({
                    //     columnDefs: [
                    //         {
                    //             type: 'date', targets: [3, 7, 13]
                    //         },
                    //         {
                    //             width: '14.5em', targets: [1]
                    //         },
                    //         {
                    //             width: '10em', targets: [9, 10]
                    //         },
                    //         {
                    //             width: '8.5em', targets: [0, 4, 5, 6, 8, 11, 12, 13, 14]
                    //         },
                    //         {
                    //             width: '7.5em', targets: [2, 3, 7]
                    //         }
                    //     ],
                    //     language: {
                    //         emptyTable: "No data available"
                    //     },
                    //     paging: true,
                    //     scrollX: true,
                    //     dom: this.datatableService.getDom(),
                    //     buttons: this.datatableService.getExportButtons(["Payment Details"])
                    // })
                }
                else {
                    this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
                }
            }
        )
    }
    getPaymentDetailReportPagination() {
        let practiceCode=this.PracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.API.getData('/Report/PaymentDetailPagination?PracticeCode=' + practiceCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate + '&PatientAccount=' + this.patientAccount + '&page='+this.currentPage+'&size='+this.count).subscribe(
            data => {
                if (data.Status == 'Success') {
                    this.isSearchInitiated = true;
                    if (this.dtPaymentDetail) {
                        this.chRef.detectChanges();
                        this.dtPaymentDetail.destroy();
                    }
                    this.paymentDetailList =  data.Response.data;
                    this.totalResults = data.Response.TotalRecords;
                    this.currentPage = data.Response.CurrentPage;
                    this.filteredRecords = data.Response.FilteredRecords;
                    this.totalPages = Math.ceil(this.totalResults / this.count);
                    // this.chRef.detectChanges();
                    // const table: any = $('.dtPaymentDetail');
                    // this.dtPaymentDetail = table.DataTable({
                    //     columnDefs: [
                    //         {
                    //             type: 'date', targets: [3, 7, 13]
                    //         },
                    //         {
                    //             width: '14.5em', targets: [1]
                    //         },
                    //         {
                    //             width: '10em', targets: [9, 10]
                    //         },
                    //         {
                    //             width: '8.5em', targets: [0, 4, 5, 6, 8, 11, 12, 13, 14]
                    //         },
                    //         {
                    //             width: '7.5em', targets: [2, 3, 7]
                    //         }
                    //     ],
                    //     language: {
                    //         emptyTable: "No data available"
                    //     },
                    //     paging: true,
                    //     scrollX: true,
                    //     dom: this.datatableService.getDom(),
                    //     buttons: this.datatableService.getExportButtons(["Payment Details"])
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
        // if (this.dtPaymentDetail) {
        //     this.dtPaymentDetail.destroy();
        // }
        this.PDForm.reset();
        this.paymentDetailList = [];
    }

    keyPressNumbers(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        // Only Numbers 0-9
        if ((charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        } else {
            return true;
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
        this.paymentDetailList.sort((a, b) => {
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
          this.getPaymentDetailReportPagination();
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
        this.getPaymentDetailReportPagination();
      }
    
      exportExcel() {
        debugger;
    
        // Remove PATIENT_DOBDAY from data and rename headers
        const modifiedData = this.exportdata.map(({ claim_payments_id, attending_physician, ...rest }) => {
            return rest;
        });
        const currencyKeys = ['Amount_Paid', 'amount_adjusted', 'Amount_rejected'];
    
        // Convert modified data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(modifiedData);
    
        // Format the headers: Remove underscores and apply bold
        const headers = Object.keys(modifiedData[0]).map(header => {
            return header
                .replace(/_/g, ' ')            // Remove underscores
                .toUpperCase();                // Capitalize the whole word
        });
    debugger
        // Update the worksheet headers and apply bold style
        headers.forEach((header, index) => {
            const cellRef = xlsx.utils.encode_cell({ c: index, r: 0 });
            if (!worksheet[cellRef]) {
                worksheet[cellRef] = { v: header }; // Ensure the cell exists
            }
            debugger
            worksheet[cellRef].v = header;  // Set the header value
            worksheet[cellRef].t = 's';     // Set the type as string
            worksheet[cellRef].s = {        // Apply bold style to the font
                font: { bold: true } 
            };  
        });
    console.log('Header',headers)
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
                } else if (key === 'patient_account' || key === 'Cheque_No') {
                    // Use nullish coalescing operator to safely handle null or undefined values
                    const value = row[key] != null ? row[key] : '';  // If row[key] is null or undefined, use an empty string
                    worksheet[cellRef] = { v: value.toString(), t: 's' }; 
                    worksheet['!cols'].push({ wch: value.toString().length + 2 });}
                 else if (key === 'dos' || key === 'date_entry' || key === 'Cheque_Date') {
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
            cellStyles: true,  // Enable cell styles to ensure bold headers
        });
    
        // Save the Excel file
        this.saveAsExcelFile(excelBuffer, 'Payment Detail Report');
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