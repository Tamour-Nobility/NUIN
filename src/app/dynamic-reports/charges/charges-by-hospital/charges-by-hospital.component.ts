import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { CurrencyPipe } from '@angular/common'

import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ReportRequestModel } from '../../models/report-request.model';
import { DatatableService } from '../../../services/data/datatable.service';
import { ChargesDateRangeTypes } from '../../models/report-criterias';
import { NO_DATA_AGAINST_FILTER } from '../../../constants/messages';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

@Component({
    selector: 'charges-by-hospital-report',
    templateUrl: './charges-by-hospital.component.html'
})
export class ChargesByHospital implements OnInit {
    form: FormGroup;
    request: ReportRequestModel;
    dataTable: any;
    isSearchInitiated: boolean = false;
    mappedReportData: any[] = [];
    reportColumns: any[] = [];
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
    dateRangeTypes = ChargesDateRangeTypes;
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private gv: GvarsService,
        private datatableService: DatatableService,
        public currency: CurrencyPipe,
    ) {
        this.request = new ReportRequestModel();
        this.data = [];
    }
   //#region Chart
   data: any;
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
                 yLabel = t.label === 'Charges $' ? '$' + t.yLabel.toString() : t.yLabel.toString();
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
      

    const months = Object.keys(data[0]).filter(key => key !== 'Practice Name' && key !== 'Type');
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
        { data: convertedData.map(d => d['Charges $']), label: 'Charges $' },
        { data: convertedData.map(d => d['SPECIMENS']), label: 'SPECIMENS' }
      ];

// Extracting the month values from convertedData
const barChartLabels = convertedData.map(d => d.month);
// Assigning the barChartLabels to the property
this.barChartLabels = barChartLabels;

    // this.barChartLabels = data.map(d => d.Type);
    // this.barChartData = [{ data: data.map(d => d.Type), label: 'TYPE' }];
}





    ngOnInit() {
        this.InitializeForm();
        this.request.dateType = 'dos';
        this.isDateValid = false;
    }

    InitializeForm(): any {
        this.form = new FormGroup({
            dateRange: new FormControl(null),
            dateRangeType: new FormControl(null, [Validators.required])
        });
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.request.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
        this.request.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    }

    onSearch() {
        if (this.canSearch()) {
            this.request.practiceCode = this.gv.currentUser.selectedPractice.PracticeCode;
            this.API.PostData('/Report/ByHospitalDos', this.request, (res) => {
                this.isSearchInitiated = true;
                if (res.Status == "success" && res.Response && res.Response.length > 0) {
                    this.updateChart(res.Response);
                    this.updateDatatable(res.Response);
                }
                else {
                    this.toastService.warning(NO_DATA_AGAINST_FILTER, 'No result');
                    this.updateDatatable(res.Response);
                }
            });
        }
        else {
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
      
//        this.mappedReportData = data.map(obj => Object.values(obj).map((v, index) => ((index > 1)&&v[0]=="Charges $") ? this.currency.transform(v) : v));
      
        this.mappedReportData = data.map(obj => {
            return Object.values(obj).map((v, index) => {
              if (index > 1 && obj.Type.includes('Charges $')) {
                return this.currency.transform(v);
              } else {
                return v;
              }
            });
          });
          
          this.data=this.mappedReportData;
        if (data.length > 0)
            this.reportColumns = Object.keys(data[0]).map((key) => ({ title: key }));
        this.chRef.detectChanges();
        const table: any = $('.dataTableByHospital');
        this.dataTable = table.DataTable({
            "data": this.mappedReportData,
            "columns": this.reportColumns,
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Charges by Hospital', this.request.dateFrom, this.request.dateTo]),
        });
    }

    canSearch() {
        return (!Common.isNullOrEmpty(this.request.dateFrom) &&
            !Common.isNullOrEmpty(this.request.dateTo) &&
            this.form.valid && this.isDateValid);
    }

    onClear() {
        this.chRef.detectChanges();
        this.dataTable && this.dataTable.destroy();
        this.mappedReportData = [];
        this.reportColumns = [];
        this.isSearchInitiated = false;
        this.form.reset();
        this.request = new ReportRequestModel();
        this.data=[];
    }

    inputFieldChanged({ valid }) {
        this.isDateValid = valid;
    }
}
