import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl } from '@angular/forms';
import * as xlsx from 'xlsx';

import * as FileSaver from 'file-saver';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { ReportRequestModel } from '../../dynamic-reports/models/report-request.model';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'patient-birth-days-report',
    templateUrl: './patient-birth-days.component.html'
})
export class PatientBirthDays implements OnInit {
    data: any;
    exportdata:any;
    form: FormGroup;
    request: ReportRequestModel;
    dataTable: any;
    ddlPracticeCode: number = 0;
    isRouted: boolean = false;
    myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
    };
    isSearchInitiated: boolean = false;
    practicesList: SelectListViewModel[];
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
    currentMonth: string;
    maxMonth: string;
    minMonth: string;
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private datatableService: DatatableService,
        private route: ActivatedRoute,) {
        this.request = new ReportRequestModel();
        this.data = [];
        this.practicesList = [];
        this.ddlPracticeCode = 0;
    }

    ngOnInit() {
    //   const now = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, '0'); // Get current month and pad if necessary
    // this.currentMonth = `${year}-${month}`; // Set initial value to current month
    // this.maxMonth =  `${year}-12`; 
    // this.minMonth = `${year}-01`;
        this.route.queryParams.subscribe(qs => {
            debugger
            if (qs && qs['PracticeCode']) {
              this.isRouted = true;
              this.ddlPracticeCode = qs['PracticeCode'];
              //this.getPatientAgingReport(qs['PracticeCode']);
            }
          })
        this.InitializeForm();
        this.getPractices();
    }

    getPractices() {
        this.API.getData('/Setup/GetPracticeList').subscribe(d => {
            if (d.Status == "Sucess") {
                this.practicesList = d.Response;
                this.practicesList = this.practicesList.map(practice => {
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

    InitializeForm(): any {
        this.form = new FormGroup({
            month: new FormControl(null),
            practiceCode: new FormControl(null),
        });
    }
getexportdata(){
  this.ddlPracticeCode=this.request.practiceCode;
  this.request.pagedRequest.isExport=true;
  this.request.pagedRequest.page=this.currentPage;
  this.request.pagedRequest.size=this.count;
  this.API.PostData('/Report/PatientBirthDays', this.request, (res) => {
      this.isSearchInitiated = true;
      debugger
      if (res.Status == "success") {
          this.exportdata = res.Response;
         debugger
          console.log("exportData",this.exportdata)
  
          //this.updateDatatable(res.Response);
      }
      else
          swal(res.status, res.Response, 'error');
  });
}
getTableData(){
  let practicecodewithname=this.form.get('practiceCode').value
  let practiceCode= this.form.get('practiceCode').value
  if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
    const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
    practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
  }
  this.request.practiceCode=practiceCode;
  this.ddlPracticeCode=this.request.practiceCode;
  this.request.pagedRequest.isExport=false;
  this.request.pagedRequest.page=this.currentPage;
  this.request.pagedRequest.size=this.count;
  this.API.PostData('/Report/PatientBirthDays', this.request, (res) => {
      this.isSearchInitiated = true;
      if (res.Status == "success") {
        this.request.practiceCode=practicecodewithname;
          this.data = res.Response.data;
          this.totalResults = res.Response.TotalRecords;
          this.currentPage = res.Response.CurrentPage;
          this.filteredRecords = res.Response.FilteredRecords;
          this.totalPages = Math.ceil(this.totalResults / this.count);
          console.log("Data",this.data)
          //this.updateDatatable(res.Response);
      }
      else
      this.request.practiceCode=practicecodewithname;
          swal(res.status, res.Response, 'error');
  });
}
    onSearch(isExport:boolean) {
        if (this.canSearch()) {
            debugger
            if(isExport){
              this.getexportdata();
              this.getTableData();
            }
            else{
              this.getTableData();
            }
            
            
          
        } else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
    }

    updateDatatable(data) {
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
        this.data = data;
        this.chRef.detectChanges();
        const table: any = $('.datatablePatientBirthDays');
        this.dataTable = table.DataTable({
            language: {
                emptyTable: "No data available"
            },
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Patient Birthdays']),
        });
    }


    canSearch() {
        return (!Common.isNullOrEmpty(this.request.practiceCode) &&
            !Common.isNullOrEmpty(this.request.month));
    }

    onClear() {
        this.isSearchInitiated = false;
        this.chRef.detectChanges();
        this.ddlPracticeCode=0;
        //this.dataTable.destroy();
        // this.request
        this.request = new ReportRequestModel();
        this.form.reset();
        this.data = [];
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
        this.data.sort((a, b) => {
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
        this.onSearch(false)
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
      this.onSearch(false)
      }

      exportExcel() {
        debugger;
    
        // Remove PATIENT_DOBDAY from data and rename headers
        const modifiedData = this.exportdata.map(({ PATIENT_DOBDAY, ...rest }) => {
            return rest;
        });
    
        // Convert modified data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(modifiedData);
    
        // Format the headers: Remove underscores and apply bold
        const headers = Object.keys(modifiedData[0]).map(header => {
            return header.replace(/_/g, ' ');  // Remove underscores
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
               
                if (key === 'PATIENT_ACCOUNT') {
                    // Treat PATIENT_ACCOUNT as text to prevent rounding
                    worksheet[cellRef] = { v: row[key].toString(), t: 's' }; // Ensure it's stored as a string
                    worksheet['!cols'].push({ wch: row[key].toString().length + 2 });
                } else if (key === 'PATIENT_DOB' || key === 'RECENT_DOS') {
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
    
        this.saveAsExcelFile(excelBuffer, 'Patient BirthDay Report');
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
