import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../../components/services/api.service'
import { DatatableService } from '../../../services/data/datatable.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-insurance-detail-report',
  templateUrl: './insurance-detail-report.component.html',
  styleUrls: ['./insurance-detail-report.component.css']
})
export class InsuranceDetailReportComponent implements OnInit {
  listPracticesList: any[];
  isSearchInitiated: boolean = false;
  insuranceDetailReport:any[]
  dtInsuranceDetail: any;
  CPDForm: FormGroup;
  strFromDate: string;
  strToDate: string;
  Checkpraccode:any;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  public placeholder: string = 'MM/DD/YYYY';
  ddlPracticeCode: number = 0;
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
  Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  constructor(private API: APIService,
    public toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public datatableService: DatatableService) { 
      this.insuranceDetailReport=[]
    }

  ngOnInit() {
    this.route.queryParams.subscribe(qs => {
      debugger
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        //this.getPatientAgingReport(qs['PracticeCode']);
      }
    })
    this.InitForm();
    this.getPractices();
  }
  InitForm() {
    this.CPDForm = new FormGroup({
      PracCode: new FormControl('', [
        Validators.required,
      ])
    
    })
  }
  get f() {
    return this.CPDForm.controls;
  }
  
  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.f.dateFrom.setValue(e.formatted);
    }
    else {
      this.f.dateTo.setValue(e.formatted);
    }
  }
onserach(){
  this.getInsuranceReportDetail();
  this.getInsuranceReportDetailPagination();
}
  getInsuranceReportDetail() {
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.ddlPracticeCode=practiceCode
    this.API.getData('/Report/GetInsuranceDetailReport?PracCode=' + practiceCode  ).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
          // if (this.dtInsuranceDetail) {
          //   this.chRef.detectChanges();
          //   this.dtInsuranceDetail.destroy();
          // }
          this.exportdata = data.Response;
          // this.chRef.detectChanges();
          // const table: any = $('.dtInsuranceDetail');
          // this.dtInsuranceDetail = table.DataTable({
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
          //   buttons: this.datatableService.getExportButtons(["Insurance Aging Analysis"])
          // })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  getInsuranceReportDetailPagination() {
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.ddlPracticeCode=practiceCode
    this.API.getData('/Report/GetInsuranceDetailReportPagination?PracCode=' + practiceCode  +'&page='+this.currentPage+'&size='+this.count).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
          // if (this.dtInsuranceDetail) {
          //   this.chRef.detectChanges();
          //   this.dtInsuranceDetail.destroy();
          // }
          this.insuranceDetailReport =  data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
          // this.chRef.detectChanges();
          // const table: any = $('.dtInsuranceDetail');
          // this.dtInsuranceDetail = table.DataTable({
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
          //   buttons: this.datatableService.getExportButtons(["Insurance Aging Analysis"])
          // })
        }
        else {
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
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    // if (this.dtInsuranceDetail) {
    //   this.dtInsuranceDetail.destroy();
    // }
    this.CPDForm.reset();
    this.insuranceDetailReport = [];
  }
  onchangePractice(selectedPracticeCode?: any) {
    debugger
    if(selectedPracticeCode!=0)
      {
        let practiceCode=selectedPracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.Checkpraccode=practiceCode
      }

    if (this.Checkpraccode == undefined || this.Checkpraccode == null || this.Checkpraccode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }
    this. onserach();
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
    this.insuranceDetailReport.sort((a, b) => {
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
      this.getInsuranceReportDetailPagination();
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
    this.getInsuranceReportDetailPagination();
  }

  exportExcel() {
    debugger;
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ claim_payments_id,ATTENDING_PHYSICIAN, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['CLAIM_TOTAL', 'Amount_Paid', 'Amount_Adjusted','Amount_Due'];
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
          } else if (key === 'PATIENT_ACCOUNT') {
                // Treat PATIENT_ACCOUNT as text to prevent rounding
                worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
                worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
            } else if (key === 'DATE_OF_BIRTH' || key === 'CLAIM_ENTRY_DATE'|| key === 'DOS') {
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

    this.saveAsExcelFile(excelBuffer, 'Insurance Aging Report');
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
