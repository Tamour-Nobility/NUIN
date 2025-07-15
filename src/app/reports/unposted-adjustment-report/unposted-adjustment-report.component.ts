import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { DatatableService } from '../../../../src/app/services/data/datatable.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-unposted-adjustment-report',
  templateUrl: './unposted-adjustment-report.component.html',
  styleUrls: ['./unposted-adjustment-report.component.css']
})
export class UnpostedAdjustmentReportComponent implements OnInit {

  listPracticesList: any;
  SearchForm: FormGroup;
  PDForm: FormGroup;
  PracticeCode: string | number = 0;
  strFromDate: string;
  firstLoad:boolean = false;
  strToDate: string;
  UnpostedAdjustmentReports :any;
  dataTable: any;

  isSearchInitiated: boolean = false;
  exportdata:any;
  public myDatePickerOptions: IMyDrpOptions = {
      dateFormat: 'mm/dd/yyyy',
      height: '25px',
      width: '93%',
    };
  constructor(private API: APIService,private datePipe: DatePipe,private fb: FormBuilder,private chRef: ChangeDetectorRef,public datatableService: DatatableService,private spinner: NgxSpinnerService) { 
    this.SearchForm = this.fb.group({
      PracCode: [''] 
    });
    this.PDForm  = this.fb.group({

    });
    this.UnpostedAdjustmentReports = [];
  }

  ngOnInit() {

    this.PDForm = this.fb.group({
      practice: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required]
    });
    this.getPractices();
    console.log("this.PDForm",this.PDForm)
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
          console.log(this.listPracticesList)
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onsearch(){
    this.getUnpostedAdjustmentReport();
  }
  getUnpostedAdjustmentReport() {
    debugger
    console.log("this is before API call=>this.UnpostedAdjustmentReports",this.UnpostedAdjustmentReports)
    this.isSearchInitiated=true;
    this.firstLoad = true
    let practiceCode=this.PracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }

    this.API.getData('/Report/ERAUnpostedAdjReport?practiceCode=' +
      practiceCode+ '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
     data => {
      console.log("this is after API call  before data assigning",this.UnpostedAdjustmentReports)
      console.log("this is after API call to empty data list",this.UnpostedAdjustmentReports)
       if (data.Status == 'Success') {
        if (this.dataTable) {
          this.dataTable.destroy();
          this.dataTable = null;
        }
        this.UnpostedAdjustmentReports = data.Response;
        this.chRef.detectChanges(); 
                    // if (this.UnpostedAdjustmentReports.length > 0) {
                    //   const table: any = $('.dataTablePR');
                    //   this.dataTable = table.DataTable({
                    //     "scrollX": true,
                    //     dom: this.datatableService.getDom(),
                    //     buttons: this.datatableService.getExportBtn(['ERA Unposted payments report', practiceCode +'-'+ moment(new Date()).format("MM/DD/YYYY")]),
                    //     language: {
                    //       emptyTable: "No data available"
                    //     }
                    //   });
                    // }


                    if (this.UnpostedAdjustmentReports.length > 0) {
                      const table: any = $('.dataTablePR');
                      this.dataTable = table.DataTable({
                          "scrollX": true,
                          dom: this.datatableService.getDom(),
                          buttons: this.getExportButtons(["Unposted Adjustment Report-" + this.PracticeCode]),
                          language: {
                              emptyTable: "No data available"
                          }
                      });
                  }
                  this.chRef.detectChanges();

        // this.isSearchInitiated=true;
        // this.exportdata = data.Response;
       }
     }
   )
      

 }
 onDateChanged(e, dType: string) {
  if (dType == 'From') {
    this.strFromDate = e.formatted;
  }
  else {
    this.strToDate = e.formatted;
  }
}
  onClear() {
    this.isSearchInitiated = false;
    // this.chRef.detectChanges();
    // this.ddlPracticeCode=0;
    // if (this.dtInsuranceDetail) {
    //   this.dtInsuranceDetail.destroy();
    // }
    this.PDForm.reset();
    this.UnpostedAdjustmentReports = [];
  }
  exportExcelPDF(){
  this.exportdata= this.UnpostedAdjustmentReports;
  this.generatePDF()
  }

  generateTitle(title: string[]) {
    if (title && title.length > 0)
        return title.join(' - ')
}
  getExportButtons(title: string[], disableButtons?: boolean) {
    var generatedName = this.generateTitle(title);
    return [
        {
            extend: 'excel',
            className: "btn-sm button-spacing",
            action: () => this.ExportToExcel(),
            text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
            title: generatedName,
            enabled: !disableButtons,  // Keeps the Excel export as it is
        },
        {
            text: '<i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF',
            className: "btn-sm button-spacing",
            action: () => this.exportExcelPDF(), // Call your custom function here
            enabled: !disableButtons,
        }
    ];
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
    //doc.text(this.capitalize(this.selectedPracticeDetail[0].Name), pageWidth / 2, 8, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal'); // Set font to bold
    //doc.text(this.capitalize(this.selectedPracticeDetail[0].Address), pageWidth / 2, 14, { align: 'center' });
    //doc.text(this.capitalize(this.selectedPracticeDetail[0].City) + ' '+this.selectedPracticeDetail[0].State + ' '+this.selectedPracticeDetail[0].Zip, pageWidth / 2, 19, { align: 'center' });
    doc.setFont('helvetica', 'bold'); // Set font to bold
    doc.text(`System Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`, rectWidth - 29  , 25, { align: 'left' });
    doc.text(`Run Date: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'  })}`, 50, 25, { align: 'right' });
  
    doc.setFontSize(11);
    doc.text('Unposted Adjustment Report '+this.PracticeCode, pageWidth / 2, 25, { align: 'center' });
    doc.line(marginLeft, 29, marginLeft + rectWidth, 29);
    doc.line(marginLeft, 30, marginLeft + rectWidth, 30);
  
    const exportData = this.exportdata;
    const tableData = exportData.map((item) => [
      item.CLAIM_NO,
      this.datePipe.transform(item.DOS, 'MM/dd/yyyy'),
      item.Patient_Account,
      item.PATIENT_NAME,
      item.PAID_PROC_CODE,
      item.BILLING_PHYSICIAN,
      this.datePipe.transform(item.DATE_ENTRY, 'MM/dd/yyyy'),
      item.PAYMENT_SOURCE,
      ((item.AMOUNT_PAID !== null && item.AMOUNT_PAID !== undefined?`$${parseFloat(item.AMOUNT_PAID).toFixed(2)}`: '$0.00') || '$0.00'),
      ((item.SKIPPED_AMOUNT !== null && item.SKIPPED_AMOUNT !== undefined?`$${parseFloat(item.SKIPPED_AMOUNT).toFixed(2)}`: '$0.00') || '$0.00'),
      ((item.REJECT_AMOUNT !== null && item.REJECT_AMOUNT !== undefined?`$${parseFloat(item.REJECT_AMOUNT).toFixed(2)}`: '$0.00') || '$0.00'),
      item.Insurance_NAME,
      item.CHECK_NO,
      this.datePipe.transform(item.CHECK_DATE, 'MM/dd/yyyy'),
    ]);
  
    const tableHeaders = [
      'Claim #', 'DOS', 'Patient Account#', 'Patient Name', 'CPT Code', 'Billing Provider', 'Entry Date','Payment Source',
      'Amount Paid','Skipped Amount','Amount Rejected','Insurance Name','Check#','Check Date'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 34,
      styles: {
        fontSize: 8,
        cellPadding: 1.5,
      },
      margin: { bottom: 25 },
      pageBreak: 'auto',  // Automatically breaks to the next page if content exceeds the page height
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontSize: 9,
        lineWidth: 0.1,
        lineColor: [211, 211, 211],
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, // CLAIM_NO
        1: { cellWidth: 'auto' }, // DOS
        2: { cellWidth: 'auto' }, // Patient Account#
        3: { cellWidth: 'auto' }, // Patient Name
        4: { cellWidth: 'auto' }, // CPT Code
        5: { cellWidth: 'auto' }, // Billing Provider
        6: { cellWidth: 'auto' }, // Entry Date
        7: { cellWidth: 'auto' }, // Payment Source
        8: { cellWidth: 'auto' }, // Amount Paid
        9: { cellWidth: 'auto' }, // Skipped Amount
        10: { cellWidth: 'auto' }, // Amount Rejected
        11: { cellWidth: 'auto' }, // Insurance Name
        12: { cellWidth: 'auto' }, // Check#
        13: { cellWidth: 'auto' }, // Check Date
      },
      theme: 'grid',
      didDrawPage: (data) => {
        // Check if we need to move content to a new page
        const pageHeight = doc.internal.pageSize.getHeight();
        if (data.cursor.y > pageHeight - 20) {
          doc.addPage(); // Add a new page if it exceeds the page height
        }
      },
    });


    //this code is working fine without page 1 0f 2
    // autoTable(doc, {
    //   head: [tableHeaders],
    //   body: tableData,
    //   startY: 34,
    //   styles: {
    //     fontSize: 9,
    //     cellPadding: 2,
    //   },
    //   margin: { bottom: 25 },
    //   headStyles: {
    //     fillColor: [200, 200, 200],
    //     textColor: [0, 0, 0],
    //     fontSize: 9,
    //     lineWidth: 0.1,
    //     lineColor: [211, 211, 211],
    //     halign: 'left',
    //     valign: 'middle',
    //   },
    //   columnStyles: {
    //     0: { cellWidth: 'auto' }, // CLAIM_NO
    //     1: { cellWidth: 'auto' }, // DOS
    //     2: { cellWidth: 'auto' }, // Patient Account#
    //     3: { cellWidth: 'auto' }, // Patient Name
    //     4: { cellWidth: 'auto' }, // CPT Code
    //     5: { cellWidth: 'auto' }, // Billing Provider
    //     6: { cellWidth: 'auto' }, // Entry Date
    //     7: { cellWidth: 'auto' }, // Payment Source
    //     8: { cellWidth: 'auto' }, // Amount Paid
    //     9: { cellWidth: 'auto' }, // Skipped Amount
    //     10: { cellWidth: 'auto' }, // Amount Rejected
    //     11: { cellWidth: 'auto' }, // Insurance Name
    //     12: { cellWidth: 'auto' }, // Check#
    //     13: { cellWidth: 'auto' }, // Check Date
    //   },
    //   theme: 'grid',
    // });
  
    // autoTable(doc, {
    //   head: [tableHeaders],
    //   body: tableData,
    //   startY: 34,
    //   styles: {
    //     fontSize: 9,
    //   },
    //   margin: { bottom: 25 }, // Adjust as needed
  
    //   headStyles: {
    //     fillColor: [200, 200, 200],
    //     textColor: [0, 0, 0],
    //     fontSize: 9,
    //     lineWidth: 0.1,
    //     lineColor: [211, 211, 211], // Light grey for header lines as well
    //     halign: 'left',           // Horizontally center the header text
    //     valign: 'middle',           // Vertically center the header text
    //     cellPadding: 2,             // Adjust cell padding for header height
  
    //   },
    //   columnStyles: {
    //     0: { halign: 'left', cellWidth: 20 },
    //     1: { halign: 'left', cellWidth: 25 },
    //     3: { halign: 'left', cellWidth: 30 },
    //     // 3: { halign: 'right' },  // Set width for the last charge date upto balance column
    //     4: { halign: 'left' , cellWidth: 13}, 
    //     5: { halign: 'left' , cellWidth: 20}, 
    //     6: { halign: 'left' , cellWidth: 20}, 
    //     7: {  cellWidth: 23, halign: 'left'  }, 
    //     8: {  cellWidth: 17, halign: 'left'  }, 
    //     9: {  cellWidth: 17, halign: 'left'  }, 
    //     10: {  cellWidth: 17, halign: 'left'  }, 
    //     11: {  cellWidth: 30, halign: 'left'  }, 
    //   },
    //   theme: 'grid',
    // });
  
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
  // doc.rect(footerX, footerY+5, rectWidth, footerHeight, 'F'); // 'F' for filled rectangle
  
  
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
  // Calculate the total of the Balance column
  
  // Format the total balance value
  // "Adjustments Total" aligned below its column

  
  
    // Add page numbers
    doc.setFont('helvetica', 'normal'); // Set font to bold
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
    }
    doc.save(`Unposted Adjustment Report-${this.PracticeCode}.pdf`);
  }

  ExportToExcel() {
    debugger
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
  
    // Table columns count (to be dynamically adjusted)
    const lastColumnIndex = 7; // 'Balance' column is the 8th column (index 8)
  
     // Add a row with two dates: left (Run Date) and right (System Date)
     worksheet.getCell('A4').value = 'Run Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'}); // Example Run Date
     worksheet.getCell('A4').alignment = { horizontal: 'left', vertical: 'middle' }; // Left-align text
     worksheet.getCell('A4').font = { bold: true };
  
      worksheet.mergeCells('D4:E4'); // Adjust row number accordingly
      // Set text and formatting
      worksheet.getCell('F4').value = 'Unposted Adjustment Report';
      worksheet.getCell('F4').font = { bold: true, size: 9 };
      worksheet.getCell('F4').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`D4:E4`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D9D9D9' }, // Grey background
            // fgColor:{argb:'FFFFFF'}
          };
  
   
     worksheet.getCell('N4').value = 'System Date: '+ new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'}); // Example System Date
     worksheet.getCell('N4').alignment = { horizontal: 'right', vertical: 'middle' }; // Right-align text
     worksheet.getCell('N4').font = { bold: true };
  
      // Add table headers below the header section
      worksheet.addRow([]); // Blank row to separate header
      worksheet.addRow([]); // Blank row to separate header
      const tableHeader = [
       'Claim #', 
        'DOS',
         'Patient Account#', 
         'Patient Name',
      'CPT Code',
      'Billing Provider',
      'Entry Date', 
      'Payment Source',
      'Amount Paid',
      'Skipped Amount',
      'Amount Rejected',
      'Insurance Name',
      'Check#',
      'Check Date'      
      ];
      
      const headingRect12 = worksheet.getCell('A4');
    headingRect12.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect0 = worksheet.getCell('D1');
    headingRect0.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect111 = worksheet.getCell('D2');
    headingRect111.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect22 = worksheet.getCell('D3');
    headingRect22.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect103 = worksheet.getCell('E1');
    headingRect103.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect104 = worksheet.getCell('E2');
    headingRect104.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect105 = worksheet.getCell('E3');
    headingRect105.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect106 = worksheet.getCell('I1');
    headingRect106.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect107 = worksheet.getCell('I2');
    headingRect107.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect108 = worksheet.getCell('I3');
    headingRect108.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect109 = worksheet.getCell('I4');
    headingRect109.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect110 = worksheet.getCell('J1');
    headingRect110.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect500 = worksheet.getCell('J2');
    headingRect500.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect501 = worksheet.getCell('J3');
    headingRect501.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect502 = worksheet.getCell('J4');
    headingRect502.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect505 = worksheet.getCell('K1');
    headingRect505.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect506 = worksheet.getCell('K2');
    headingRect506.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect507 = worksheet.getCell('K3');
    headingRect507.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect508 = worksheet.getCell('K4');
    headingRect508.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect509 = worksheet.getCell('L1');
    headingRect509.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect510 = worksheet.getCell('L2');
    headingRect510.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect511 = worksheet.getCell('L3');
    headingRect511.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect512 = worksheet.getCell('L4');
    headingRect512.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect513 = worksheet.getCell('M1');
    headingRect513.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect514 = worksheet.getCell('M2');
    headingRect514.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect515 = worksheet.getCell('M3');
    headingRect515.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect516 = worksheet.getCell('M4');
    headingRect516.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect517 = worksheet.getCell('N1');
    headingRect517.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect518 = worksheet.getCell('N2');
    headingRect518.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect519 = worksheet.getCell('N3');
    headingRect519.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect520 = worksheet.getCell('N4');
    headingRect520.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect503 = worksheet.getCell('B4');
    headingRect503.fill = {
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
    const headingRect9 = worksheet.getCell('I7');
    headingRect9.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect10 = worksheet.getCell('J7');
    headingRect10.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect11 = worksheet.getCell('K7');
    headingRect11.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect60 = worksheet.getCell('L7');
    headingRect60.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect64 = worksheet.getCell('M7');
    headingRect64.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9D9D9' }, // Grey background
    };
    const headingRect65 = worksheet.getCell('N7');
    headingRect65.fill = {
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
  this.exportdata = this.UnpostedAdjustmentReports
  //  });
  // Add data rows dynamically from JSON and calculate totals
  this.exportdata.forEach((row) => {
     const newRow = worksheet.addRow([
          row.CLAIM_NO || '',
          this.datePipe.transform(row.DOS, 'MM/dd/yyyy'),
          `${row.Patient_Account}`,
          row.PATIENT_NAME,
          row.PAID_PROC_CODE,
          row.BILLING_PHYSICIAN,
          this.datePipe.transform(row.DATE_ENTRY, 'MM/dd/yyyy'),
          row.PAYMENT_SOURCE,
          ((row.AMOUNT_PAID !== null && row.AMOUNT_PAID !== undefined?`$ ${parseFloat(row.AMOUNT_PAID).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
          ((row.SKIPPED_AMOUNT !== null && row.SKIPPED_AMOUNT !== undefined?`$ ${parseFloat(row.SKIPPED_AMOUNT).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
          ((row.REJECT_AMOUNT !== null && row.REJECT_AMOUNT !== undefined?`$ ${parseFloat(row.REJECT_AMOUNT).toFixed(2)}`: '$ 0.00') || '$ 0.00'),
          row.Insurance_NAME,
          row.CHECK_NO,
          this.datePipe.transform(row.CHECK_DATE, 'MM/dd/yyyy'),
        ]);;
        newRow.getCell(1).alignment = { horizontal: 'left' };
        newRow.getCell(6).alignment = { horizontal: 'left' };
  });
  
  
      // Save the workbook
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(blob, `Unposted Adjustment Report-${this.PracticeCode}.xlsx`);
      });
    
  }
}
