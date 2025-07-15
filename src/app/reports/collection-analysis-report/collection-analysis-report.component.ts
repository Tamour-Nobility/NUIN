import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import * as xlsx from 'xlsx';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';

import * as moment from 'moment';
import { DatatableService } from '../../services/data/datatable.service';
import { CollectionAnalysisReport } from '../classes/collection-analysis-report';
import { PracticesList } from '../classes/aging-summary-report-model';
import { ActivatedRoute } from '@angular/router';
import { IMyDrpOptions } from 'mydaterangepicker';


@Component({
  selector: 'app-collection-analysis-report',
  templateUrl: './collection-analysis-report.component.html',
  styleUrls: ['./collection-analysis-report.component.css']
})
export class CollectionAnalysisReportComponent implements OnInit {
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
  collectionAnalysisReportList: CollectionAnalysisReport[];
  collectionAnalysisReportListExportExcel: CollectionAnalysisReport[];
  listPracticesList: PracticesList[];
    sortingColumn: string = '';
  sortingDirection: number = 1;

  PDForm: FormGroup;
  strFromDate: string;
  strToDate: string;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  public placeholder: string = 'MM/DD/YYYY';
  

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute
  ) {
    this.listPracticesList = [];
    this.collectionAnalysisReportList = [];
    this.ddlPracticeCode = 0;
  }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getCollectionAnalysisReport(qs['PracticeCode']);
      }
    })
  }

  
  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      dateFrom: new FormControl('', [
       // Validators.required,
      ]),
      dateTo: new FormControl('', [
       // Validators.required,
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
  
  getCollectionAnalysisReport(Practice_Code: any, page = 1) {
    this.collectionAnalysisReportList=[];
    let practiceCode=Practice_Code
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData(`/Report/CollectionAnalysisReport?PracticeCode=${practiceCode}&DateFrom=${this.strFromDate}&DateTo=${this.strToDate}&isExport=${false}&page=${page}&size=${this.count}`)
   // this.API.getData(`/Report/PatientAgingReport?PracticeCode=${Practice_Code}&page=${page}&size=${this.count}`)
      .subscribe(data => {
        if (data.Status === "success") {
          this.collectionAnalysisReportList = data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
        }
           // After fetching the data, call exportExcel to export it to Excel
          //  this.exportExcel();
      });

  }


  getCollectionAnalysisReportExport(Practice_Code: any){
    this.collectionAnalysisReportListExportExcel=[];
    this.API.getData(`/Report/CollectionAnalysisReport?PracticeCode=${Practice_Code}&DateFrom=${this.strFromDate}&DateTo=${this.strToDate}&isExport=${true}`)
    .subscribe(data => {
      if (data.Status === "success") {
      this.collectionAnalysisReportListExportExcel=data.Response;
   } })
  }
 
  // am commenting this
  exportExcel() {
  const worksheet = xlsx.utils.json_to_sheet(this.collectionAnalysisReportListExportExcel); 
  // Format the cells to treat all values as text
  Object.keys(worksheet).forEach(cell => {
    if (worksheet[cell] && worksheet[cell].t === 'n') {
      worksheet[cell].t = 's'; // Treat the cell as a string
    }
  });
 
  // Specify column widths as before
  worksheet['!cols'] = [];
  this.collectionAnalysisReportListExportExcel.forEach(row => {
    Object.keys(row).forEach(key => {
      if (typeof row[key] === 'number') {
        worksheet['!cols'].push({ wch: String(row[key]).length + 2 });
      }
    });
  });
 
  // Format date cells as "MM/DD/YY"
  const dateColIndices = [/* Add the indices of columns containing date values */];
  dateColIndices.forEach(colIndex => {
    for (let row = 2; row <= this.collectionAnalysisReportListExportExcel.length; row++) {
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
 
  this.saveAsExcelFile(excelBuffer, 'Collection Analysis Report');
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
    this.collectionAnalysisReportList.sort((a, b) => {
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
      this.getCollectionAnalysisReport(this.ddlPracticeCode, page);
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
    this.getCollectionAnalysisReport(this.ddlPracticeCode);
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

  onchangePractice() {
    let practiceCode=this.ddlPracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    if (practiceCode == undefined || practiceCode == null || practiceCode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }
    this.getCollectionAnalysisReport(practiceCode);
    this.getCollectionAnalysisReportExport( practiceCode);
    
  }
}
