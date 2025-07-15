import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';

import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ReportRequestModel } from '../../models/report-request.model';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { DatatableService } from '../../../services/data/datatable.service';
import { ChargesDateRangeTypes } from '../../models/report-criterias';
import { NO_DATA_AGAINST_FILTER } from '../../../constants/messages';

@Component({
    selector: 'over-all-by-dos-report',
    templateUrl: './overall-by-dos.component.html'
})
export class OverAllByDosComponent implements OnInit {
    data: any;
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
    dateRangeTypes = ChargesDateRangeTypes;
    //#region Chart
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
                    var yLabel = t.yLabel >= 1000 ? '$' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '$' + t.yLabel;
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
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private gv: GvarsService,
        private datatableService: DatatableService) {
        this.request = new ReportRequestModel();
        this.data = [];
        this.locationSelectList = [];
        this.selectedLocations = [];
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
            this.API.PostData('/Report/OverAllChargesDos', this.request, (res) => {
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
        } else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
    }

    updateDatatable(data) {
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
        if(!this.gv.isReportingPerson())
        {
            var mappedData = data.map((row) => {
                return {
                    ...row,
                    AVG__CHARGE___SPECIME: row['AVG. CHARGE / SPECIME'],
                    DELTA_GOAL: row['DELTA_GOA'],
                    dateToSort: Common.monthYearToDate(row.MONTH_YEAR, ' '),
                }
            });
        }
        else
        {
        var mappedData = data.map((row) => {
            return {
                ...row,
                dateToSort: Common.monthYearToDate(row.MONTH_YEAR, ' '),
            }
        });
    }
        this.data = mappedData;
        this.chRef.detectChanges();
        const table: any = $('.dataTableOverallChargesByDos');
        this.dataTable = table.DataTable({
            columnDefs: [
                {
                    orderable: false,
                    targets: -1
                },
                {
                    type: 'date',
                    targets: 0
                }
            ],
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Overall Charges', this.request.dateFrom, this.request.dateTo]),
            language: {
                emptyTable: "No data available"
            },
            order: [0, 'desc']
        });
    }

    updateChart(data) {
        this.barChartLabels = data.map(d => d.MONTH_YEAR);
        this.barChartData = [{ data: data.map(d => d.CHARGES), label: 'Charges Claims' }];
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
        // this.request
        this.data = [];
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
