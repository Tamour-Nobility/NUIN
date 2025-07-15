import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PatientAgingReport } from '../classes/patient-aging-report';
import { PracticesList } from '../classes/aging-summary-report-model';
import { APIService } from '../../components/services/api.service';
import { DatatableService } from '../../services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';

import { PatientAgingAnalysisReport } from '../classes/patient-aging-analysis-report';
import { CurrentUserViewModel } from '../../../app/models/auth/auth';
@Component({
  selector: 'app-patient-aging-analysis',
  templateUrl: './patient-aging-analysis.component.html',
  styleUrls: ['./patient-aging-analysis.component.css']
})
export class PatientAgingAnalysisComponent implements OnInit {
  count = 10;
  searchTerm: string;
filteredData: any[];
fullData: any[];
searchText: string;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  dataTable: any;
  filteredRecords: any;
  ddlPracticeCode: String|number = 0;
  isRouted: boolean = false;
  patientAgingReportList: PatientAgingAnalysisReport[];
  patientAgingReporListExportExcel: PatientAgingAnalysisReport[];
  listPracticesList: PracticesList[];
    sortingColumn: string = '';
  sortingDirection: number = 1;
  Checkpraccode:any;
  loggedInUser: CurrentUserViewModel;
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    //this.listPracticesList = [];
    this.patientAgingReportList = [];
    this.ddlPracticeCode = 0;
  }

  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      debugger
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getPatientAgingReport(qs['PracticeCode']);
      }
    })
  }

  
  getPatientAgingReport(Practice_Code: any, page = 1) {
    let practiceCode=Practice_Code
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.Checkpraccode=practiceCode
    this.API.getDataUser(`/Report/PatientAgingAnalysisReport?PracticeCode=${practiceCode}&isExport=${false}&page=${page}&size=${this.count}`)
   // this.API.getData(`/Report/PatientAgingReport?PracticeCode=${Practice_Code}&page=${page}&size=${this.count}`)
      .subscribe(data => {
        this.spinner.hide();
        if (data.Status === "success") {
          debugger
          this.patientAgingReportList = data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
        }
           // After fetching the data, call exportExcel to export it to Excel
          //  this.exportExcel();
      });

  }


  getPatientAgingReportExport(Practice_Code: any){
    debugger
    this.API.getDataUser(`/Report/PatientAgingAnalysisReport?PracticeCode=${Practice_Code}&isExport=${true}`)
    .subscribe(data => {
      if (data.Status === "success") {
      this.patientAgingReporListExportExcel=data.Response;
   } })
  }
 
  // am commenting this
//   exportExcel() {
//     debugger
//     // Convert patient data to worksheet
//     const worksheet = xlsx.utils.json_to_sheet(this.patientAgingReporListExportExcel);

//     // Format all values as text to avoid misinterpretation by Excel
//     Object.keys(worksheet).forEach(cell => {
//         if (worksheet[cell] && worksheet[cell].t === 'n') {
//             worksheet[cell].t = 's'; // Treat the cell as a string
//         }
//     });

//     // Specify column widths as before
//     worksheet['!cols'] = [];
//     this.patientAgingReporListExportExcel.forEach(row => {
//         Object.keys(row).forEach(key => {
//             if (typeof row[key] === 'number') {
//                 // Convert number to currency format and update worksheet
//                 const currencyValue = `$ ${row[key].toFixed(2)}`;
//                 const cellRef = xlsx.utils.encode_cell({ c: Object.keys(row).indexOf(key), r: this.patientAgingReporListExportExcel.indexOf(row) + 1 });
//                 worksheet[cellRef] = { v: currencyValue, t: 's' }; // Set cell value and type to string
//                 worksheet['!cols'].push({ wch: currencyValue.length + 2 });
//             }
//         });
//     });

//     // Format date cells as "MM/DD/YY" if needed
//     // Add the indices of columns containing date values if applicable
//     const dateColIndices = [/* Add the indices of columns containing date values */];
//     dateColIndices.forEach(colIndex => {
//         for (let row = 2; row <= this.patientAgingReporListExportExcel.length; row++) {
//             const cellRef = xlsx.utils.encode_cell({ c: colIndex, r: row });
//             if (worksheet[cellRef] && worksheet[cellRef].t === 's') {
//                 const dateValue = new Date(worksheet[cellRef].v);
//                 if (!isNaN(dateValue.getTime())) {
//                     worksheet[cellRef].v = dateValue.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
//                 }
//             }
//         }
//     });

//     // Create workbook and write it to buffer
//     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = xlsx.write(workbook, {
//         bookType: 'xlsx',
//         type: 'array',
//     });

//     this.saveAsExcelFile(excelBuffer, 'Patient Aging Analysis Report');
// }
exportExcel() {
  debugger;
 
  // Convert patient data to worksheet
  const worksheet = xlsx.utils.json_to_sheet(this.patientAgingReporListExportExcel);

  // Define the keys that need to be formatted as currency
  const currencyKeys = ['BALANCE', 'S_0_30', 'S_31_60', 'S_61_90', 'S_91_120', 'S_121_180','S_180_PLUS'];

  // Specify column widths and format values correctly
  worksheet['!cols'] = [];
  this.patientAgingReporListExportExcel.forEach(row => {
      Object.keys(row).forEach(key => {
          const cellRef = xlsx.utils.encode_cell({ c: Object.keys(row).indexOf(key), r: this.patientAgingReporListExportExcel.indexOf(row) + 1 });
         
          if (currencyKeys.includes(key) && typeof row[key] === 'number') {
              // Convert number to currency format for specific keys
              const currencyValue = `$ ${row[key].toFixed(2)}`;
              worksheet[cellRef] = { v: currencyValue, t: 's' }; // Set cell value and type to string
              worksheet['!cols'].push({ wch: currencyValue.length + 2 });
          } else if (key === 'PATIENT_ACCOUNT') {
              // Treat PATIENT_ACCOUNT as text to prevent rounding
              worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
              worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
          } else if (typeof row[key] === 'number') {
              // For other numbers, keep them as numeric types
              worksheet[cellRef] = { v: row[key], t: 'n' };
              worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
          }
      });
  });

  // Format date cells as "MM/DD/YY" if needed
  const dateColIndices = [/* Add the indices of columns containing date values */];
  dateColIndices.forEach(colIndex => {
      for (let row = 2; row <= this.patientAgingReporListExportExcel.length; row++) {
          const cellRef = xlsx.utils.encode_cell({ c: colIndex, r: row });
          if (worksheet[cellRef] && worksheet[cellRef].t === 's') {
              const dateValue = new Date(worksheet[cellRef].v);
              if (!isNaN(dateValue.getTime())) {
                  worksheet[cellRef].v = dateValue.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
              }
          }
      }
  });

  // Create workbook and write it to buffer
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
  });

  this.saveAsExcelFile(excelBuffer, 'Patient Aging Analysis Report');
}

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE ='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
    );
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
    this.patientAgingReportList.sort((a, b) => {
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
      this.getPatientAgingReport(this.ddlPracticeCode, page);
    }
  }

  loadNextPage() {
    if (this.currentPage < this.totalPages) {
      const nextPage = this.currentPage + 1;
      this.loadPage(nextPage);
    }
  }

  loadPreviousPage() {
    if (this.currentPage > 1) {
      const previousPage = this.currentPage - 1;
      this.loadPage(previousPage);
    }
  }
  countValueChanged(event) {
    const selectedCount = event.target.value;
    this.count = +selectedCount; // Convert the value to a number
    this.currentPage = 1; // Reset to the first page when count changes
    this.getPatientAgingReport(this.ddlPracticeCode);
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

  onchangePractice(selectedPracticeCode?: any) {
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
    this.getPatientAgingReportExport( this.Checkpraccode);
    this.getPatientAgingReport(this.Checkpraccode);
  }
}
