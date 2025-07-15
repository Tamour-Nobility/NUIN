import { Component, OnInit } from '@angular/core';
import * as xlsx from 'xlsx';
import { APIService } from '../../components/services/api.service';
import * as FileSaver from 'file-saver';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CreditBalanceReport } from '../classes/esha-reports-model';
import { Item } from 'angular2-multiselect-dropdown';
// import * as ExcelJS from 'exceljs';
import * as Excel from 'exceljs/dist/exceljs.min.js'

@Component({
  selector: 'app-credit-balance-report',
  templateUrl: './credit-balance-report.component.html',
})
export class CreditBalanceReportComponent implements OnInit {

  PDForm: FormGroup;
  listPracticesList: any[];
  CreditBalanceReport:CreditBalanceReport[];
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

  constructor(  public API: APIService,) {this.CreditBalanceReport=[] }

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
    const connectSTR = '/Report/GetEshaCBRDetails?PracticeCode='+this.selectedPracticeDetail[0].Id+'&Page='+this.currentPage + '&Count=' + this.count +'&perPageRecord=false';
    this.API.getData(connectSTR).subscribe(
     (res) => {
      debugger;

      this.isSearchInitiated = true;
      if (res.Status == "Success") {
        debugger;
        console.log('Export data on practice change', res.Response.data);
        this.exportdata= res.Response.data;
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
    const connectSTR = '/Report/GetEshaCBRDetails?PracticeCode='+practiceCode+'&Page='+this.currentPage + '&Count=' + this.count +'&perPageRecord=true';
    this.API.getData(connectSTR).subscribe(
     (res) => {
      debugger;

      this.isSearchInitiated = true;
      if (res.Status == "Success") {
        debugger;
        this.CreditBalanceReport = res.Response.data;
        this.totalResults = res.Response.TotalRecords;
        this.currentPage = res.Response.CurrentPage;
        this.filteredRecords = res.Response.FilteredRecords;
        this.totalPages = Math.ceil(this.totalResults / this.count);
          console.log("exportData",this.exportdata)
      }
      else
      {
        this.CreditBalanceReport = [];
        swal(res.status, res.Response, 'error');
        
      }
          
  });
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
    //this.chRef.detectChanges();
    this.ddlPracticeCode=0;
    // if (this.dtuserreportdetials) {
    //   this.dtuserreportdetials.destroy();
    // }
    this.PDForm.reset();
    this.CreditBalanceReport = [];
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
   worksheet.getCell('A4').value = 'Run Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }); // Example Run Date
   worksheet.getCell('A4').alignment = { horizontal: 'left', vertical: 'middle' }; // Left-align text
   worksheet.getCell('A4').font = { bold: true };

    worksheet.mergeCells('D4:E4'); // Adjust row number accordingly
    // Set text and formatting
    worksheet.getCell('D4').value = 'Credit Balance Report-Combined';
    worksheet.getCell('D4').font = { bold: true, size: 12 };
    worksheet.getCell('D4').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`D4:E4`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D9D9D9' }, // Grey background
          // fgColor:{argb:'FFFFFF'}
        };

 
   worksheet.getCell('H4').value = 'System Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit',  year: 'numeric' }); // Example System Date
   worksheet.getCell('H4').alignment = { horizontal: 'right', vertical: 'middle' }; // Right-align text
   worksheet.getCell('H4').font = { bold: true };

    // Add table headers below the header section
    worksheet.addRow([]); // Blank row to separate header
    worksheet.addRow([]); // Blank row to separate header

    const tableHeader = [
     'Patient Name', 
      'Patient Account',
       'Bill To', 
       'Last Charge Date',
    'Last Payment Date',
    'Last Statement Date',
    'Last Claim Date', 
    'Balance'
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

//  });
// Add data rows dynamically from JSON and calculate totals
this.exportdata.forEach((row) => {
  const newRow = worksheet.addRow([
        row.PATIENT_NAME || '',
        row.PATIENT_ACCOUNT.toString() || '',
        row.BILL_TO || '',
        row.LAST_CHARGE_DATE || '',
        row.LAST_PAYMENT_DATE || '',
        row.LAST_STATEMENT_DATE || '',
        row.LAST_CLAIM_DATE || '',
        ((row.BALANCE !== null && row.BALANCE !== undefined?`$ ${parseFloat(row.BALANCE).toFixed(2)}`: '$ 0.00') || '$ 0.00'),

    ]);
// Align balance column to the right
newRow.getCell(4).alignment = { horizontal: 'right' };
newRow.getCell(5).alignment = { horizontal: 'right' };
newRow.getCell(6).alignment = { horizontal: 'right' };
newRow.getCell(7).alignment = { horizontal: 'right' };
newRow.getCell(8).alignment = { horizontal: 'right' };
    totalBalance += row.BALANCE || 0.00;
});
// // Calculate the footer row index
const footerRowIndex = this.exportdata.length + 10;

worksheet.addRow([]); // Blank row to separate header

     worksheet.getCell(`A${footerRowIndex}`).value = 'Report Total:';
          worksheet.mergeCells(`A${footerRowIndex}:G${footerRowIndex}`);

     worksheet.getCell(`A${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'left' };
     worksheet.getCell(`A${footerRowIndex}`).font = { bold: true };
     worksheet.getCell(`A${footerRowIndex}`).fill = {
       type: 'pattern',
       pattern: 'solid',
       fgColor: { argb: 'D9D9D9' }, // Light grey background
     };
 
     worksheet.getCell(`H${footerRowIndex}`).font = { bold: true };
     // // Set the total value in the balance column
worksheet.getCell(`${String.fromCharCode(65 + lastColumnIndex)}${footerRowIndex}`).value =`$ ${totalBalance.toFixed(2)}`;
worksheet.getCell(`H${footerRowIndex}`).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'D9D9D9' }, // Light grey background
};
worksheet.getCell(`H${footerRowIndex}`).alignment = { vertical: 'middle', horizontal: 'right' };

  
     // Style the footer row borders
    //  worksheet.addRow([]); // Blank row to separate header
     const footerRow = worksheet.getRow(footerRowIndex);
     footerRow.eachCell((cell) => {
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
      FileSaver.saveAs(blob, 'Credit Balance Report.xlsx');
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
  doc.text(`System Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`, rectWidth - 29  , 25, { align: 'left' });
  doc.text(`Run Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'  })}`, 50, 25, { align: 'right' });

  doc.setFontSize(11);
  doc.text('Credit Balance Report-Combined', pageWidth / 2, 25, { align: 'center' });
  doc.line(marginLeft, 29, marginLeft + rectWidth, 29);
  doc.line(marginLeft, 30, marginLeft + rectWidth, 30);

  const exportData = this.exportdata;
  const tableData = exportData.map((item) => [
    item.PATIENT_NAME,
    item.PATIENT_ACCOUNT,
    item.BILL_TO,
    item.LAST_CHARGE_DATE,
    item.LAST_PAYMENT_DATE,
    item.LAST_STATEMENT_DATE,
    item.LAST_CLAIM_DATE,
    ((item.BALANCE !== null && item.BALANCE !== undefined?`$ ${parseFloat(item.BALANCE).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
  ]);

  const tableHeaders = [
    'Patient Name', 'Patient Account', 'Bill To', 'Last Charge Date', 'Last Payment Date', 'Last Statement Date', 'Last Claim Date',
    'Balance'
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
      3: { halign: 'right' },  // Set width for the last charge date upto balance column
      4: { halign: 'right' }, 
      5: { halign: 'right' }, 
      6: { halign: 'right' }, 
      7: {  cellWidth: 23, halign: 'right'  }, 
    },
    theme: 'grid',
  });

  // Calculate the sum of the Balance column
  // const totalBalance = exportData.reduce((sum, item) => sum + (parseFloat(item.BALANCE) || 0), 0);
// Access lastAutoTable property dynamically
const autoTablePluginDoc = doc as any;
const footerY = autoTablePluginDoc.lastAutoTable.finalY ; // Position it below the table
  // Add the footer with "Report Total" and the sum
  // doc.setFontSize(12);
  // doc.text(`Report Total: ${this.formatCurrency(totalBalance)}`, marginLeft, footerY);
  // Footer rectangle dimensions
const footerHeight = 10; // Height of the footer rectangle
// const footerY = doc.internal.pageSize.getHeight() - footerHeight - 10; // Position above the bottom
const footerX = marginLeft; // Start at the left margin

// Draw the footer rectangle with a light grey background
doc.setFillColor(211, 211, 211); // Light grey color
doc.rect(footerX, footerY+5, rectWidth, footerHeight, 'F'); // 'F' for filled rectangle
doc.line(marginLeft, footerY+5, marginLeft + rectWidth, footerY+5); // Line at y = 5 with rectWidth


// Calculate the totals
let adjustmentsTotal = 0;
tableData.forEach((row) => {
  let adjustmentValue = 0;
  if (row[15]) { // Check if row[15] exists
    adjustmentValue = parseFloat(row[15].replace(/[$,]/g, '')) || 0.00; // Parse and remove formatting
  }
  adjustmentsTotal += adjustmentValue; // Add to total
});
// Add the totals
doc.setFontSize(10);

// "Report Total" below the first column
doc.setFont('helvetica', 'bold'); // Set font to bold
doc.text(`Report Total:`, marginLeft+2, footerY+11); // Below the first column
// Calculate the total of the Balance column
const balanceTotal = exportData.reduce(
  (sum, item) => sum + (parseFloat(item.BALANCE) || 0.00),
  0
);

// Format the total balance value
const formattedBalanceTotal = balanceTotal.toFixed(2);
// "Adjustments Total" aligned below its column
const adjustmentsColumnX = pageWidth - marginRight - 5 ; // Adjust X-coordinate for the "Adjustments in Period" column
doc.text(
  `$ `+ formattedBalanceTotal,
  adjustmentsColumnX,
  footerY+11,
  { align: 'right' }
);
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


  doc.save('Credit Balance Report.pdf');
}

// Helper function to capitalize the first letter of each word
capitalize(text: string): string {
  if (!text) return ''; // Handle empty strings
  return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

}
