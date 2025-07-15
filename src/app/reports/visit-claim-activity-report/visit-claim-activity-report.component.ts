import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../components/services/api.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


import * as FileSaver from 'file-saver';
// At the top of your TypeScript file, declare autoTable globally.
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: any) => jsPDF;
//   }
// }



@Component({
  selector: 'app-visit-claim-activity-report',
  templateUrl: './visit-claim-activity-report.component.html',
  styleUrls: ['./visit-claim-activity-report.component.css']
})
export class VisitClaimActivityReportComponent implements OnInit {
  PDForm: FormGroup;
  listPracticesList: any[];
  VisitCalimReport:any;
  providerList:any;
  PracticeCode:String | number;
  isSearchInitiated=false;
  public placeholder: string = 'MM/DD/YYYY';
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  ddlPracticeCode:String | number = 0;
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
  constructor(  public API: APIService,) {this.VisitCalimReport=[] }

  ngOnInit() {
    this.getPractices();
    this.InitForm();
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
  onPracticeChange() {
    let practiceCode=this.PDForm.value.practice
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    let selectedPracticeId =practiceCode;
   
    
    if (selectedPracticeId > 0) {  // Ensure valid practice id is selected
      this.GetProviders(selectedPracticeId);
    }
  }
  
  GetProviders(id: number) {
    this.API.getData(`/Report/GetProvidersBYPractice?PracticeId=${id}`).subscribe(
      d => {
        if (d.Status === "success") {
          debugger
          this.providerList = d.Response;
          console.log("Providers", this.providerList)
        } else {
          swal('Failed', d.Status, 'error');
        }
      },
      error => {
        swal('Error', 'Something went wrong', 'error');
      }
    );
  }
  
  
  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      provideId:new FormControl('',[
        Validators.required,
      ]

      ),
      dateFrom: new FormControl('', [
        Validators.required,
      ]),
      dateTo: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  onsearch() {
    if (this.PDForm.invalid) {
      return;
    }
    debugger
    let practiceCode= this.PDForm.value.practice
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    // Ensure date fields are properly formatted before using them
    const dateFrom = this.PDForm.value.dateFrom.formatted 
    const dateTo = this.PDForm.value.dateTo.formatted 
  this.ddlPracticeCode=this.PDForm.value.practice
    const requestBody = {
      PracticeCode: practiceCode,
      ProviderCode: this.PDForm.value.provideId,
      DateFrom: dateFrom,  // Convert valid date to ISO format
      DateTo: dateTo,      // Convert valid date to ISO format
      PagedRequest: {
        isExport: true,
        page: this.currentPage,  // example value, you may replace it dynamically
        size: this.count  // example value, you may replace it dynamically
      }
    };
    this.getpaginatedData();
    this.API.PostData('/Report/GetVisitClaimActivityReport',requestBody, (res) => {
      this.isSearchInitiated = true;
      debugger
      if (res.Status == "success") {
        this.exportdata= res.Response;
         debugger
          console.log("exportData",this.exportdata)
  
          //this.updateDatatable(res.Response);
      }
      else
          swal(res.status, res.Response, 'error');
  });
  }
  getpaginatedData(){
    if (this.PDForm.invalid) {
      return;
    }
    let practiceCode= this.PDForm.value.practice
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    const dateFrom = this.PDForm.value.dateFrom.formatted 
    const dateTo = this.PDForm.value.dateTo.formatted 
  
    const requestBody = {
      PracticeCode:practiceCode,
      ProviderCode: this.PDForm.value.provideId,
      DateFrom: dateFrom,  // Convert valid date to ISO format
      DateTo: dateTo,      // Convert valid date to ISO format
      PagedRequest: {
        isExport: false,
        page: this.currentPage,  // example value, you may replace it dynamically
        size: this.count  // example value, you may replace it dynamically
      }
    };
    this.API.PostData('/Report/GetVisitClaimActivityReport',requestBody, (data) => {
      this.isSearchInitiated = true;
      debugger
      if (data.Status == "success") {
      
         this.VisitCalimReport =  data.Response.data;
         this.totalResults = data.Response.TotalRecords;
         this.currentPage = data.Response.CurrentPage;
         this.filteredRecords = data.Response.FilteredRecords;
         this.totalPages = Math.ceil(this.totalResults / this.count);
         debugger
          console.log("exportData",data)
        
          //this.updateDatatable(res.Response);
      }
      else
          swal(data.status, data.Response, 'error');
  });
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
    this.VisitCalimReport.sort((a, b) => {
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
      this.getpaginatedData();
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
    this.getpaginatedData();
  }
  onClear() {
    this.isSearchInitiated = false;
    //this.chRef.detectChanges();
    this.ddlPracticeCode=0;
    // if (this.dtuserreportdetials) {
    //   this.dtuserreportdetials.destroy();
    // }
    this.PDForm.reset();
    this.VisitCalimReport = [];
  }
  exportExcel() {
    debugger;
    // Remove PATIENT_DOBDAY from data and rename headers
    const modifiedData = this.exportdata.map(({ useridbycreated,useridbymodified,Modified_ByN,CreatedDate,ModifiedDate, ...rest }) => {
        return rest;
    });
    const currencyKeys = ['Billed', 'Amount'];
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
            } else if (key === 'DOS' || key === 'POSTING') {
              // Check if 'POSTING' value is "Total" and keep it as a string if true
              const dateValue = row[key];
              if (key === 'POSTING' && dateValue === 'Total') {
                  worksheet[cellRef] = { v: 'Total', t: 's' };  // Display "Total" as it is
              } else if (dateValue) {
                  // Format dates as MM/DD/YYYY, or show empty string if null
                  const date = new Date(dateValue);
                  worksheet[cellRef] = { 
                      v: `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`, 
                      t: 's' 
                  };
              } else {
                  worksheet[cellRef] = { v: '', t: 's' };  // Display empty string for null dates
              }
              worksheet['!cols'].push({ wch: 12 });  // Set width for date columns
          }else if (typeof row[key] === 'number') {
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

    this.saveAsExcelFile(excelBuffer, 'Visit Claim Activity  Report');
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
selectedProvider: string;

onprovideChange(event: any) {
  debugger
  const selectedProviderId = event.target.value; // Get the selected ProviderId
  const selectedProvider = this.providerList.find(provider => provider.ProviderId.toString() === selectedProviderId);

  if (selectedProvider) {
    this.selectedProvider = selectedProvider.ProviderFullName; // Assign the full name to selectedProvider
  } else {
    this.selectedProvider = ''; // Clear if no provider is found
  }
}
isValidDate(value: string): boolean {
  // Check if the value can be parsed into a valid date
  const date = Date.parse(value);
  return !isNaN(date);
}

generatePDF() {
  debugger;
  const postingDateFrom = this.PDForm.value.dateFrom.formatted;
  const postingDateTo = this.PDForm.value.dateTo.formatted;
  const selectedProvider = this.selectedProvider;

  const doc = new jsPDF({
    orientation: 'portrait', // or 'landscape'
    unit: 'mm', // measurement units (mm, in, pt, px)
    format: 'letter', // custom width and height
  });

  // Define consistent starting X position for alignment
  const startX = 13;

  // Add title
  doc.setFontSize(14);
  doc.text('Visit Claim / Activity Report(NPM)', startX, 10); // Align title with table
  const titleWidth = doc.getTextWidth('Visit Claim / Activity Report(NPM)');
  doc.line(startX, 12, startX + titleWidth, 12); // Draw underline below the title

  // Add subtitle
  doc.setFontSize(11);
  const subtitleText = `Posting Dates: ${postingDateFrom} to ${postingDateTo}; Line Item: ${selectedProvider}`;
  doc.text(subtitleText, startX, 20);
  const subtitleWidth = doc.getTextWidth(subtitleText);
  doc.line(startX, 22, startX + subtitleWidth, 22); // Draw underline below the subtitle

  // Export data array
  const exportData = this.exportdata;

  // Map the export data to the table format
  const tableData = exportData.map(item => [
    item.POSTING,
    item.PATIENT_NAME,
    item.DOS,
    item.RESP,
    item.CPT_CODE,
    item.Description,
    this.formatCurrency(item.Billed),  // Format as currency
    item.PROVIDER,
    item.LOCATION,
    this.formatCurrency(item.Amount),  // Format as currency
  ]);

  // Column Headers
  const tableHeaders = [
    'Posting', 'Patient Name', 'DOS', 'RESP', 'Code', 'Description', 'Billed', 'Provider', 'Location', 'Amount'
  ];

  // Use autoTable to create the table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 23, // Position the table after the subtitle
    styles: { 
      fontSize: 9 // Apply this style to the body
    },
    headStyles: {
      fillColor: [200, 200, 200], // Grey background for header
      textColor: [0, 0, 0], // Black text color for header
      fontSize: 9, // Font size for header
      lineWidth: 0.5, // Line width for borders
      lineColor: [0, 0, 0], // Border color
    },
    didParseCell: (data) => {
      if (data.column.index === 6) {
        // Check if it's the last row
        if (data.row.index === tableData.length - 1) {
          // For the last row, remove the dollar sign in "Billed"
          data.cell.text = ['']; // No dollar sign
        }
      }
      // Check if it's the last column in the body
      if (data.row.index === tableData.length - 1) {
        // Apply the same styles as header
        data.cell.styles.fillColor = [200, 200, 200]; // Grey background
        data.cell.styles.textColor = [0, 0, 0]; // Black text color
        data.cell.styles.fontSize = 9; // Font size for cell
        data.cell.styles.lineWidth = 0.5; // Line width for borders
        data.cell.styles.lineColor = [0, 0, 0]; // Border color
      }
    },
    theme: 'grid',
  });

  // Save the PDF
  doc.save('Visit-Claim-Activity.pdf');
}

// Helper function to format currency
formatCurrency(amount) {
  if (amount !== null && amount !== undefined) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return '';
}



}
