import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { DatatableService } from '../../services/data/datatable.service';
import { PatientStatementReport } from '../classes/appointment-detail-report';
import { PracticesList } from '../classes/aging-summary-report-model';
import { ActivatedRoute } from '@angular/router';

import { PatientAgingReport } from '../classes/patient-aging-report';


@Component({
  selector: 'app-patient-aging-report',
  templateUrl: './patient-aging-report.component.html',
  styleUrls: ['./patient-aging-report.component.css']
})
export class PatientAgingReportComponent implements OnInit {
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
  ddlPracticeCode:String| number = 0;
  isRouted: boolean = false;
  patientAgingReportList: PatientAgingReport[];
  patientAgingReporListExportExcel: PatientAgingReport[];
  listPracticesList: PracticesList[];
    sortingColumn: string = '';
  sortingDirection: number = 1;
  Checkpraccode:any;

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.listPracticesList = [];
    this.patientAgingReportList = [];
    this.ddlPracticeCode = 0;
  }

  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getPatientAgingReport(qs['PracticeCode']);
      }
    })
  }

  
  getPatientAgingReport(Practice_Code: any, page = 1) {
    if(Practice_Code!=0)
      {
        let practiceCode=Practice_Code
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.Checkpraccode=practiceCode
      }
    this.API.getDataUser(`/Report/PatientAgingReport?PracticeCode=${this.Checkpraccode}&isExport=${false}&page=${page}&size=${this.count}`)
   // this.API.getData(`/Report/PatientAgingReport?PracticeCode=${Practice_Code}&page=${page}&size=${this.count}`)
      .subscribe(data => {
        this.spinner.hide();
        if (data.Status === "success") {
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
    this.API.getDataUser(`/Report/PatientAgingReport?PracticeCode=${Practice_Code}&isExport=${true}`)
    .subscribe(data => {
      if (data.Status === "success") {
      this.patientAgingReporListExportExcel=data.Response;
   } })
  }
 
  // am commenting this
  exportExcel() {
    debugger
  const worksheet = xlsx.utils.json_to_sheet(this.patientAgingReporListExportExcel);
 
  // Format the cells to treat all values as text
  Object.keys(worksheet).forEach(cell => {
    if (worksheet[cell] && worksheet[cell].t === 'n') {
      worksheet[cell].t = 's'; // Treat the cell as a string
    }
  });
 
  // Specify column widths as before
  worksheet['!cols'] = [];
  this.patientAgingReporListExportExcel.forEach(row => {
    Object.keys(row).forEach(key => {
      if (typeof row[key] === 'number') {
        worksheet['!cols'].push({ wch: String(row[key]).length + 2 });
      }
    });
  });
 
  // Format date cells as "MM/DD/YY"
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
 
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = xlsx.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
 
  this.saveAsExcelFile(excelBuffer, 'Patient Aging Report');
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
