import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';

import * as moment from 'moment';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { PatientStatementReport } from '../classes/appointment-detail-report';
import { PracticesList } from '../classes/aging-summary-report-model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-patient-statement-report',
  templateUrl: './patient-statement-report.component.html',
  styleUrls: ['./patient-statement-report.component.css']
})
export class PatientStatementReportComponent implements OnInit {
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
  ddlPracticeCode:String | number = 0;
  isRouted: boolean = false;
  listPatientReportStatement: PatientStatementReport[];
  listPatientReportStatementExportExcel: PatientStatementReport[];
  listPracticesList: PracticesList[];
    sortingColumn: string = '';
  sortingDirection: number = 1;
  Checkpraccode:any;

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute
  ) {
    this.listPracticesList = [];
    this.listPatientReportStatement = [];
    this.ddlPracticeCode = 0;
  }

  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getPatientStatementReport(qs['PracticeCode']);
      }
    })
  }

  
  getPatientStatementReport(Practice_Code: any, page = 1) {
    debugger;
     if(Practice_Code!=0)
      {
        let practiceCode=Practice_Code
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.Checkpraccode=practiceCode
      }
    console.log("Fetching patient statement report for Practice_Code:", Practice_Code);
    this.API.getData(`/Report/DormantClaimsReport?PracticeCode=${this.Checkpraccode}&page=${page}&size=${this.count}`)
      .subscribe(data => {
        if (data.Status === "success") {
          this.listPatientReportStatement = data.Response.data;
          this.totalResults = data.Response.TotalRecords;
          this.currentPage = data.Response.CurrentPage;
          this.filteredRecords = data.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
        }
        console.log("listPatientReportStatement data are:", this.listPatientReportStatement);
           // After fetching the data, call exportExcel to export it to Excel
          //  this.exportExcel();
      });

  }

  //   // Use the existing getPatientStatementReport function to fetch data for the specified page
  //   await this.getPatientStatementReport(this.ddlPracticeCode, pageNumber);
  // } 
  
  // exportExcel() {

  //   const worksheet = xlsx.utils.json_to_sheet(this.listPatientReportStatement);
  
  //   // Format the cells to treat all values as text
  //   Object.keys(worksheet).forEach(cell => {
  //     if (worksheet[cell] && worksheet[cell].t === 'n') {
  //       worksheet[cell].t = 's'; // Treat the cell as a string
  //     }
  //   });
  
  //   // Specify column widths as before
  //   worksheet['!cols'] = [];
  //   this.listPatientReportStatement.forEach(row => {
  //     Object.keys(row).forEach(key => {
  //       if (typeof row[key] === 'number') {
  //         worksheet['!cols'].push({ wch: String(row[key]).length + 2 });
  //       }
  //     });
  //   });
  
  //   const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = xlsx.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });
  
  //   this.saveAsExcelFile(excelBuffer, 'Patient Statment Report');
  // }


  getPatientStatementReportExport(Practice_Code: any){
    debugger
    this.API.getData(`/Report/DormantClaimsReportsPagination?PracticeCode=${Practice_Code}`)
    .subscribe(data => {
      if (data.Status === "Sucess") {
      this.listPatientReportStatementExportExcel=data.Response;
      console.log("data.Response.data===========================", data.Response);
 
   } })}
 
  // am commenting this
  exportExcel() {
    debugger
  const worksheet = xlsx.utils.json_to_sheet(this.listPatientReportStatementExportExcel);
 
  // Format the cells to treat all values as text
  Object.keys(worksheet).forEach(cell => {
    if (worksheet[cell] && worksheet[cell].t === 'n') {
      worksheet[cell].t = 's'; // Treat the cell as a string
    }
  });
 
  // Specify column widths as before
  worksheet['!cols'] = [];
  this.listPatientReportStatementExportExcel.forEach(row => {
    Object.keys(row).forEach(key => {
      if (typeof row[key] === 'number') {
        worksheet['!cols'].push({ wch: String(row[key]).length + 2 });
      }
    });
  });
 
  // Format date cells as "MM/DD/YY"
  const dateColIndices = [/* Add the indices of columns containing date values */];
  dateColIndices.forEach(colIndex => {
    for (let row = 2; row <= this.listPatientReportStatementExportExcel.length; row++) {
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
 
  this.saveAsExcelFile(excelBuffer, 'Patient Statement Report');
}



//   export(): void {
//     // Generate a worksheet from your data
//     //const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
//     const worksheet = xlsx.utils.json_to_sheet(this.listPatientReportStatement);

//     // Format the dates in the worksheet
//     const dateColumns = [/* Add the column indices of date columns here */];
//     dateColumns.forEach((colIndex) => {
//         for (const cellAddress in worksheet) {
//             if (worksheet.hasOwnProperty(cellAddress)) {
//                 if (cellAddress.startsWith('!')) continue;
//                 const cell = worksheet[cellAddress];
//                 if (cell && cell.t === 'n' && colIndex === Number(cellAddress.replace(/[A-Z]/, ''))) {
//                     const dateValue = new Date(cell.v);
//                     if (!isNaN(dateValue)) {
//                         const formattedDate = (dateValue.getMonth() + 1).toString().padStart(2, '0') + '/'
//                             + (dateValue.getDate()).toString().padStart(2, '0') + '/'
//                             + (dateValue.getFullYear() % 100).toString().padStart(2, '0');
//                         cell.v = formattedDate;
//                     }
//                 }
//             }
//         }
//     });

//     // Generate a new workbook and add the worksheet to it
//    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = xlsx.write(workbook, {
//       bookType: 'xlsx',
//       type: 'array',
//     });
  

//     // Save the workbook to a file
  
//      this.saveAsExcelFile(excelBuffer, 'Patient Statment Report');
// }

  
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

  // filterData() {
  //   if (this.searchTerm) {
  //     this.listPatientReportStatement = this.listPatientReportStatement.filter(report => {
  //       // Replace 'property' with the name of the property you want to search in
  //       return (
  //         report.PATIENT_NAME.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //         report.PATIENT_CITY.toLowerCase().includes(this.searchTerm.toLowerCase()) 
  //         // Add more conditions for other properties as needed
  //       );
  //     });
  //   } else {
  //     this.listPatientReportStatement = this.fullData;
  //   }
  // }
  
  
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
    this.listPatientReportStatement.sort((a, b) => {
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
    debugger;
    if (page >= 1 && page <= this.totalPages) {
      this.getPatientStatementReport(this.ddlPracticeCode, page);
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
    this.getPatientStatementReport(this.ddlPracticeCode);
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
    if ( this.Checkpraccode == undefined ||  this.Checkpraccode == null ||  this.Checkpraccode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }
    this.getPatientStatementReportExport(  this.Checkpraccode);
    this.getPatientStatementReport( this.Checkpraccode);
  }



}
