import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';

import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ReportRequestModel } from '../../models/report-request.model';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { DatatableService } from '../../../services/data/datatable.service';
import { ChargesDateRangeTypes } from '../../models/report-criterias';
import { NO_DATA_AGAINST_FILTER } from '../../../constants/messages';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

@Component({
    selector: 'by-cpt-dos-report',
    templateUrl: './by-cpt-dos.component.html'
})
export class ByCPTDos implements OnInit {
    form: FormGroup;
    request: ReportRequestModel;
    dataTable: any;
    isSearchInitiated: boolean = false;
    today = new Date();
    isDateValid: boolean;
    myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1,
        },
    };
    locationSelectList: SelectListViewModel[];
    selectedLocations: SelectListViewModel[];
    locationsSettings = {};
    mappedReportData: any[] = [];
    reportColumns: any[] = [];
    dateRangeTypes = ChargesDateRangeTypes;
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private gv: GvarsService,
        private datatableService: DatatableService,
        private currency: CurrencyPipe) {
        this.request = new ReportRequestModel();
        this.locationSelectList = [];
        this.selectedLocations = [];
        this.data = [];
        this.data2 = [];
    }
   //#region Chart
   data: any;
   data2: any;
   selectedData: any[] = [];
   selectedCPT:any;

   clickedChargeCode:any;
   public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
        xAxes: [{}], yAxes: [{
            ticks: {
                callback: function (value, index, values) {
                    return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
                }
            }
        }]
    },
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'end',
        }
    },
    tooltips: {
        callbacks: {
            label: function (t, d) {
                var xLabel = d.datasets[t.datasetIndex].label;
               var yLabel = '';
               if (t.yLabel >= 1000) {
                 if (t.label == 'SPECIMENS') {
                   yLabel = t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                 } else {
                    yLabel = '$' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                 }
               } else {
                 yLabel = t.label === 'Charges' ? '$' + t.yLabel.toString() : t.yLabel.toString();
               }
                return xLabel + ': ' + yLabel;
            }
        }
    }
};

public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartLabels: string[] = [];
public barChartData: ChartDataSets[] = [{ data: [], label: 'Charges Claims' }];

//#endregion



updateChart(data) {
      

    const months = Object.keys(data[0]).filter(key => key !== 'Charge Code' && key !== 'Type');
    const convertedData = [];
    
    for (const month of months) {
      const monthData = {
        month: month,
      };
    
      for (const obj of data) {
        monthData[obj.Type] = obj[month];
      }
    
      convertedData.push(monthData);

    }

      this.barChartData = [
        { data: convertedData.map(d => d['CHARGES']), label: 'CHARGES' },
        { data: convertedData.map(d => d['SPECIMENS']), label: 'SPECIMENS' }
      ];
      
       // this.mappedReportData = data.map(obj => Object.values(obj).map((v, index) => index > 1 ? this.currency.transform(v) : v));

       
// Extracting the month values from convertedData
const barChartLabels = convertedData.map(d => d.month);
// Assigning the barChartLabels to the property
this.barChartLabels = barChartLabels;
}

    ngOnInit() {
        this.InitializeForm();
        this.getLocations()
        this.locationsSettings = {
            text: "Select Locations",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class-ng2-multi-dropdown",
            primaryKey: "Id",
            labelKey: "Name",
            noDataLabel: "Search Locations...",
            enableSearchFilter: true,
            badgeShowLimit: 3
        };
        this.request.dateType = 'dos';
        this.isDateValid = false;
    }

    getLocations() {
        this.API.getData(`/Demographic/GetLocationSelectList?searchText=''&practiceCode=${this.gv.currentUser.selectedPractice.PracticeCode}&all=${true}`).subscribe(res => {
            if (res.Status === 'Success')
                this.locationSelectList = res.Response;
        });
    }

    InitializeForm(): any {
        this.form = new FormGroup({
            dateRange: new FormControl(null),
            location: new FormControl(null),
            dateRangeType: new FormControl(null, [Validators.required])
        });
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.request.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
        this.request.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    }

    onSearch() {
        if (this.canSearch()) {
            this.request.locationCode = this.selectedLocations.map(l => l.Id);
            this.request.practiceCode = this.gv.currentUser.selectedPractice.PracticeCode;
            this.API.PostData('/Report/ByCPTDos', this.request, (res) => {
                this.isSearchInitiated = true;
                if (res.Status == "success" && res.Response && res.Response.length > 0) {

                    this.data2=res.Response;

                    this.updateDatatable(res.Response);
                      
                  //  this.updateChart(res.Response)
                 
                  //to show graph for one
                  this.handleRowClick(0);
                }
                else {
                    this.toastService.warning(NO_DATA_AGAINST_FILTER, 'No result');
                    this.updateDatatable(res.Response);
                    this.clickedChargeCode=res.Response[0];
                }
            });
        } else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
    }

    updateDatatable(data) {
        this.mappedReportData = [];
        this.reportColumns = [];
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
       // this.mappedReportData = data.map(obj => Object.values(obj).map((v, index) => index > 1 ? this.currency.transform(v) : v));

        this.mappedReportData = data.map(obj => {
            return Object.values(obj).map((v, index) => {
              if (index > 1 && obj.Type.includes('CHARGES')) {
                return this.currency.transform(v);
              } else {
                return v;
              }
            });
          });

        if (data.length > 0)
            this.reportColumns = Object.keys(data[0]).map((key) => ({ title: key }));
        this.chRef.detectChanges();
        const table: any = $('.dataTableByCPTDos');
        this.dataTable = table.DataTable({
            "data": this.mappedReportData,
            "columns": this.reportColumns,
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Charges by CPT', this.request.dateFrom, this.request.dateTo]),
        });

  // Attach click event listener to table rows
  table.on('click', 'tr', (event) => {
//    const rowData = this.dataTable.row(event.currentTarget).data();
    const rowIndex = this.dataTable.row(event.currentTarget).index();
    this.handleRowClick(rowIndex);
  });

    }

  
handleRowClick(rowIndex: number) {
      
      this.data=this.getFormattedRowData(rowIndex);
      this.updateChart(this.data);
  }
  
getFormattedRowData(rowIndex: number) {
    const prevIndex = rowIndex - 1;
    const nextIndex = rowIndex + 1;

    if(rowIndex==0 || rowIndex%2==0){
        this.selectedData.push(this.data2[nextIndex])
    }
    else{
        this.selectedData.push(this.data2[prevIndex])
    }
    this.selectedData.push(this.data2[rowIndex])

    this.selectedCPT = this.data2[rowIndex]['Charge Code'];
    return this.selectedData;
  }
    

    canSearch() {
        return ((!Common.isNullOrEmpty(this.selectedLocations) && this.selectedLocations.length > 0) &&
            !Common.isNullOrEmpty(this.request.dateFrom) &&
            !Common.isNullOrEmpty(this.request.dateTo) &&
            this.form.valid && this.isDateValid);
    }

    onClear() {
        this.chRef.detectChanges();
        this.dataTable && this.dataTable.destroy();
        this.mappedReportData = [];
        this.reportColumns = [];
        this.selectedLocations = [];
        this.isSearchInitiated = false;
        this.form.reset();
        this.request = new ReportRequestModel();
    }

    onDeSelectAllLocations() {
        this.selectedLocations = [];
    }

    inputFieldChanged({ valid }) {
        this.isDateValid = valid;
    }
}
