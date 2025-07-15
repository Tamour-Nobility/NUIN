import { Component, OnInit } from '@angular/core';
import * as xlsx from 'xlsx';
import { APIService } from '../../components/services/api.service';
import * as FileSaver from 'file-saver';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EshaPlanAgingReport } from '../classes/esha-reports-model';
import { Item } from 'angular2-multiselect-dropdown';
// import * as ExcelJS from 'exceljs';
import * as Excel from 'exceljs/dist/exceljs.min.js'

@Component({
  selector: 'app-esha-plan-aging-report',
  templateUrl: './esha-plan-aging-report.component.html',
})
export class EshaPlanAgingReportComponent implements OnInit {

  PDForm: FormGroup;
  listPracticesList: any[];
  planAgingReport:EshaPlanAgingReport[];
  PracticeCode: String|number;
  isSearchInitiated=false;
 
  ddlPracticeCode: number = 0;
  //: boolean = false;
  sortingColumn: string = '';
  sortingDirection: number = 1;
  count = 10;
filteredData: any[];
searchText: string;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;

  filteredRecords: any;
  exportdata:any;
  selectedPracticeDetail:any;

  constructor(  public API: APIService,) {this.planAgingReport=[] }

  ngOnInit() {
    this.getPractices();
    this.InitForm();
  }
  getPractices() {
    debugger;
    this.API.getData('/Setup/GetEshaPracticeList').subscribe(
      d => {
        debugger;
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
  onPracticeChange() {
    let practiceCode=this.PDForm.value.practice
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.selectedPracticeDetail = this.listPracticesList.filter(p=> p.Id === practiceCode);
    this.currentPage = 1; // Reset to the first page when count changes
    console.log('selected Practice details', this.selectedPracticeDetail);
    // this.getExportData(practiceCode)
  }

  exportExcelPDF(exportFor: string){
    debugger;
    const connectSTR = '/Report/GetPlanAgingReportDetails?PracticeCode='+this.selectedPracticeDetail[0].Id+'&Page='+this.currentPage + '&Count=' + this.count +'&perPageRecord=false';
    this.API.getData(connectSTR).subscribe(
     (res) => {
      debugger;

      this.isSearchInitiated = true;
      if (res.Status == "Success") {
        debugger;
        console.log('Export data on practice change', res.Response.data);
        this.exportdata= res.Response.data;
        debugger;
        exportFor === 'pdf'? this.generatePDF() : this.ExportToExcel()
        }
    
  });
  }
  
  
  
  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  onsearch() {
    debugger;
    if (this.PDForm.invalid) {
      return;
    }
    let practicecodewithname=this.PDForm.value.practice
    let practiceCode= this.PDForm.value.practice
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }

    this.ddlPracticeCode=practiceCode
    const requestBody = {
      PracticeCode: practiceCode,
      PagedRequest: {
        isExport: true,
        page: this.currentPage,  // example value, you may replace it dynamically
        size: this.count  // example value, you may replace it dynamically
      }
    };
    debugger;
    const connectSTR = '/Report/GetPlanAgingReportDetails?PracticeCode='+practiceCode+'&Page='+this.currentPage + '&Count=' + this.count +'&perPageRecord=true';
    this.API.getData(connectSTR).subscribe(
     (res) => {
      debugger;

      this.isSearchInitiated = true;
      if (res.Status == "Success") {
        debugger;
        console.log('GetPlanAgingReportDetails', res);
        this.planAgingReport = res.Response.data;
        this.totalResults = res.Response.TotalRecords;
        this.currentPage = res.Response.CurrentPage;
        this.filteredRecords = res.Response.FilteredRecords;
        this.totalPages = Math.ceil(this.totalResults / this.count);
        }
      else
      {
        this.planAgingReport=[]
        swal(res.status, res.Response, 'error');
      }
          
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
    this.planAgingReport.sort((a, b) => {
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
      this.onsearch();
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
    this.onsearch();
  }
  onClear() {
    this.isSearchInitiated = false;
    this.ddlPracticeCode=0;
    this.PDForm.reset();
    this.planAgingReport = [];
  }

  ExportToExcel() {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

  // Table columns count (to be dynamically adjusted)
  const lastColumnIndex = 7; // 'Balance' column is the 8th column (index 8)

    worksheet.mergeCells('D1:E1'); // Adjust row number accordingly
    // Set text and formatting
    worksheet.getCell('D1').value = this.capitalize(this.selectedPracticeDetail[0].Name);
    worksheet.getCell('D1').font = { bold: true, size: 12 };
    worksheet.getCell('D1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D1:E1`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
      // fgColor:{argb:'FFFFFF'}
    };

    worksheet.mergeCells('D2:E2'); // Adjust row number accordingly
    // Set text and formatting
    worksheet.getCell('D2').value = this.capitalize(this.selectedPracticeDetail[0].Address);
    worksheet.getCell('D2').font =  {  size: 10 };
    worksheet.getCell('D2').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D2:E2`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
      // fgColor:{argb:'FFFFFF'}
    };


    worksheet.mergeCells('D3:E3'); // Adjust row number accordingly
    // Set text and formatting
    worksheet.getCell('D3').value =  this.capitalize(this.selectedPracticeDetail[0].City) +' '+ this.selectedPracticeDetail[0].State + ' '+this.selectedPracticeDetail[0].Zip;
    worksheet.getCell('D3').font =   { size: 11 };
    worksheet.getCell('D3').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D3:E3`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
      // fgColor:{argb:'FFFFFF'}
    };
   // Add a row with two dates: left (Run Date) and right (System Date)
   worksheet.getCell('A4').value = 'Run Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'}); // Example Run Date
   worksheet.getCell('A4').alignment = { horizontal: 'left', vertical: 'middle' }; // Left-align text
   worksheet.getCell('A4').font = { bold: true };

    worksheet.mergeCells('D4:E4'); // Adjust row number accordingly
    // Set text and formatting
    worksheet.getCell('D4').value = 'Plan Aging Report-Combined';
    worksheet.getCell('D4').font = { bold: true, size: 12 };
    worksheet.getCell('D4').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D4:E4`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D9D9D9' }, // Grey background
          // fgColor:{argb:'FFFFFF'}
        };

 
   worksheet.getCell('H4').value = 'System Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'}); // Example System Date
   worksheet.getCell('H4').alignment = { horizontal: 'right', vertical: 'middle' }; // Right-align text
   worksheet.getCell('H4').font = { bold: true };

    // Add table headers below the header section
    worksheet.addRow([]); // Blank row to separate header
    worksheet.addRow([]); // Blank row to separate header

    const tableHeader = [
     'Group Name', 
      'Insurance Name',
       'Balance', 
       'Current',
    '30 Days',
    '60 Days',
    '90 Days', 
    '120 Days'
    ];
    
    const headingRect12 = worksheet.getCell('A4');
  headingRect12.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect13 = worksheet.getCell('B4');
  headingRect13.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };

  const headingRect14 = worksheet.getCell('C4');
  headingRect14.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect31 = worksheet.getCell('D4');
  headingRect31.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect41 = worksheet.getCell('E4');
  headingRect41.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect51 = worksheet.getCell('F4');
  headingRect51.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect61 = worksheet.getCell('G4');
  headingRect61.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect71 = worksheet.getCell('H4');
  headingRect71.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };


    // worksheet.addRow(tableHeader);
    const headerRow = worksheet.addRow(tableHeader);
    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      
    });

     // Add a rectangular border for the entire row 9 up to column H
  const headingRect = worksheet.getCell('A7');
  headingRect.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect1 = worksheet.getCell('B7');
  headingRect1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };

  const headingRect2 = worksheet.getCell('C7');
  headingRect2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect3 = worksheet.getCell('D7');
  headingRect3.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect4 = worksheet.getCell('E7');
  headingRect4.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect5 = worksheet.getCell('F7');
  headingRect5.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect6 = worksheet.getCell('G7');
  headingRect6.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
  const headingRect7 = worksheet.getCell('H7');
  headingRect7.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
  };
 
 


 // Merge cells for each row from A to H
 for (let row = 1; row <= 3; row++) {
    worksheet.mergeCells(`A${row}:C${row}`);
  // worksheet.getCell(`A${row}`).value = `Merged Row ${row}`; // Example text
  worksheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }; // Center alignment
  worksheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }, // Grey background
    // fgColor:{argb:'FFFFFF'}
  };
  worksheet.getCell(`A${row}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

 // Merge cells for each row from A to H
 for (let row = 1; row <= 3; row++) {
  worksheet.mergeCells(`F${row}:H${row}`);
// worksheet.getCell(`A${row}`).value = `Merged Row ${row}`; // Example text
worksheet.getCell(`F${row}`).alignment = { horizontal: 'center', vertical: 'middle' }; // Center alignment
worksheet.getCell(`F${row}`).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'D9D9D9' }, // Grey background
  // fgColor:{argb:'FFFFFF'}
};
worksheet.getCell(`F${row}`).border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};
}

         // Adjust column widths
    worksheet.columns = [
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
      { width: 20 }, 
    
    ];

    // Hide gridlines under the header section
    worksheet.getRow(5).height = 3; // Minimize row height for blank space
   // Set a thin border only for columns A to H in row 7
  for (let col = 1; col <= 8; col++) { // Columns A to H correspond to 1-8
    const cell = worksheet.getCell(5, col); // Row 7, Column col
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber <= 5) {
        row.eachCell((cell) => {
          cell.border = {}; // Remove borders
        });
      }
    });

// Initialize total variables for each column
let totalBalance = 0;
let totalCurrent = 0;
let total30Days = 0;
let total60Days = 0;
let total90Days = 0;
let total120Days = 0;
//  });
// Add data rows dynamically from JSON and calculate totals
this.exportdata.forEach((row) => {
   const newRow = worksheet.addRow([
        row.GROUP_NAME || '',
        row.AGING_PAYER || '',
        ((row.BALANCE !== null && row.BALANCE !== undefined?`$ ${parseFloat(row.BALANCE).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
        ((row.Current !== null && row.Current !== undefined?`$ ${parseFloat(row.Current).toFixed(2)}`: '$ 0.00')|| '$ 0.00'),
        ((row.C30_Days !== null && row.C30_Days !== undefined?`$ ${parseFloat(row.C30_Days).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
        ((row.C60_Days !== null && row.C60_Days !== undefined?`$ ${parseFloat(row.C60_Days).toFixed(2)}`:'$ 0.00') || '$ 0.00'),
        ((row.C90_Days !== null && row.C90_Days !== undefined?`$ ${parseFloat(row.C90_Days).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
        ((row.C120_Days !== null && row.C120_Days !== undefined?`$ ${parseFloat(row.C120_Days).toFixed(2)}`: '$ 0.00')|| '$ 0.00'),
      ]);
  // Align balance column to the right
  newRow.getCell(3).alignment = { horizontal: 'right' };
  newRow.getCell(4).alignment = { horizontal: 'right' };
  newRow.getCell(5).alignment = { horizontal: 'right' };
  newRow.getCell(6).alignment = { horizontal: 'right' };
  newRow.getCell(7).alignment = { horizontal: 'right' };
  newRow.getCell(8).alignment = { horizontal: 'right' };
    totalBalance += row.BALANCE || 0;
    totalCurrent += row.Current || 0;
    total30Days += row.C30_Days || 0;
    total60Days += row.C60_Days || 0;
    total90Days += row.C90_Days || 0;
    total120Days += row.C120_Days || 0;
});

// Calculate the footer row index
const footerRowIndex = this.exportdata.length + 9;

// Add the footer row with totals
worksheet.addRow([]); // Blank row to separate data from totals
worksheet.getCell(`A${footerRowIndex}`).value = 'Report Total:';
worksheet.mergeCells(`A${footerRowIndex}:B${footerRowIndex}`);
worksheet.getCell(`A${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'left' };
worksheet.getCell(`A${footerRowIndex}`).font = { bold: true };

// Add totals for each column in the footer row
worksheet.getCell(`C${footerRowIndex}`).value = `$ ${totalBalance.toFixed(2)}`;
worksheet.getCell(`C${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

worksheet.getCell(`D${footerRowIndex}`).value = `$ ${totalCurrent.toFixed(2)}`;
worksheet.getCell(`D${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

worksheet.getCell(`E${footerRowIndex}`).value = `$ ${total30Days.toFixed(2)}`;
worksheet.getCell(`E${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

worksheet.getCell(`F${footerRowIndex}`).value = `$ ${total60Days.toFixed(2)}`;
worksheet.getCell(`F${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

worksheet.getCell(`G${footerRowIndex}`).value = `$ ${total90Days.toFixed(2)}`;
worksheet.getCell(`G${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

worksheet.getCell(`H${footerRowIndex}`).value = `$ ${total120Days.toFixed(2)}`;
worksheet.getCell(`H${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };


// Apply bold font and background fill to the totals row
const footerRow = worksheet.getRow(footerRowIndex);
footerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' }, // Light grey background
    };
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'double' }, // Double border at the bottom
        right: { style: 'thin' },
    };
});
    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      FileSaver.saveAs(blob, 'Plan Aging Report.xlsx');
    });
  
}

generatePDF() {
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'A4',
  });

  const marginLeft = 14;
  const marginRight = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginLeft - marginRight;

  const rectWidth = contentWidth-4;
  doc.setFillColor(211, 211, 211);
  doc.rect(marginLeft, 2, rectWidth, 28, 'F');
  doc.line(marginLeft, 2, marginLeft + rectWidth, 2); // Line at y = 5 with rectWidth
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold'); // Set font to bold
  doc.text(this.capitalize(this.selectedPracticeDetail[0].Name), pageWidth / 2, 8, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal'); // Set font to bold
  doc.text(this.capitalize(this.selectedPracticeDetail[0].Address), pageWidth / 2, 14, { align: 'center' });
  doc.text(this.capitalize(this.selectedPracticeDetail[0].City) + ' '+this.selectedPracticeDetail[0].State + ' '+this.selectedPracticeDetail[0].Zip, pageWidth / 2, 19, { align: 'center' });
  doc.setFont('helvetica', 'bold'); // Set font to bold
  doc.text(`System Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'})}`, rectWidth - 29, 25, { align: 'left' });
  doc.text(`Run Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'})}`, 50, 25, { align: 'right' });

  doc.setFontSize(11);
  doc.text('Plan Aging Report-Combined', pageWidth / 2, 25, { align: 'center' });
  doc.line(marginLeft, 29, marginLeft + rectWidth, 29);
  doc.line(marginLeft, 30, marginLeft + rectWidth, 30);

  // Prepare Table Data
  const exportData = this.exportdata;
  const tableData = exportData.map((item) => [
    item.GROUP_NAME,
    item.AGING_PAYER,
    ((item.BALANCE !== null && item.BALANCE !== undefined?`$ ${parseFloat(item.BALANCE).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
    ((item.Current !== null && item.Current !== undefined?`$ ${parseFloat(item.Current).toFixed(2)}`: '$ 0.00')|| '$ 0.00'),
    ((item.C30_Days !== null && item.C30_Days !== undefined?`$ ${parseFloat(item.C30_Days).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
    ((item.C60_Days !== null && item.C60_Days !== undefined?`$ ${parseFloat(item.C60_Days).toFixed(2)}`:'$ 0.00') || '$ 0.00'),
    ((item.C90_Days !== null && item.C90_Days !== undefined?`$ ${parseFloat(item.C90_Days).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
    ((item.C120_Days !== null && item.C120_Days !== undefined?`$ ${parseFloat(item.C120_Days).toFixed(2)}`: '$ 0.00')|| '$ 0.00'),
 ]);


  const tableHeaders = [
   'Group Name', 'Insurance Name', 'Balance', 'Current',
    '30 Days','60 Days','90 Days', '120 Days'
  ];

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 34,
    styles: {
      fontSize: 9,
      
    },
    margin: { bottom: 25 }, // Adjust as needed

    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontSize: 9,
      lineWidth: 0.1,
      lineColor: [211, 211, 211], // Light grey for header lines as well
      halign: 'left',           // Horizontally center the header text
      valign: 'middle',           // Vertically center the header text
      cellPadding: 2,             // Adjust cell padding for header height

    },
    columnStyles: {
      2: { cellWidth: 23, halign: 'right'  },  // Set width for the Balance upto 120 days column
      3: { cellWidth: 23, halign: 'right'  }, 
      4: {cellWidth: 23, halign: 'right'  }, 
      5: {cellWidth: 23, halign: 'right'  }, 
      6: { cellWidth: 23, halign: 'right'  }, 
      7: { cellWidth: 23, halign: 'right'  }, 
    },
    theme: 'grid',
  });
  // Calculate totals for each column
const totalBalance = exportData.reduce((sum, item) => sum + parseFloat(item.BALANCE || 0), 0);
const totalCurrent = exportData.reduce((sum, item) => sum + parseFloat(item.Current || 0), 0);
const total30Days = exportData.reduce((sum, item) => sum + parseFloat(item.C30_Days || 0), 0);
const total60Days = exportData.reduce((sum, item) => sum + parseFloat(item.C60_Days || 0), 0);
const total90Days = exportData.reduce((sum, item) => sum + parseFloat(item.C90_Days || 0), 0);
const total120Days = exportData.reduce((sum, item) => sum + parseFloat(item.C120_Days || 0), 0);

// Footer position
const autoTablePluginDoc = doc as any;
const footerY = autoTablePluginDoc.lastAutoTable.finalY ; // Position it below the table
  // Footer rectangle dimensions
const footerHeight = 10; // Height of the footer rectangle
// const footerY = doc.internal.pageSize.getHeight() - footerHeight - 10; // Position above the bottom
const footerX = marginLeft; // Start at the left margin

// Draw the footer rectangle with a light grey background
doc.setFillColor(211, 211, 211); // Light grey color
doc.rect(footerX, footerY+5, rectWidth, footerHeight, 'F'); // 'F' for filled rectangle
doc.line(marginLeft, footerY+5, marginLeft + rectWidth, footerY+5); // Line at y = 5 with rectWidth


// Define column positions
const columnPositions = [
  marginLeft + 152,// Balance column
  marginLeft + 175, // Current column
  marginLeft + 199, // 30 Days column
  marginLeft + 221, // 60 Days column
  marginLeft + 245, // 90 Days column
  marginLeft + 267, // 120 Days column
];

// Add totals below each column
doc.setFontSize(10);
doc.setFont('helvetica', 'bold'); // Bold font for totals
// "Report Total" below the first column
doc.text('Report Total:', marginLeft+2, footerY+11); // Below the first column


// Display totals aligned under their respective columns
doc.text(`$ ${parseFloat(totalBalance).toFixed(2)}`, columnPositions[0], footerY + 11, { align: 'right' });
doc.text(`$ ${totalCurrent.toFixed(2)}`, columnPositions[1], footerY + 11, { align: 'right' });
doc.text(`$ ${total30Days.toFixed(2)}`, columnPositions[2], footerY + 11, { align: 'right' });
doc.text(`$ ${total60Days.toFixed(2)}`, columnPositions[3], footerY + 11, { align: 'right' });
doc.text(`$ ${total90Days.toFixed(2)}`, columnPositions[4], footerY + 11, { align: 'right' });
doc.text(`$ ${total120Days.toFixed(2)}`, columnPositions[5], footerY + 11, { align: 'right' });

// Optional: Add a horizontal line below the totals
// doc.line(marginLeft, footerY + 8, marginLeft + rectWidth, footerY + 8);
doc.line(marginLeft, footerY+14, marginLeft + rectWidth, footerY+14); // Line at y = 5 with rectWidth
doc.line(marginLeft, footerY+15, marginLeft + rectWidth, footerY+15); // Line at y = 5 with rectWidth

  // Add page numbers
  doc.setFont('helvetica', 'normal'); // Set font to bold
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
  }


  doc.save('Plan Aging Report.pdf');
}

// Helper function to capitalize the first letter of each word
capitalize(text: string): string {
  if (!text) return ''; // Handle empty strings
  return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}
}
